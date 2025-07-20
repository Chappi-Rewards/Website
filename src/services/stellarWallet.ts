import * as StellarSdk from 'stellar-sdk';
import axios from 'axios';

// Stellar network configuration
const STELLAR_NETWORK = 'testnet'; // Change to 'public' for mainnet
const HORIZON_URL = STELLAR_NETWORK === 'testnet' 
  ? 'https://horizon-testnet.stellar.org'
  : 'https://horizon.stellar.org';

const FEDERATION_DOMAIN = 'chappi.com';
const FEDERATION_SERVER_URL = `https://federation.${FEDERATION_DOMAIN}`;

// Initialize Stellar SDK
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

export interface StellarWallet {
  publicKey: string;
  secretKey: string;
  username?: string;
  federatedAddress?: string;
}

export interface UsernameValidation {
  isValid: boolean;
  isAvailable: boolean;
  errors: string[];
}

export interface FederationRecord {
  stellar_address: string;
  account_id: string;
  memo_type?: string;
  memo?: string;
}

export class StellarWalletService {
  private static instance: StellarWalletService;
  private usernameMappings: Map<string, string> = new Map(); // username -> publicKey
  private walletCache: Map<string, StellarWallet> = new Map(); // publicKey -> wallet

  private constructor() {
    // Load existing mappings from localStorage
    this.loadUsernameMappings();
  }

  public static getInstance(): StellarWalletService {
    if (!StellarWalletService.instance) {
      StellarWalletService.instance = new StellarWalletService();
    }
    return StellarWalletService.instance;
  }

  /**
   * Check if a Stellar account exists on the network
   */
  private async checkAccountExists(publicKey: string): Promise<boolean> {
    try {
      await server.loadAccount(publicKey);
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Generate a new Stellar wallet with optional username
   */
  public async generateWallet(username?: string): Promise<StellarWallet> {
    try {
      // Generate new Stellar keypair
      const keypair = StellarSdk.Keypair.random();
      
      const wallet: StellarWallet = {
        publicKey: keypair.publicKey(),
        secretKey: keypair.secret(),
        username,
        federatedAddress: username ? `${username}*${FEDERATION_DOMAIN}` : undefined
      };

      // If username provided, validate and register it
      if (username) {
        const validation = await this.validateUsername(username);
        if (!validation.isValid || !validation.isAvailable) {
          throw new Error(`Username validation failed: ${validation.errors.join(', ')}`);
        }

        // Register username mapping
        await this.registerUsername(username, wallet.publicKey);
      }

      // Cache the wallet
      this.walletCache.set(wallet.publicKey, wallet);

      // Fund testnet account (for development)
      if (STELLAR_NETWORK === 'testnet') {
        await this.fundTestnetAccount(wallet.publicKey);
        
        // Wait a moment for the account to be created on the network
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify account exists after funding
        const accountExists = await this.checkAccountExists(wallet.publicKey);
        if (!accountExists) {
          throw new Error('Failed to create account on Stellar testnet. Please try again.');
        }
      }

      return wallet;
    } catch (error) {
      console.error('Error generating Stellar wallet:', error);
      throw new Error(`Failed to generate wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate username according to Stellar federation standards
   */
  public async validateUsername(username: string): Promise<UsernameValidation> {
    const errors: string[] = [];
    let isValid = true;
    let isAvailable = true;

    // Basic validation rules
    if (!username || username.length < 3) {
      errors.push('Username must be at least 3 characters long');
      isValid = false;
    }

    if (username.length > 32) {
      errors.push('Username must be no more than 32 characters long');
      isValid = false;
    }

    // Check for valid characters (alphanumeric, hyphens, underscores)
    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(username)) {
      errors.push('Username can only contain letters, numbers, hyphens, and underscores');
      isValid = false;
    }

    // Check if username starts/ends with hyphen or underscore
    if (username.startsWith('-') || username.startsWith('_') || 
        username.endsWith('-') || username.endsWith('_')) {
      errors.push('Username cannot start or end with hyphens or underscores');
      isValid = false;
    }

    // Check availability
    if (isValid) {
      isAvailable = await this.checkUsernameAvailability(username);
      if (!isAvailable) {
        errors.push('Username is already taken');
      }
    }

    return {
      isValid,
      isAvailable,
      errors
    };
  }

  /**
   * Check if username is available
   */
  private async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      // Check local mappings first
      if (this.usernameMappings.has(username.toLowerCase())) {
        return false;
      }

      // For development, we'll primarily rely on local mappings
      // since the federation server is not available
      return true;
    } catch (error) {
      console.warn('Error checking username availability:', error);
      // If there's an error, assume available for development
      return true;
    }
  }

  /**
   * Register username to public key mapping
   */
  private async registerUsername(username: string, publicKey: string): Promise<void> {
    try {
      // Store mapping locally
      this.usernameMappings.set(username.toLowerCase(), publicKey);
      this.saveUsernameMappings();

      // In a real implementation, this would register with the federation server
      await this.registerWithFederationServer(username, publicKey);
    } catch (error) {
      console.error('Error registering username:', error);
      throw new Error(`Failed to register username: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Resolve federated address to Stellar account ID
   */
  public async resolveFederatedAddress(federatedAddress: string): Promise<FederationRecord | null> {
    try {
      const [username, domain] = federatedAddress.split('*');
      
      if (domain !== FEDERATION_DOMAIN) {
        throw new Error(`Unsupported federation domain: ${domain}`);
      }

      // Check local mappings first
      const publicKey = this.usernameMappings.get(username.toLowerCase());
      if (publicKey) {
        return {
          stellar_address: federatedAddress,
          account_id: publicKey
        };
      }

      // For development, we'll skip the federation server query
      // since it's not available in the current setup
      console.warn(`Federation server not available for resolving: ${federatedAddress}`);
      return null;
    } catch (error) {
      console.error('Error resolving federated address:', error);
      return null;
    }
  }

  /**
   * Resolve Stellar account ID to federated address
   */
  public async resolveAccountId(accountId: string): Promise<FederationRecord | null> {
    try {
      // Check local mappings
      for (const [username, publicKey] of this.usernameMappings.entries()) {
        if (publicKey === accountId) {
          return {
            stellar_address: `${username}*${FEDERATION_DOMAIN}`,
            account_id: accountId
          };
        }
      }

      // For development, we'll skip the federation server query
      console.warn(`Federation server not available for resolving account: ${accountId}`);
      return null;
    } catch (error) {
      console.error('Error resolving account ID:', error);
      return null;
    }
  }

  /**
   * Send payment using username or Stellar address
   */
  public async sendPayment(
    fromWallet: StellarWallet,
    toAddress: string, // Can be username*domain.com or Stellar public key
    amount: string,
    assetCode: string = 'XLM',
    memo?: string
  ): Promise<string> {
    try {
      let destinationAccountId: string;
      let paymentMemo: StellarSdk.Memo | undefined;

      // Resolve destination address
      if (toAddress.includes('*')) {
        // Federated address
        const federationRecord = await this.resolveFederatedAddress(toAddress);
        if (!federationRecord) {
          throw new Error(`Could not resolve federated address: ${toAddress}`);
        }
        destinationAccountId = federationRecord.account_id;
        
        // Use federation memo if provided
        if (federationRecord.memo_type && federationRecord.memo) {
          paymentMemo = this.createMemo(federationRecord.memo_type, federationRecord.memo);
        }
      } else {
        // Direct Stellar address
        if (!StellarSdk.StrKey.isValidEd25519PublicKey(toAddress)) {
          throw new Error(`Invalid Stellar address: ${toAddress}`);
        }
        destinationAccountId = toAddress;
      }

      // Check if destination account exists
      const destinationExists = await this.checkAccountExists(destinationAccountId);
      if (!destinationExists) {
        throw new Error(`Destination account does not exist: ${destinationAccountId}`);
      }

      // Add custom memo if provided
      if (memo && !paymentMemo) {
        paymentMemo = StellarSdk.Memo.text(memo);
      }

      // Load source account
      const sourceKeypair = StellarSdk.Keypair.fromSecret(fromWallet.secretKey);
      const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

      // Create asset
      const asset = assetCode === 'XLM' 
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(assetCode, destinationAccountId); // Simplified asset creation

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: STELLAR_NETWORK === 'testnet' 
          ? StellarSdk.Networks.TESTNET 
          : StellarSdk.Networks.PUBLIC
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: destinationAccountId,
          asset: asset,
          amount: amount
        }))
        .setTimeout(30);

      // Add memo if provided
      if (paymentMemo) {
        transaction.addMemo(paymentMemo);
      }

      const builtTransaction = transaction.build();

      // Sign transaction
      builtTransaction.sign(sourceKeypair);

      // Submit transaction
      const result = await server.submitTransaction(builtTransaction);
      return result.hash;
    } catch (error) {
      console.error('Error sending payment:', error);
      throw new Error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get wallet balance
   */
  public async getWalletBalance(publicKey: string): Promise<Array<{asset: string, balance: string}>> {
    try {
      // Check if account exists first
      const accountExists = await this.checkAccountExists(publicKey);
      if (!accountExists) {
        // Return default balance for non-existent accounts
        return [{ asset: 'XLM', balance: '0.0000000' }];
      }

      const account = await server.loadAccount(publicKey);
      return account.balances.map(balance => ({
        asset: balance.asset_type === 'native' ? 'XLM' : `${balance.asset_code}:${balance.asset_issuer}`,
        balance: balance.balance
      }));
    } catch (error: any) {
      console.error('Error getting wallet balance:', error);
      
      // If account doesn't exist, return zero balance instead of throwing error
      if (error.response && error.response.status === 404) {
        return [{ asset: 'XLM', balance: '0.0000000' }];
      }
      
      throw new Error(`Failed to get balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get transaction history
   */
  public async getTransactionHistory(publicKey: string, limit: number = 10): Promise<any[]> {
    try {
      // Check if account exists first
      const accountExists = await this.checkAccountExists(publicKey);
      if (!accountExists) {
        // Return empty array for non-existent accounts
        return [];
      }

      const transactions = await server
        .transactions()
        .forAccount(publicKey)
        .order('desc')
        .limit(limit)
        .call();

      return transactions.records;
    } catch (error: any) {
      console.error('Error getting transaction history:', error);
      
      // If account doesn't exist, return empty array instead of throwing error
      if (error.response && error.response.status === 404) {
        return [];
      }
      
      throw new Error(`Failed to get transaction history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import existing wallet
   */
  public async importWallet(secretKey: string, username?: string): Promise<StellarWallet> {
    try {
      const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      
      const wallet: StellarWallet = {
        publicKey: keypair.publicKey(),
        secretKey: secretKey,
        username,
        federatedAddress: username ? `${username}*${FEDERATION_DOMAIN}` : undefined
      };

      // Check if the account exists on the network
      const accountExists = await this.checkAccountExists(wallet.publicKey);
      if (!accountExists) {
        throw new Error('The imported wallet does not exist on the Stellar network. Please ensure the secret key is correct and the account has been funded.');
      }

      // If username provided, validate and register it
      if (username) {
        const validation = await this.validateUsername(username);
        if (!validation.isValid || !validation.isAvailable) {
          throw new Error(`Username validation failed: ${validation.errors.join(', ')}`);
        }

        await this.registerUsername(username, wallet.publicKey);
      }

      // Cache the wallet
      this.walletCache.set(wallet.publicKey, wallet);

      return wallet;
    } catch (error) {
      console.error('Error importing wallet:', error);
      throw new Error(`Failed to import wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private createMemo(memoType: string, memoValue: string): StellarSdk.Memo {
    switch (memoType.toLowerCase()) {
      case 'text':
        return StellarSdk.Memo.text(memoValue);
      case 'id':
        return StellarSdk.Memo.id(memoValue);
      case 'hash':
        return StellarSdk.Memo.hash(memoValue);
      case 'return':
        return StellarSdk.Memo.returnHash(memoValue);
      default:
        return StellarSdk.Memo.text(memoValue);
    }
  }

  private async fundTestnetAccount(publicKey: string): Promise<void> {
    try {
      const response = await axios.get(`https://friendbot.stellar.org?addr=${publicKey}`, {
        timeout: 10000 // 10 second timeout
      });
      console.log('Testnet account funded:', response.data);
    } catch (error) {
      console.warn('Failed to fund testnet account:', error);
      // Don't throw error as this is not critical for wallet creation
      // The account might already exist or the friendbot might be temporarily unavailable
    }
  }

  private async registerWithFederationServer(username: string, publicKey: string): Promise<void> {
    try {
      // In a real implementation, this would make an API call to register the username
      // with the federation server. For development, we'll just log this action.
      console.log(`Simulating registration of ${username} -> ${publicKey} with federation server`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error registering with federation server:', error);
      // Don't throw error as local mapping is sufficient for demo
    }
  }

  private loadUsernameMappings(): void {
    try {
      const stored = localStorage.getItem('stellar_username_mappings');
      if (stored) {
        const mappings = JSON.parse(stored);
        this.usernameMappings = new Map(Object.entries(mappings));
      }
    } catch (error) {
      console.error('Error loading username mappings:', error);
    }
  }

  private saveUsernameMappings(): void {
    try {
      const mappings = Object.fromEntries(this.usernameMappings);
      localStorage.setItem('stellar_username_mappings', JSON.stringify(mappings));
    } catch (error) {
      console.error('Error saving username mappings:', error);
    }
  }
}

// Export singleton instance
export const stellarWalletService = StellarWalletService.getInstance();
import * as StellarSdk from 'stellar-sdk';

/**
 * Validate Stellar public key format
 */
export function isValidStellarPublicKey(publicKey: string): boolean {
  try {
    return StellarSdk.StrKey.isValidEd25519PublicKey(publicKey);
  } catch {
    return false;
  }
}

/**
 * Validate Stellar secret key format
 */
export function isValidStellarSecretKey(secretKey: string): boolean {
  try {
    return StellarSdk.StrKey.isValidEd25519SecretKey(secretKey);
  } catch {
    return false;
  }
}

/**
 * Validate federated address format
 */
export function isValidFederatedAddress(address: string): boolean {
  const federationRegex = /^[a-zA-Z0-9_-]+\*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return federationRegex.test(address);
}

/**
 * Format Stellar amount for display
 */
export function formatStellarAmount(amount: string | number, decimals: number = 7): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  });
}

/**
 * Convert Stellar amount to stroops (smallest unit)
 */
export function toStroops(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return (num * 10000000).toString();
}

/**
 * Convert stroops to Stellar amount
 */
export function fromStroops(stroops: string | number): string {
  const num = typeof stroops === 'string' ? parseFloat(stroops) : stroops;
  return (num / 10000000).toString();
}

/**
 * Generate a random Stellar keypair
 */
export function generateKeypair(): { publicKey: string; secretKey: string } {
  const keypair = StellarSdk.Keypair.random();
  return {
    publicKey: keypair.publicKey(),
    secretKey: keypair.secret()
  };
}

/**
 * Create a Stellar keypair from secret key
 */
export function keypairFromSecret(secretKey: string): { publicKey: string; secretKey: string } {
  try {
    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret()
    };
  } catch (error) {
    throw new Error('Invalid secret key format');
  }
}

/**
 * Validate and normalize username for federation
 */
export function validateUsername(username: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 32) {
    errors.push('Username must be no more than 32 characters long');
  }

  const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validUsernameRegex.test(username)) {
    errors.push('Username can only contain letters, numbers, hyphens, and underscores');
  }

  if (username.startsWith('-') || username.startsWith('_') || 
      username.endsWith('-') || username.endsWith('_')) {
    errors.push('Username cannot start or end with hyphens or underscores');
  }

  // Check for reserved usernames
  const reservedUsernames = ['admin', 'api', 'www', 'mail', 'support', 'help', 'info', 'root'];
  if (reservedUsernames.includes(username.toLowerCase())) {
    errors.push('This username is reserved and cannot be used');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a memo object from string and type
 */
export function createMemo(memoValue: string, memoType: string = 'text'): StellarSdk.Memo {
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

/**
 * Parse transaction result for user-friendly display
 */
export function parseTransactionResult(result: any): {
  success: boolean;
  hash: string;
  operations: number;
  fee: string;
  timestamp: string;
} {
  return {
    success: result.successful,
    hash: result.hash,
    operations: result.operation_count || 0,
    fee: result.fee_charged || '0',
    timestamp: result.created_at || new Date().toISOString()
  };
}

/**
 * Get network configuration
 */
export function getNetworkConfig(network: 'testnet' | 'public' = 'testnet') {
  if (network === 'testnet') {
    return {
      networkPassphrase: StellarSdk.Networks.TESTNET,
      horizonUrl: 'https://horizon-testnet.stellar.org',
      friendbotUrl: 'https://friendbot.stellar.org'
    };
  } else {
    return {
      networkPassphrase: StellarSdk.Networks.PUBLIC,
      horizonUrl: 'https://horizon.stellar.org',
      friendbotUrl: null
    };
  }
}

/**
 * Check if account exists on Stellar network
 */
export async function checkAccountExists(publicKey: string, network: 'testnet' | 'public' = 'testnet'): Promise<boolean> {
  try {
    const config = getNetworkConfig(network);
    const server = new StellarSdk.Horizon.Server(config.horizonUrl);
    await server.loadAccount(publicKey);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fund testnet account using Friendbot
 */
export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
  try {
    const config = getNetworkConfig('testnet');
    if (!config.friendbotUrl) {
      throw new Error('Friendbot not available for this network');
    }

    const response = await fetch(`${config.friendbotUrl}?addr=${publicKey}`);
    return response.ok;
  } catch (error) {
    console.error('Failed to fund testnet account:', error);
    return false;
  }
}
import axios from 'axios';

export interface FederationRequest {
  q: string;
  type: 'name' | 'id';
}

export interface FederationResponse {
  stellar_address?: string;
  account_id?: string;
  memo_type?: string;
  memo?: string;
  error?: string;
}

export class FederationServer {
  private domain: string;
  private baseUrl: string;

  constructor(domain: string = 'chappi.com') {
    this.domain = domain;
    this.baseUrl = `https://federation.${domain}`;
  }

  /**
   * Resolve a federated address to account information
   */
  async resolveName(stellarAddress: string): Promise<FederationResponse> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: stellarAddress,
          type: 'name'
        },
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Federation name resolution failed:', error);
      return {
        error: 'Failed to resolve federated address'
      };
    }
  }

  /**
   * Resolve an account ID to federated address
   */
  async resolveId(accountId: string): Promise<FederationResponse> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: accountId,
          type: 'id'
        },
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Federation ID resolution failed:', error);
      return {
        error: 'Failed to resolve account ID'
      };
    }
  }

  /**
   * Register a new federated address (for server implementation)
   */
  async registerAddress(username: string, accountId: string, memo?: string, memoType?: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/register`, {
        username,
        account_id: accountId,
        memo,
        memo_type: memoType
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Federation registration failed:', error);
      return false;
    }
  }

  /**
   * Check if a username is available
   */
  async checkAvailability(username: string): Promise<boolean> {
    try {
      const stellarAddress = `${username}*${this.domain}`;
      const result = await this.resolveName(stellarAddress);
      
      // If we get an account_id back, the username is taken
      return !result.account_id && !!result.error;
    } catch (error) {
      // If the request fails, assume the username is available
      return true;
    }
  }

  /**
   * Validate federated address format
   */
  static validateFederatedAddress(address: string): boolean {
    const federationRegex = /^[a-zA-Z0-9_-]+\*[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return federationRegex.test(address);
  }

  /**
   * Parse federated address into username and domain
   */
  static parseFederatedAddress(address: string): { username: string; domain: string } | null {
    if (!this.validateFederatedAddress(address)) {
      return null;
    }

    const [username, domain] = address.split('*');
    return { username, domain };
  }

  /**
   * Generate stellar.toml content for federation server
   */
  generateStellarToml(): string {
    return `# Stellar Configuration for ${this.domain}
FEDERATION_SERVER="${this.baseUrl}"
AUTH_SERVER="${this.baseUrl}/auth"
TRANSFER_SERVER="${this.baseUrl}/transfer"

# Organization Information
ORG_NAME="Chappi"
ORG_DBA="Chappi Rewards Platform"
ORG_URL="https://${this.domain}"
ORG_LOGO="https://${this.domain}/logo.png"
ORG_DESCRIPTION="The Future of Rewards in Africa"
ORG_PHYSICAL_ADDRESS="Lagos, Nigeria"
ORG_OFFICIAL_EMAIL="hello@${this.domain}"

# Compliance Information
ORG_LICENSING_AUTHORITY="Central Bank of Nigeria"
ORG_LICENSE_TYPE="Payment Service Provider"
ORG_LICENSE_NUMBER="PSP-2024-001"

# Technical Information
SIGNING_KEY="GDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
HORIZON_URL="https://horizon-testnet.stellar.org"
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Federation Protocol Version
FEDERATION_VERSION="1.0"
`;
  }
}

// Export singleton instance
export const federationServer = new FederationServer();
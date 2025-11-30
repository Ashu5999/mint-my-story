/**
 * Story Protocol Integration for Mint My Story (Testnet)
 *
 * This module provides high-level helpers to register IP assets, manage
 * license terms, and configure royalties on Story Protocol Testnet.
 *
 * Environment variables required (server-side only):
 * - STORY_PRIVATE_KEY        Private key for the Story Protocol operator wallet
 * - STORY_TESTNET_RPC        RPC URL for Story Protocol Testnet
 * - STORY_REGISTRY_CONTRACT  IP asset registry / NFT contract address
 */

import type { Address, Account, WalletClient, Transport, Chain } from 'viem';
import { custom } from 'viem';
import {
  StoryClient,
  type StoryConfig,
} from '@story-protocol/core-sdk';

export interface RoyaltySplit {
  recipient: string;
  bps: number; // basis points (10_000 = 100%)
}

export interface StoryError {
  code: string;
  message: string;
  details?: unknown;
}

export type StoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: StoryError };

export interface RegisterAssetResult {
  assetId: string;
  txHash: string;
}

export interface CreateTermsResult {
  termsId: string;
  txHash: string;
}

export interface AttachTermsResult {
  success: true;
  txHash: string;
}

export interface SetRoyaltyConfigResult {
  success: true;
  txHash: string;
}

let storyClientPromise: Promise<StoryClient> | null = null;

function getEnv(name: string): string {
  // @ts-ignore
  const value = import.meta.env[name] || process.env[name];
  // Allow missing env vars for now to prevent crash, but warn
  if (!value) {
    console.warn(`Missing environment variable: ${name}`);
    return '';
  }
  return value;
}

function normalizeError(error: unknown, code: string): StoryError {
  if (error instanceof Error) {
    return {
      code,
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    };
  }

  return {
    code,
    message: 'Unknown Story Protocol error',
    details: error,
  };
}

// Cache client if needed, but since it depends on wallet, maybe not global cache
// let storyClientPromise: Promise<StoryClient> | null = null;

async function getStoryClient(walletClient: WalletClient, account: Address): Promise<StoryClient> {
  const config: StoryConfig = {
    chainId: "aeneid",
    transport: custom((window as any).ethereum!), // Use browser provider
    account: account as unknown as Account, // Cast to Account
  };
  return StoryClient.newClient(config);
}

function getRegistryContractAddress(): Address {
  const addr = getEnv('STORY_REGISTRY_CONTRACT');
  return addr as Address;
}

export const SPGNFTContractAddress: Address =
  (import.meta.env.VITE_SPG_NFT_CONTRACT_ADDRESS as Address) || '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc';

// Docs: https://docs.story.foundation/developers/deployed-smart-contracts
export const RoyaltyPolicyLAP: Address = '0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E'
export const WIP_TOKEN_ADDRESS: Address = '0x1514000000000000000000000000000000000000' // Verify this address for testnet

export function createCommercialRemixTerms(terms: { commercialRevShare: number; defaultMintingFee: number }): any {
  return {
    transferable: true,
    royaltyPolicy: RoyaltyPolicyLAP,
    defaultMintingFee: BigInt(terms.defaultMintingFee), // Simplified for now, should use parseEther if needed
    expiration: BigInt(0),
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: '0x0000000000000000000000000000000000000000',
    commercializerCheckerData: '0x',
    commercialRevShare: terms.commercialRevShare,
    commercialRevCeiling: BigInt(0),
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevCeiling: BigInt(0),
    currency: WIP_TOKEN_ADDRESS,
    uri: 'https://github.com/piplabs/pil-document/blob/ad67bb632a310d2557f8abcccd428e4c9c798db1/off-chain-terms/CommercialRemix.json',
  }
}

/**
 * Register an IP asset on Story Protocol Testnet.
 *
 * If the SDK exposes a composite helper `mintAndRegisterAndCreateTermsAndAttach`,
 * this function will attempt to use it. Otherwise it falls back to
 * `mintAndRegisterIpAsset` and separate royalty configuration.
 */
export async function registerAsset(
  walletClient: WalletClient, // Added
  account: Address, // Added
  metadataUri: string,
  nftMetadataUri: string,
  ipMetadataHash: string,
  nftMetadataHash: string,
  royalties: RoyaltySplit[] = [],
): Promise<StoryResult<RegisterAssetResult>> {
  try {
    if (!metadataUri || !metadataUri.startsWith('ipfs://')) {
      throw new Error('metadataUri must be a non-empty IPFS URI (e.g. ipfs://CID)');
    }
    if (!account) {
      throw new Error('account is required');
    }

    const client = await getStoryClient(walletClient, account);
    // const registryContract = getRegistryContractAddress(); // Not strictly needed for mintAndRegisterIpAssetWithPilTerms if using SPG

    let assetId: string;
    let txHash: string;

    const ipAssetModule: any = (client as any).ipAsset;

    console.log('[Story] Using ipAsset.mintAndRegisterIpAssetWithPilTerms');

    // Using the flow from reference repo: mintAndRegisterIpAssetWithPilTerms
    // Note: This requires SPG NFT Contract Address
    const spgNftContract = SPGNFTContractAddress;

    // TODO: Make sure SPGNFTContractAddress is valid or passed in. 
    // For now, we might need to rely on the user providing it or hardcoding a testnet one if known.
    // If not available, we might fall back to the old method, but the user specifically asked for the reference repo logic.

    // Construct terms. Reference repo uses createCommercialRemixTerms.
    // We'll use a default or allow passing it in? For now, hardcoded default as per reference.
    const terms = createCommercialRemixTerms({ defaultMintingFee: 0, commercialRevShare: 5 });

    const response = await ipAssetModule.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: spgNftContract,
      licenseTermsData: [
        {
          terms: terms,
        },
      ],
      ipMetadata: {
        ipMetadataURI: metadataUri,
        ipMetadataHash: ipMetadataHash,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash: nftMetadataHash,
      },
      txOptions: { waitForTransaction: true },
    });

    assetId = response.ipId;
    txHash = response.txHash;

    if (!assetId || !txHash) {
      throw new Error('Story Protocol SDK did not return assetId or txHash');
    }

    return {
      success: true,
      data: {
        assetId,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] registerAsset error:', error);
    return {
      success: false,
      error: normalizeError(error, 'REGISTER_ASSET_FAILED'),
    };
  }
}

/**
 * Create license / terms for an existing IP asset.
 */
export async function createTerms(
  walletClient: WalletClient,
  account: Address,
  assetId: string,
  termsConfig: any,
): Promise<StoryResult<CreateTermsResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!termsConfig || typeof termsConfig !== 'object') {
      throw new Error('termsConfig must be a non-null object');
    }

    const client = await getStoryClient(walletClient, account);
    const anyClient = client as any;

    let termsId: string | undefined;
    let txHash: string | undefined;

    const licenseModule: any = anyClient.license || anyClient.terms;

    if (!licenseModule) {
      throw new Error('Story Protocol SDK does not expose a license/terms module');
    }

    let response: any | undefined;

    if (typeof licenseModule.createTerms === 'function') {
      response = await licenseModule.createTerms({
        ipId: assetId,
        ...termsConfig,
      });
    } else if (typeof licenseModule.createLicenseTerms === 'function') {
      response = await licenseModule.createLicenseTerms({
        ipId: assetId,
        ...termsConfig,
      });
    } else {
      throw new Error(
        'No compatible Story Protocol createTerms function found (expected createTerms or createLicenseTerms)',
      );
    }

    termsId = response?.termsId || response?.licenseTermsId || response?.id;
    txHash = response?.txHash || response?.transactionHash;

    if (!termsId || !txHash) {
      throw new Error('Failed to extract termsId or txHash from Story Protocol response');
    }

    return {
      success: true,
      data: {
        termsId,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] createTerms error:', error);
    return {
      success: false,
      error: normalizeError(error, 'CREATE_TERMS_FAILED'),
    };
  }
}

/**
 * Attach existing terms to an IP asset.
 */
export async function attachTerms(
  walletClient: WalletClient,
  account: Address,
  assetId: string,
  termsId: string,
): Promise<StoryResult<AttachTermsResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!termsId) {
      throw new Error('termsId is required');
    }

    const client = await getStoryClient(walletClient, account);
    const anyClient = client as any;

    const licenseModule: any = anyClient.license || anyClient.terms;

    if (!licenseModule) {
      throw new Error('Story Protocol SDK does not expose a license/terms module');
    }

    let response: any | undefined;

    if (typeof licenseModule.attachTerms === 'function') {
      response = await licenseModule.attachTerms({
        ipId: assetId,
        termsId,
      });
    } else if (typeof licenseModule.attachLicenseTerms === 'function') {
      response = await licenseModule.attachLicenseTerms({
        ipId: assetId,
        licenseTermsId: termsId,
      });
    } else {
      throw new Error(
        'No compatible Story Protocol attachTerms function found (expected attachTerms or attachLicenseTerms)',
      );
    }

    const txHash: string | undefined =
      response?.txHash || response?.transactionHash;

    if (!txHash) {
      throw new Error('Failed to extract txHash from Story Protocol response');
    }

    return {
      success: true,
      data: {
        success: true,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] attachTerms error:', error);
    return {
      success: false,
      error: normalizeError(error, 'ATTACH_TERMS_FAILED'),
    };
  }
}

/**
 * Configure royalty distribution for an IP asset via the Story Protocol Royalty Module.
 */
export async function setRoyaltyConfig(
  walletClient: WalletClient,
  account: Address,
  assetId: string,
  splits: RoyaltySplit[],
): Promise<StoryResult<SetRoyaltyConfigResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!Array.isArray(splits) || splits.length === 0) {
      throw new Error('splits must be a non-empty array');
    }

    const totalBps = splits.reduce((sum, s) => sum + s.bps, 0);
    if (totalBps > 10_000) {
      throw new Error('Total royalty BPS cannot exceed 10,000 (100%)');
    }

    const client = await getStoryClient(walletClient, account);
    const anyClient = client as any;
    const royaltyModule: any = anyClient.royalty || anyClient.royalties;

    if (!royaltyModule) {
      throw new Error('Story Protocol SDK does not expose a royalty module');
    }

    const normalizedSplits = splits.map((s) => ({
      recipient: s.recipient as Address,
      bps: BigInt(s.bps),
    }));

    const candidateMethods = [
      'setRoyaltyConfig',
      'configureRoyaltyForIp',
      'setRoyaltyForIp',
      'configureRoyalty',
    ];

    let response: any | undefined;
    let methodUsed: string | undefined;

    for (const name of candidateMethods) {
      if (typeof royaltyModule[name] === 'function') {
        methodUsed = name;
        response = await royaltyModule[name]({
          ipId: assetId,
          splits: normalizedSplits,
        });
        break;
      }
    }

    if (!response || !methodUsed) {
      throw new Error(
        'No compatible Story Protocol royalty configuration method found on royalty module',
      );
    }

    const txHash: string | undefined =
      response?.txHash || response?.transactionHash;

    if (!txHash) {
      throw new Error('Failed to extract txHash from Story Protocol royalty response');
    }

    return {
      success: true,
      data: {
        success: true,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] setRoyaltyConfig error:', error);
    return {
      success: false,
      error: normalizeError(error, 'SET_ROYALTY_CONFIG_FAILED'),
    };
  }
}

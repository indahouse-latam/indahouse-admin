export {
  ensureWallet,
  peekSessionWalletAddress,
  getSessionWalletAddress,
  closeWallet,
  getActiveWallet,
  getAccountNonce,
  getBootstrapConfig,
} from './session';
export { submitWalletCall, submitEncodedCall, waitForUserOperation } from './signing-adapter';
export { fetchWalletBootstrap, registerV3Wallet, fetchNyxAccessToken } from './config';
export { isWebAuthnRpCompatible, describeWebAuthnOriginError } from './biometric-credential';
export type {
  NyxWalletBootstrapConfig,
  RegisterV3WalletPayload,
  ActiveNyxWallet,
} from './types';

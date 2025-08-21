import Cryptr from "cryptr";

const APP_SECRET_KEY = "sk_test_UPPSbDWBkqyxjcVUzs5Fz7StpbM39xkTp7PdGM//HvE=";
/**
 * Encrypts a private key using a secret (password).
 * @param {string} privateKey - The private key to encrypt (hex string, e.g., '0x...').
 * @param {string} secret - The secret (password) for encryption.
 * @returns {string} - The encrypted JSON keystore.
 */
export function encryptPrivateKey(privateKey: string): string {
  console.log('import.meta.env.APP_SECRET_KEY', APP_SECRET_KEY)
  const cryptr = new Cryptr(APP_SECRET_KEY);
  const encrypted = cryptr.encrypt(privateKey);
  return encrypted;
}

/**
 * Decrypts an encrypted private key using a secret (password).
 * @param {object} encryptedKeystore - The encrypted JSON keystore.
 * @param {string} secret - The secret (password) used for encryption.
 * @returns {string} - The decrypted private key (hex string).
 */
export function decryptPrivateKey(encryptedKeystore: string): string {
  const cryptr = new Cryptr(APP_SECRET_KEY);
  try {
    const decrypted = cryptr.decrypt(encryptedKeystore);
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed:`);
  }
}

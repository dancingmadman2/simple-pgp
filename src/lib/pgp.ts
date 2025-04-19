/* eslint-disable @typescript-eslint/no-explicit-any */
import * as openpgp from 'openpgp';

export interface KeyOptions {
  name: string;
  email: string;
  passphrase: string;
  keyType: 'ecc' | 'rsa';
  rsaBits?: 2048 | 3072 | 4096;
  curve?: 'curve25519' | 'p256' | 'p384' | 'p521';
  expirationTime?: number;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface KeyInfo {
  keyID: string;
  fingerprint: string;
  algorithm: string;
  created: Date;
  users: Array<{
    userID?: string;
  }>;
}

export interface ParseKeyResult {
  valid: boolean;
  keyInfo?: KeyInfo;
  error?: string;
}

export async function generateKeyPair(options: KeyOptions): Promise<KeyPair> {
  const { name, email, passphrase, keyType, rsaBits, curve, expirationTime } = options;
  
  const expiresSeconds = expirationTime ? expirationTime * 24 * 60 * 60 : 0;
  
  const userID = {
    name,
    email,
  };

  const config: openpgp.GenerateKeyOptions = {
    type: keyType === 'ecc' ? 'ecc' : 'rsa',
    passphrase,
    userIDs: [userID],
  };

  if (keyType === 'rsa' && rsaBits) {
    (config as any).rsaBits = rsaBits;
  } else if (keyType === 'ecc' && curve) {
    (config as any).curve = curve;
  }

  if (expiresSeconds > 0) {
    (config as any).keyExpirationTime = expiresSeconds;
  }

  const { privateKey, publicKey } = await openpgp.generateKey({
    ...config,
    format: 'armored'
  });

  return {
    publicKey,
    privateKey,
  };
}

export async function encryptMessage(
  message: string,
  publicKeyArmored: string
): Promise<string> {
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
  
  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: message }),
    encryptionKeys: publicKey,
  });

  return encrypted as string;
}

export async function decryptMessage(
  encryptedMessage: string,
  privateKeyArmored: string,
  passphrase: string
): Promise<string> {
  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase,
  });

  const message = await openpgp.readMessage({
    armoredMessage: encryptedMessage,
  });

  const { data: decrypted } = await openpgp.decrypt({
    message,
    decryptionKeys: privateKey,
  });

  return decrypted as string;
}

export async function parseKey(key: string): Promise<ParseKeyResult> {
  try {
    const parsedKey = await openpgp.readKey({ armoredKey: key });
    
    const users = parsedKey.users.map(user => ({
      userID: user.userID?.userID,
    }));
    
    const keyInfo: KeyInfo = {
      keyID: parsedKey.getKeyID().toHex(),
      fingerprint: parsedKey.getFingerprint(),
      algorithm: parsedKey.keyPacket.algorithm.toString(),
      created: parsedKey.keyPacket.created,
      users,
    };
    
    return { valid: true, keyInfo };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
} 
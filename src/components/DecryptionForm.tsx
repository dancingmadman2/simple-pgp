'use client';

import { useState } from 'react';
import { decryptMessage } from '@/lib/pgp';
import { UnlockIcon } from '@/components/Icons';

const DecryptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!privateKey.trim()) {
        throw new Error('Please enter your private key');
      }
      
      if (!passphrase.trim()) {
        throw new Error('Please enter your passphrase');
      }
      
      if (!encryptedMessage.trim()) {
        throw new Error('Please enter the encrypted message');
      }
      
      const decrypted = await decryptMessage(encryptedMessage, privateKey, passphrase);
      setDecryptedMessage(decrypted);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDecryptedMessage(null);
    setPassphrase('');
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-6 flex items-center">
        <UnlockIcon className="h-5 w-5 mr-2 text-accent" />
        Decrypt Message
      </h2>
      
      {!decryptedMessage ? (
        <form onSubmit={handleDecrypt} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Private Key
              </label>
              <textarea
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm"
                placeholder="-----BEGIN PGP PRIVATE KEY BLOCK-----..."
                required
              />
              <p className="mt-1 text-xs text-muted">
                Enter your private key to decrypt messages sent to you.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Passphrase
              </label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Enter your private key passphrase"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Encrypted Message
              </label>
              <textarea
                value={encryptedMessage}
                onChange={(e) => setEncryptedMessage(e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm"
                placeholder="-----BEGIN PGP MESSAGE-----..."
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-[#fff3f3] border border-[#e58989] text-[#d92020] rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 btn-accent rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Decrypting...' : 'Decrypt Message'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Decrypted Message</h3>
            <div className="relative">
              <textarea
                readOnly
                className="w-full h-64 p-3 bg-input-bg border border-border rounded-md focus:outline-none"
                value={decryptedMessage}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              This message was successfully decrypted with your private key.
            </p>
          </div>
          
          <button
            onClick={resetForm}
            className="w-full py-2 px-4 btn-ghost rounded-md text-sm"
          >
            Decrypt Another Message
          </button>
        </div>
      )}
    </div>
  );
};

export default DecryptionForm; 
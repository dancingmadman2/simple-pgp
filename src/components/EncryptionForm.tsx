'use client';

import { useState } from 'react';
import { encryptMessage, parseKey } from '@/lib/pgp';
import { LockIcon } from '@/components/Icons';

const EncryptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState<string | null>(null);

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!publicKey.trim()) {
        throw new Error('Please enter a public key');
      }
      
      if (!message.trim()) {
        throw new Error('Please enter a message to encrypt');
      }
      
      const keyCheck = await parseKey(publicKey);
      if (!keyCheck.valid) {
        throw new Error('Invalid PGP public key. Please check and try again.');
      }
      
      const encrypted = await encryptMessage(message, publicKey);
      setEncryptedMessage(encrypted);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setEncryptedMessage(null);
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-6 flex items-center">
        <LockIcon className="h-5 w-5 mr-2 text-accent" />
        Encrypt Message
      </h2>
      
      {!encryptedMessage ? (
        <form onSubmit={handleEncrypt} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient&apos;s Public Key
              </label>
              <textarea
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent font-mono text-sm"
                placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----..."
                required
              />
              <p className="mt-1 text-xs text-muted">
                Paste the public key of the person you want to send the encrypted message to.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Enter the message you want to encrypt..."
                required
              />
              <p className="mt-1 text-xs text-muted">
                This message will only be readable by the owner of the corresponding private key.
              </p>
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
            {loading ? 'Encrypting...' : 'Encrypt Message'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Encrypted Message</h3>
            <div className="relative">
              <textarea
                readOnly
                className="w-full h-64 p-3 bg-input-bg border border-border rounded-md focus:outline-none font-mono text-sm"
                value={encryptedMessage}
              />
              <button
                onClick={() => copyToClipboard(encryptedMessage)}
                className="absolute top-2 right-2 p-1 bg-background text-muted hover:text-foreground border border-border rounded text-xs"
              >
                Copy
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Send this encrypted message to your recipient. Only they can decrypt it with their private key.
            </p>
          </div>
          
          <button
            onClick={resetForm}
            className="w-full py-2 px-4 btn-ghost rounded-md text-sm"
          >
            Encrypt Another Message
          </button>
        </div>
      )}
    </div>
  );
};

export default EncryptionForm; 
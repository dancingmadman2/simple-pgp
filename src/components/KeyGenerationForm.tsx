'use client';

import { useState } from 'react';
import { generateKeyPair, KeyOptions } from '@/lib/pgp';

const KeyGenerationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [formData, setFormData] = useState<KeyOptions>({
    name: '',
    email: '',
    passphrase: '',
    keyType: 'ecc',
    curve: 'curve25519',
    rsaBits: 2048,
    expirationTime: 365,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'keyType') {
      setFormData((prev) => ({
        ...prev,
        [name]: value as 'ecc' | 'rsa',
      }));
      return;
    }
    
    if (name === 'rsaBits' || name === 'expirationTime') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value, 10),
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.email || !formData.passphrase) {
        throw new Error('Name, email, and passphrase are required');
      }

      if (formData.passphrase.length < 8) {
        throw new Error('Passphrase must be at least 8 characters long');
      }

      const keyPair = await generateKeyPair(formData);
      setKeyPair(keyPair);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Generate PGP Key Pair</h2>
      
      {!keyPair ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Johnny Bravo"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="johnbravo354@example.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Passphrase
              </label>
              <input
                type="password"
                name="passphrase"
                value={formData.passphrase}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="••••••••••••"
                minLength={8}
                required
              />
              <p className="mt-1 text-xs text-muted">
                Minimum 8 characters. This passphrase will protect your private key and will be required for decryption.
              </p>
            </div>
            
            <div className="border border-border rounded-md p-4 bg-input-bg/30">
              <div className="text-sm font-medium mb-3">
                Advanced Settings
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">
                    Key Type
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="keyType"
                        value="ecc"
                        checked={formData.keyType === 'ecc'}
                        onChange={handleChange}
                        className="h-4 w-4 text-accent border-border focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">
                        ECC 
                        <span className="text-xs text-muted ml-1">(Recommended)</span>
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="keyType"
                        value="rsa"
                        checked={formData.keyType === 'rsa'}
                        onChange={handleChange}
                        className="h-4 w-4 text-accent border-border focus:ring-accent"
                      />
                      <span className="ml-2 text-sm">
                        RSA
                        <span className="text-xs text-muted ml-1">(Traditional)</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                {formData.keyType === 'ecc' && (
                  <div>
                    <label className="block text-sm mb-1">
                      Curve Type
                    </label>
                    <select
                      name="curve"
                      value={formData.curve}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                    >
                      <option value="curve25519">Curve25519 (Modern, recommended)</option>
                      <option value="p256">NIST P-256</option>
                      <option value="p384">NIST P-384 (Higher security)</option>
                      <option value="p521">NIST P-521 (Maximum security)</option>
                    </select>
                  </div>
                )}
                
                {formData.keyType === 'rsa' && (
                  <div>
                    <label className="block text-sm mb-1">
                      RSA Key Size
                    </label>
                    <select
                      name="rsaBits"
                      value={formData.rsaBits}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                    >
                      <option value={2048}>2048 bits (Fast, good security)</option>
                      <option value={3072}>3072 bits (NIST recommended)</option>
                      <option value={4096}>4096 bits (Maximum security)</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm mb-1">
                    Key Expiration
                  </label>
                  <select
                    name="expirationTime"
                    value={formData.expirationTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input-bg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent text-sm"
                  >
                    <option value={0}>Never expires</option>
                    <option value={30}>30 days</option>
                    <option value={90}>90 days</option>
                    <option value={365}>1 year (Recommended)</option>
                    <option value={730}>2 years</option>
                  </select>
                </div>
              </div>
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
            {loading ? 'Generating...' : 'Generate Key Pair'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-2">Public Key</h3>
            <div className="relative">
              <textarea
                readOnly
                className="w-full h-32 p-3 bg-input-bg border border-border rounded-md focus:outline-none font-mono text-sm"
                value={keyPair.publicKey}
              />
              <button
                onClick={() => copyToClipboard(keyPair.publicKey)}
                className="absolute top-2 right-2 p-1 bg-background text-muted hover:text-foreground border border-border rounded text-xs"
              >
                Copy
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">
              Share your public key with others who want to send you encrypted messages.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-2">Private Key</h3>
            <div className="relative">
              <textarea
                readOnly
                className="w-full h-32 p-3 bg-input-bg border border-border rounded-md focus:outline-none font-mono text-sm"
                value={keyPair.privateKey}
              />
              <button
                onClick={() => copyToClipboard(keyPair.privateKey)}
                className="absolute top-2 right-2 p-1 bg-background text-muted hover:text-foreground border border-border rounded text-xs"
              >
                Copy
              </button>
            </div>
            <div className="mt-2 p-2 border-l-2 border-[#d92020] bg-[#fff8f8] text-sm">
              <strong>IMPORTANT:</strong> Keep your private key secret. You&apos;ll need it to decrypt messages.
            </div>
          </div>
          
          <button
            onClick={() => setKeyPair(null)}
            className="w-full py-2 px-4 btn-ghost rounded-md text-sm"
          >
            Generate Another Key Pair
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyGenerationForm; 
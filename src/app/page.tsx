'use client';

import { useState } from 'react';
import KeyGenerationForm from '@/components/KeyGenerationForm';
import EncryptionForm from '@/components/EncryptionForm';
import DecryptionForm from '@/components/DecryptionForm';

type Tab = 'generate' | 'encrypt' | 'decrypt';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium">SimplePGP</h1>
              <p className="text-muted text-sm mt-1">open source, fast, secure, easy to use pgp tool</p>
            </div>
            <a 
              href="https://github.com/dancingmadman2/simple-pgp" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground text-sm flex items-center transition-colors"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <nav className="mb-8 border-b border-border">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('generate')}
                className={`py-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'generate'
                    ? 'border-b-2 border-accent text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Generate Keys
              </button>
              <button
                onClick={() => setActiveTab('encrypt')}
                className={`py-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'encrypt'
                    ? 'border-b-2 border-accent text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setActiveTab('decrypt')}
                className={`py-3 px-1 font-medium text-sm transition-colors ${
                  activeTab === 'decrypt'
                    ? 'border-b-2 border-accent text-foreground'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                Decrypt
              </button>
            </div>
          </nav>

          <div className="fade-in">
            <div style={{ display: activeTab === 'generate' ? 'block' : 'none' }}>
              <KeyGenerationForm />
            </div>
            <div style={{ display: activeTab === 'encrypt' ? 'block' : 'none' }}>
              <EncryptionForm />
            </div>
            <div style={{ display: activeTab === 'decrypt' ? 'block' : 'none' }}>
              <DecryptionForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-muted text-sm">
            <p>
              SimplePGP
            </p>
            <p className="mt-2 sm:mt-0">
              <span>Open source under MIT license</span>
              <span className="mx-2">·</span>
              <a 
                href="https://github.com/dancingmadman2/simple-pgp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

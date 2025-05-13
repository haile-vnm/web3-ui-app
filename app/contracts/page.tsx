'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { contractArtifact } from '../../constants/my-contract';

export default function ContractInfoPage() {
  const [contractAddress, setContractAddress] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleNavigate = () => {
    if (!contractAddress) {
      setError('Please enter a contract address.');
      return;
    }
    if (!ethers.isAddress(contractAddress)) {
      setError('Invalid Ethereum address.');
      return;
    }
    setError('');
    router.push(`/contracts/${contractAddress}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center">Smart Contract Information</h1>
        <div className="p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800 w-full">
          <div className="mb-4">
            <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Enter Smart Contract Address:
            </label>
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <button
            onClick={handleNavigate}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Contract Page
          </button>
          {error && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-3 rounded-md">{error}</p>
          )}
        </div>
        <a href="/" className="text-blue-600 dark:text-blue-400 hover:underline mt-4">
          Go back to Home
        </a>
      </main>
    </div>
  );
}

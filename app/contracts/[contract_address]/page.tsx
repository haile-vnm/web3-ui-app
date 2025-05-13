'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ethers, BrowserProvider, Contract } from 'ethers';

const contractArtifact = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MyContract",
  "abi": [
    {
      "inputs": [],
      "name": "getName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
};

export default function ContractAddressPage() {
  const params = useParams();
  const contractAddress = params?.contract_address as string;
  const [fetchedName, setFetchedName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchName = async () => {
      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        setError('Invalid contract address.');
        setIsLoading(false);
        return;
      }
      try {
        if (typeof window === 'undefined' || typeof (window as any).ethereum === 'undefined') {
          setError('MetaMask is not installed.');
          setIsLoading(false);
          return;
        }
        const provider = new BrowserProvider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const contract = new Contract(contractAddress, contractArtifact.abi, signer);
        const name = await contract.getName();
        setFetchedName(name);
      } catch (e: any) {
        setError(e.message || 'Error fetching contract name.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchName();
  }, [contractAddress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Contract Name</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {fetchedName && (
          <p className="text-xl">Name: <span className="font-semibold text-green-600 dark:text-green-400">{fetchedName}</span></p>
        )}
        <a href="/contracts" className="text-blue-600 dark:text-blue-400 hover:underline mt-4">Back</a>
      </main>
    </div>
  );
}

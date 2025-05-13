'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ethers, BrowserProvider, Contract } from 'ethers';
import { contractArtifact } from '../../../constants/my-contract';

export default function ContractAddressPage() {
  const params = useParams();
  const contractAddress = params?.contract_address as string;
  const [fetchedName, setFetchedName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [isChanging, setIsChanging] = useState(false);

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

  const handleChangeName = async () => {
    setError('');
    if (!newName) {
      setError('Please enter a new name.');
      return;
    }
    if (!contractAddress || !ethers.isAddress(contractAddress)) {
      setError('Invalid contract address.');
      return;
    }
    try {
      setIsChanging(true);
      if (typeof window === 'undefined' || typeof (window as any).ethereum === 'undefined') {
        setError('MetaMask is not installed.');
        setIsChanging(false);
        return;
      }
      const provider = new BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractArtifact.abi, signer);
      const tx = await contract.changeName(newName);
      await tx.wait();
      setFetchedName(await contract.getName());
      setNewName('');
    } catch (e: any) {
      setError(e.message || 'Error changing contract name.');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center">Contract Name</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {fetchedName && (
          <p className="text-xl">Name: <span className="font-semibold text-green-600 dark:text-green-400">{fetchedName}</span></p>
        )}
        <div className="w-full mt-4">
          <label htmlFor="newName" className="block text-sm font-medium mb-1">Change Name:</label>
          <input
            id="newName"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter new name"
            disabled={isChanging}
          />
          <button
            onClick={handleChangeName}
            disabled={isChanging || !newName}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isChanging ? 'Changing...' : 'Change Name'}
          </button>
        </div>
        <a href="/contracts" className="text-blue-600 dark:text-blue-400 hover:underline mt-4">Back</a>
      </main>
    </div>
  );
}

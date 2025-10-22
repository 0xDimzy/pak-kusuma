import React, { useEffect, useState } from 'react';

function USDCTransfer() {
  // State variables
  const [account, setAccount] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');

  // Token info
  const tokenInfo = {
    symbol: 'USDC'
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      // Add your wallet connection logic here
      setStatus('Connecting wallet...');
      // Example: const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // setAccount(accounts[0]);
    } catch (err) {
      setStatus('Failed to connect wallet: ' + err.message);
    }
  };

  // Send token function
  const sendToken = async () => {
    if (!account || !recipient || !amount) {
      setStatus('Please fill in all fields');
      return;
    }

    setSending(true);
    setStatus('Sending transaction...');

    try {
      // Add your token transfer logic here
      // Example: const tx = await contract.transfer(recipient, amount);
      // setTxHash(tx.hash);
      setStatus('Transaction sent successfully');
    } catch (err) {
      setStatus('Transaction failed: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  // Utility function to shorten addresses
  const shorten = (addr) => {
    return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '';
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-slate-900 p-6">
      <div className="max-w-xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl text-white font-bold">Send USDC on Base</h1>
            <p className="text-slate-300 text-sm">WalletConnect supported • ERC-20</p>
          </div>
          <button
            onClick={() => connectWallet()}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-medium"
          >
            {account ? shorten(account) : 'Connect Wallet'}
          </button>
        </header>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Recipient</label>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white font-mono"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-1">Amount ({tokenInfo.symbol})</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white font-mono"
          />
          <div className="text-xs text-slate-400 mt-1">Balance: {balance} {tokenInfo.symbol}</div>
        </div>

        <button
          onClick={sendToken}
          disabled={sending}
          className="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded text-white font-semibold disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send USDC'}
        </button>

        <div className="mt-4 text-sm text-slate-200">
          <div>Status: {status}</div>
          {txHash && (
            <div>
              Tx: <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline">{shorten(txHash)}</a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default USDCTransfer;

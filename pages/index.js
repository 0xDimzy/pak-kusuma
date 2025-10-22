"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5";

// === CONFIG ===
const projectId = "032194562b90a47e637d7cd89775abf2"; // ganti dengan ID dari https://cloud.walletconnect.com
const baseChain = {
  chainId: 8453,
  name: "Base Mainnet",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: "https://mainnet.base.org",
};

// === ERC20 ABI (USDC) ===
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export default function Home() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [txHash, setTxHash] = useState(null);
  const [sending, setSending] = useState(false);

  // ✅ INIT MODAL
  useEffect(() => {
    const metadata = {
      name: "Send USDC dApp",
      description: "Simple USDC sender on Base",
      url: "https://yourapp.vercel.app",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    };

    const ethersConfig = defaultConfig({ metadata });
    createWeb3Modal({
      ethersConfig,
      chains: [baseChain],
      projectId,
      enableAnalytics: false,
    });
  }, []);

  async function connectWallet() {
    try {
      const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
      const s = walletProvider.getSigner();
      const addr = await s.getAddress();
      setProvider(walletProvider);
      setSigner(s);
      setAccount(addr);
      setStatus("✅ Connected to wallet");
      loadBalance(walletProvider, addr);
    } catch (err) {
      console.error(err);
      setStatus("❌ Connection failed");
    }
  }

  async function loadBalance(p, addr) {
    try {
      const token = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, p);
      const decimals = await token.decimals();
      const rawBal = await token.balanceOf(addr);
      const human = ethers.utils.formatUnits(rawBal, decimals);
      setBalance(human);
    } catch (err) {
      setStatus("⚠️ Failed to load balance");
    }
  }

  async function sendToken(e) {
    e.preventDefault();
    if (!signer) return setStatus("Please connect wallet");
    if (!ethers.utils.isAddress(recipient)) return setStatus("Invalid address");
    if (Number(amount) <= 0) return setStatus("Amount must be > 0");

    setSending(true);
    try {
      const token = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
      const decimals = await token.decimals();
      const tx = await token.transfer(recipient, ethers.utils.parseUnits(amount, decimals));
      setTxHash(tx.hash);
      setStatus("⏳ Waiting for confirmation...");
      await tx.wait();
      setStatus("✅ Transaction confirmed!");
      loadBalance(provider, account);
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 to-slate-900 text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">💸 Send USDC on Base</h1>
        <p className="text-center text-slate-300 mb-6 text-sm">
          WalletConnect • ERC-20 • Base Network
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={connectWallet}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-600 rounded-full font-semibold transition-all shadow-md"
          >
            {account ? shorten(account) : "Connect Wallet"}
          </button>
        </div>

        <form onSubmit={sendToken} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Recipient Address</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full mt-1 p-3 rounded-lg bg-slate-800/60 border border-slate-600 text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Amount (USDC)</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800/60 border border-slate-600 text-white font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="text-xs text-slate-400 mt-1">
              Balance: {balance} USDC
            </div>
          </div>

          <button
            disabled={sending}
            type="submit"
            className={`w-full py-3 rounded-full font-semibold transition-all ${
              sending
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 shadow-lg"
            }`}
          >
            {sending ? "Sending..." : "Send USDC"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-300">
            Status: <span className="font-mono text-white">{status}</span>
          </p>
          {txHash && (
            <p className="mt-2">
              Tx:{" "}
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="underline text-sky-400 hover:text-sky-300"
              >
                {shorten(txHash)}
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  );

  function shorten(addr) {
    return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
  }
}

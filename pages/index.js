import { useEffect, useState } from 'react';
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
className="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded text-white font-semibold"
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


function shorten(addr) {
return addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '';
}
}

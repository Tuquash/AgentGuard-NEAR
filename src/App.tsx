import { useMemo, useState } from 'react'
import './index.css'

type Decision = 'ALLOW' | 'WARN' | 'BLOCK'
type Entry = { recipient: string; amount: number; decision: Decision; reason: string }

export default function App() {
  const [dailyLimit, setDailyLimit] = useState(1)
  const [transactionLimit, setTransactionLimit] = useState(0.5)
  const [spent, setSpent] = useState(0)
  const [recipient, setRecipient] = useState('test.near')
  const [amount, setAmount] = useState(0.1)
  const [notice, setNotice] = useState('Simulation only. No wallet is connected and no transaction is sent.')
  const [entries, setEntries] = useState<Entry[]>([])
  const remaining = Math.max(0, dailyLimit - spent)
  const allowed = useMemo(() => entries.filter(item => item.decision === 'ALLOW').length, [entries])
  const fmt = (value: number) => value.toFixed(3) + ' NEAR'

  function evaluate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!recipient.trim() || !Number.isFinite(amount) || amount <= 0 || dailyLimit <= 0 || transactionLimit <= 0) {
      setNotice('Enter a recipient and positive limits and amount.')
      return
    }
    let decision: Decision = 'ALLOW'
    let reason = 'Within configured limits'
    if (amount > transactionLimit) { decision = 'BLOCK'; reason = 'Exceeds per-transaction limit' }
    else if (spent + amount > dailyLimit) { decision = 'BLOCK'; reason = 'Would exceed daily allowance' }
    else if (!recipient.trim().toLowerCase().endsWith('.near')) { decision = 'WARN'; reason = 'Recipient is not a .near account name; review manually' }
    setEntries(current => [{ recipient: recipient.trim(), amount, decision, reason }, ...current].slice(0, 10))
    if (decision === 'ALLOW') setSpent(value => Number((value + amount).toFixed(4)))
    setNotice(decision + ': ' + reason + '. Local simulation only.')
  }

  return <main style={{minHeight:'100vh',background:'#090e18',color:'#e8edf5',padding:'32px',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1100,margin:'auto'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #263348',paddingBottom:20}}>
        <div><strong style={{fontSize:22,letterSpacing:2}}>AG<span style={{color:'#82d9a5'}}>·</span>NEAR</strong><p style={{color:'#8d9bb0',fontSize:11}}>AI AGENT SECURITY & SPENDING CONTROL</p></div>
        <span style={{color:'#82d9a5',fontSize:11}}>LOCAL SIMULATION</span>
      </header>
      <section style={{padding:'42px 0 24px'}}><p style={{color:'#82d9a5',fontSize:11,letterSpacing:2}}>POLICY CONTROL CONSOLE</p><h1 style={{fontSize:'clamp(34px,6vw,58px)',margin:'10px 0'}}>Control what your agents can spend.</h1><p style={{color:'#a6b1c1',maxWidth:650,lineHeight:1.7}}>Evaluate proposed NEAR transfers against configurable daily and per-transaction limits before an agent acts.</p></section>
      <p role="status" style={{background:'#14241e',border:'1px solid #315c43',padding:14,color:'#b7ebc8'}}>{notice}</p>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,margin:'18px 0'}}>
        {[['DAILY LIMIT',fmt(dailyLimit)],['SIMULATED SPEND',fmt(spent)],['REMAINING',fmt(remaining)],['ALLOWED EVENTS',String(allowed)]].map(([label,value])=><article key={label} style={{background:'#121b29',border:'1px solid #29384b',padding:20,borderRadius:8}}><small style={{color:'#91a0b4'}}>{label}</small><h2>{value}</h2></article>)}
      </section>
      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:16}}>
        <article style={{background:'#121b29',border:'1px solid #29384b',padding:22,borderRadius:8}}>
          <h2>Spending policy</h2>
          <label style={{display:'block',marginTop:20}}>Daily limit (NEAR)<input type="number" min="0.001" step="0.001" value={dailyLimit} onChange={e=>setDailyLimit(Number(e.target.value))} style={field}/></label>
          <label style={{display:'block',marginTop:18}}>Per-transaction limit (NEAR)<input type="number" min="0.001" step="0.001" value={transactionLimit} onChange={e=>setTransactionLimit(Number(e.target.value))} style={field}/></label>
          <p style={{color:'#9aa9bb',fontSize:12,lineHeight:1.7}}>Rules: block requests above the transaction limit; block requests that exceed the remaining daily allowance; warn on unfamiliar recipient formats.</p>
        </article>
        <article style={{background:'#121b29',border:'1px solid #29384b',padding:22,borderRadius:8}}>
          <h2>Evaluate a transaction</h2>
          <form onSubmit={evaluate}>
            <label style={{display:'block',marginTop:20}}>Recipient account<input value={recipient} onChange={e=>setRecipient(e.target.value)} style={field}/></label>
            <label style={{display:'block',marginTop:18}}>Amount (NEAR)<input type="number" min="0.001" step="0.001" value={amount} onChange={e=>setAmount(Number(e.target.value))} style={field}/></label>
            <button type="submit" style={{marginTop:18,width:'100%',padding:13,background:'#82d9a5',border:0,borderRadius:5,fontWeight:700,cursor:'pointer'}}>Evaluate request</button>
          </form>
        </article>
      </section>
      <section style={{background:'#121b29',border:'1px solid #29384b',padding:22,borderRadius:8,marginTop:16}}>
        <h2>Recent decisions</h2>
        {entries.length===0?<p style={{color:'#9aa9bb'}}>No activity yet. Submit a request above.</p>:<div style={{overflowX:'auto'}}><table style={{width:'100%',textAlign:'left',borderCollapse:'collapse'}}><thead><tr>{['Recipient','Amount','Decision','Reason'].map(x=><th key={x} style={{padding:10,color:'#91a0b4'}}>{x}</th>)}</tr></thead><tbody>{entries.map((item,index)=><tr key={index}>{[item.recipient,fmt(item.amount),item.decision,item.reason].map((x,i)=><td key={i} style={{padding:10,borderTop:'1px solid #29384b'}}>{x}</td>)}</tr>)}</tbody></table></div>}
        <button onClick={()=>{setEntries([]);setSpent(0);setNotice('Demo activity cleared. No blockchain transaction was involved.')}} style={{marginTop:15,padding:10,background:'#263348',color:'#e8edf5',border:0,borderRadius:5,cursor:'pointer'}}>Reset simulation</button>
      </section>
      <aside style={{marginTop:18,padding:16,border:'1px solid #6b5730',color:'#d8c99f',fontSize:12,lineHeight:1.7}}>Prototype limitation: this app evaluates rules locally in the browser. It does not connect to NEAR, intercept wallet calls, sign or broadcast transactions, persist policies to Supabase, or protect real funds. Production use requires a trusted enforcement layer and security review.</aside>
      <footer style={{padding:'25px 0',color:'#8290a3',fontSize:10}}>AGENTGUARD NEAR · EXPERIMENTAL POLICY SIMULATOR</footer>
    </div>
  </main>
}
const field = {display:'block',width:'100%',boxSizing:'border-box' as const,marginTop:8,padding:12,background:'#0a111c',color:'#e8edf5',border:'1px solid #34445a',borderRadius:5}

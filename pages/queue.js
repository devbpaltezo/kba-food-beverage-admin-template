export const access = 'public';

export default async function (req, res) {
  return res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Live Order Queue — ServeFlow</title>
<meta name="description" content="Standalone live order queue for ServeFlow food and beverage demo.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<style>
body{min-height:100vh}.queue-page{max-width:1500px;margin:0 auto;padding:30px 34px}.queue-page-top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:26px}.queue-brand{display:flex;align-items:center;gap:11px}.queue-brand-mark{display:grid;place-items:center;width:42px;height:42px;background:var(--blue);color:white;border-radius:13px;font:800 23px Manrope}.queue-brand-name{font:800 20px Manrope;letter-spacing:-.7px}.queue-brand-sub{font-size:10px;color:var(--muted);letter-spacing:1.4px;margin-top:2px}.queue-page h1{font:800 clamp(26px,3vw,36px) Manrope;letter-spacing:-1.2px;margin:0;color:var(--ink)}.queue-page .page-intro{color:var(--muted);margin:8px 0 0;font-size:14px}.queue-live-strip{margin-bottom:20px}.queue-board{grid-template-columns:repeat(3,minmax(0,1fr))}.queue-lane{min-width:0}.queue-order{background:#fff}.queue-page .queue-note{margin-top:18px}.queue-page .queue-order-top strong{font-size:14px}.queue-page .queue-customer{font-size:15px}.queue-page .queue-meta{font-size:12px}.queue-page .queue-total{font-size:20px}.queue-page .queue-actions .btn{font-size:12px}.queue-page .stat-value{font-size:27px}.queue-page .stat-label{font-size:12px}.queue-back{white-space:nowrap}.queue-empty{padding:25px 12px}.queue-refresh{display:inline-flex;align-items:center;gap:7px}.queue-live-dot{animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}@media(max-width:900px){.queue-board{grid-template-columns:1fr}.queue-page{padding:22px 16px}.queue-page-top{align-items:flex-start;flex-direction:column}.queue-back{align-self:flex-start}}@media(max-width:520px){.queue-page .queue-live-strip{align-items:flex-start}.queue-page .queue-updated{font-size:10px}.queue-page .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
</head>
<body>
<div class="demo-ribbon"><span class="demo-dot"></span> FOR DEMO PURPOSES ONLY <span class="ribbon-sep">•</span> MOCK QUEUE</div>
<main class="queue-page">
<header class="queue-page-top">
<div><div class="queue-brand"><div class="queue-brand-mark">S✳</div><div><div class="queue-brand-name">serveflow</div><div class="queue-brand-sub">FOOD SERVICE OS · LIVE QUEUE</div></div></div>
<div style="margin-top:25px"><h1>Live Order Queue</h1><p class="page-intro">Track preparation, pickup, and completed orders on a dedicated screen.</p></div></div>
<a class="btn btn-light queue-back" href="/">← Back to dashboard</a>
</header>
<div class="queue-live-strip"><span class="queue-live-dot"></span><div><strong>Live demo simulation</strong><span>Queue updates automatically while this page is open · mock data only</span></div><span class="queue-updated" id="updated">Updated just now</span></div>
<div class="stats-grid" id="stats"></div>
<div class="queue-board" id="board"></div>
<div class="queue-note">Standalone /queue endpoint. This demo runs in your browser only; order changes are not shared with other devices and are not saved to a database.</div>
</main>
<script>
const orders=[
{id:"ORD-1048",customer:"Walk-in customer",items:2,total:320,status:"Preparing",time:"10:42 AM"},
{id:"ORD-1047",customer:"Jamie Cruz",items:3,total:475,status:"Ready",time:"10:35 AM"},
{id:"ORD-1046",customer:"Mia Santos",items:1,total:225,status:"Completed",time:"10:22 AM"},
{id:"ORD-1045",customer:"Alex Rivera",items:4,total:615,status:"Preparing",time:"10:16 AM"},
{id:"ORD-1044",customer:"Sam Dela Rosa",items:2,total:300,status:"Completed",time:"10:08 AM"}
];
const money=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);
const badge=s=>'<span class="status-badge '+({Completed:"badge-ready",Ready:"badge-ready",Preparing:"badge-pending"}[s]||"badge-low")+'">'+s+'</span>';
function setStatus(id,status){const o=orders.find(x=>x.id===id);if(!o)return;o.status=status;render();document.getElementById("updated").textContent="Updated at "+new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
function render(){
 const preparing=orders.filter(o=>o.status==="Preparing"),ready=orders.filter(o=>o.status==="Ready"),done=orders.filter(o=>o.status==="Completed"),active=preparing.length+ready.length;
 const stats=[["◷","Active orders",active,"In preparation or ready","blue"],["⌛","Preparing",preparing.length,"Kitchen working","orange"],["✓","Ready for pickup",ready.length,"Awaiting handoff","green"],["▣","Completed today",done.length,"Finished orders","purple"]];
 document.getElementById("stats").innerHTML=stats.map(s=>'<div class="card stat-card"><div class="stat-top"><span class="stat-label">'+s[1]+'</span><span class="stat-icon icon-'+s[4]+'">'+s[0]+'</span></div><div class="stat-value">'+s[2]+'</div><div class="stat-foot">'+s[3]+'</div></div>').join("");
 const card=o=>'<article class="queue-order"><div class="queue-order-top"><strong>'+o.id+'</strong>'+badge(o.status)+'</div><div class="queue-customer">'+o.customer+'</div><div class="queue-meta"><span>'+o.items+' item'+(o.items===1?"":"s")+'</span><span>'+o.time+'</span></div><div class="queue-total">'+money(o.total)+'</div><div class="queue-actions">'+(o.status==="Preparing"?'<button class="btn btn-primary btn-small" onclick="setStatus(\''+o.id+'\',\'Ready\')">Mark ready →</button>':o.status==="Ready"?'<button class="btn btn-primary btn-small" onclick="setStatus(\''+o.id+'\',\'Completed\')">Complete order ✓</button>':'<span class="muted">No action needed</span>')+'</div></article>';
 const lanes=[["preparing","⌛","Preparing","Kitchen in progress",preparing],["ready","✓","Ready for pickup","Waiting for customer",ready],["done","▣","Completed","Recently finished",done]];
 document.getElementById("board").innerHTML=lanes.map(l=>'<section class="queue-lane"><div class="queue-lane-head"><span class="queue-lane-icon '+l[0]+'">'+l[1]+'</span><div><strong>'+l[2]+'</strong><span>'+l[3]+'</span></div><b>'+l[4].length+'</b></div><div class="queue-lane-body">'+(l[4].map(card).join("")||'<div class="queue-empty">No orders in this lane</div>')+'</div></section>').join("");
}
render();
setInterval(()=>{let next=orders.find(o=>o.status==="Preparing");if(next)next.status="Ready";else{next=orders.find(o=>o.status==="Ready");if(next)next.status="Completed"}if(next){render();document.getElementById("updated").textContent="Updated at "+new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}},15000);
</script>
</body></html>`);
}
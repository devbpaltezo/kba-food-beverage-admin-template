export const access = 'public';

export default async function (req, res) {
  return res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Live Order Queue</title>
<meta name="description" content="Standalone live order queue for ServeFlow food and beverage demo.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<style>
body{min-height:100vh}.queue-page{max-width:1500px;margin:0 auto;padding:30px 34px}.queue-page-top{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:26px}.queue-brand{display:flex;align-items:center;gap:11px}.queue-brand-mark{display:grid;place-items:center;width:42px;height:42px;background:var(--blue);color:white;border-radius:13px;font:800 23px Manrope}.queue-brand-name{font:800 20px Manrope;letter-spacing:-.7px}.queue-brand-sub{font-size:10px;color:var(--muted);letter-spacing:1.4px;margin-top:2px}.queue-page h1{font:800 clamp(26px,3vw,36px) Manrope;letter-spacing:-1.2px;margin:0;color:var(--ink)}.queue-page .page-intro{color:var(--muted);margin:8px 0 0;font-size:14px}.queue-live-strip{margin-bottom:20px}.queue-board{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.queue-lane{min-width:0}.queue-order{background:#fff}.queue-page .queue-note{margin-top:18px}.queue-page .queue-order-top strong{font-size:14px}.queue-page .queue-customer{font-size:15px}.queue-page .queue-meta{font-size:12px}.queue-page .queue-total{font-size:20px}.queue-page .queue-actions .btn{font-size:12px}.queue-page .stat-value{font-size:27px}.queue-page .stat-label{font-size:12px}.queue-back{white-space:nowrap}.queue-empty{padding:25px 12px}.queue-refresh{display:inline-flex;align-items:center;gap:7px}.queue-live-dot{animation:pulse 1.5s infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}@media(max-width:900px){.queue-board{grid-template-columns:1fr}.queue-page{padding:22px 16px}.queue-page-top{align-items:flex-start;flex-direction:column}.queue-back{align-self:flex-start}}@media(max-width:520px){.queue-page .queue-live-strip{align-items:flex-start}.queue-page .queue-updated{font-size:10px}.queue-page .stats-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
</style>
</head>
<body>

<main class="queue-page">
<header style="margin-bottom:28px"><h1>Order Queue</h1><p class="page-intro">Please collect your order when it appears under Ready for Pickup.</p></header>
<div class="queue-board" id="board"></div>
</main>
<script>
const ORDER_STORAGE_KEY="serveflow-demo-orders-v1";
const initialOrders=[
{id:"ORD-1048",customer:"Walk-in customer",items:2,total:320,status:"Preparing",time:"10:42 AM",channel:"Counter"},
{id:"ORD-1047",customer:"Jamie Cruz",items:3,total:475,status:"Ready",time:"10:35 AM",channel:"Pickup"},
{id:"ORD-1046",customer:"Mia Santos",items:1,total:225,status:"Completed",time:"10:22 AM",channel:"Dine-in"},
{id:"ORD-1045",customer:"Alex Rivera",items:4,total:615,status:"Preparing",time:"10:16 AM",channel:"Pickup"},
{id:"ORD-1044",customer:"Sam Dela Rosa",items:2,total:300,status:"Completed",time:"10:08 AM",channel:"Dine-in"}
];
function loadOrders(){try{const saved=localStorage.getItem(ORDER_STORAGE_KEY);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed)&&parsed.length)return parsed}}catch(e){}return initialOrders.map(o=>({...o}))}
let orders=loadOrders();
function saveOrders(){try{localStorage.setItem(ORDER_STORAGE_KEY,JSON.stringify(orders))}catch(e){}}
window.addEventListener("storage",e=>{if(e.key===ORDER_STORAGE_KEY){orders=loadOrders();render()}});
const money=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:0}).format(n);
const badge=s=>'<span class="status-badge '+({Completed:"badge-ready",Ready:"badge-ready",Preparing:"badge-pending"}[s]||"badge-low")+'">'+s+'</span>';
function updateTimestamp(){document.getElementById("updated").textContent="Updated at "+new Date().toLocaleTimeString("en-PH",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
function render(){
 const preparing=orders.filter(o=>o.status==="Preparing"),ready=orders.filter(o=>o.status==="Ready");
 const card=o=>'<article class="queue-order"><div class="queue-order-top"><strong>'+o.id+'</strong>'+badge(o.status)+'</div><div class="queue-customer">'+o.customer+'</div><div class="queue-meta"><span>'+o.items+' item'+(o.items===1?"":"s")+'</span><span>'+o.time+'</span></div><div class="queue-total">'+money(o.total)+'</div></article>';
 const lanes=[["preparing","⌛","Preparing","Kitchen in progress",preparing],["ready","✓","Ready for Pickup","Waiting for customer",ready]];
 document.getElementById("board").innerHTML=lanes.map(l=>'<section class="queue-lane"><div class="queue-lane-head"><span class="queue-lane-icon '+l[0]+'">'+l[1]+'</span><div><strong>'+l[2]+'</strong><span>'+l[3]+'</span></div><b>'+l[4].length+'</b></div><div class="queue-lane-body">'+(l[4].map(card).join("")||'<div class="queue-empty">No orders in this lane</div>')+'</div></section>').join("");
}
render();
setInterval(()=>{orders=loadOrders();render()},3000);
</script>
</body></html>`);
}
// Shared helpers: nav highlight, storage, toast, adaptive profile, PDF button
const store = {
  get(k, d){ try{ const v = localStorage.getItem('hcl_'+k); return v?JSON.parse(v):d; }catch(e){ return d; } },
  set(k, v){ localStorage.setItem('hcl_'+k, JSON.stringify(v)); }
};
function toast(msg){ const t=document.getElementById('toast'); if(!t){alert(msg);return;} t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2600); }
function markAnswer(topic, correct){
  const p = store.get('profile', {});
  if(!p[topic]) p[topic]={asked:0,correct:0};
  p[topic].asked++; if(correct) p[topic].correct++;
  store.set('profile', p);
}
function topicAccuracy(){
  const p = store.get('profile', {}); return p;
}
function renderDashboard(elId){
  const el = document.getElementById(elId); if(!el) return;
  const p = store.get('profile', {});
  const topics = Object.keys(p);
  if(!topics.length){ el.innerHTML='<p style="color:var(--mut)">No attempts yet. Solve MCQs or take a mock — your Strong / Weak topics will appear here.</p>'; return; }
  let rows = topics.map(t=>{ const o=p[t]; const acc=Math.round(100*o.correct/o.asked);
    const cls = acc>=75?'catA':acc>=50?'catB':'p0';
    const verdict = acc>=75?'Strong':acc>=50?'Moderate':'Weak';
    return `<tr><td>${t}</td><td>${o.correct}/${o.asked}</td><td>${acc}%</td><td><span class="pill ${cls}">${verdict}</span></td></tr>`; }).join('');
  el.innerHTML = `<table><tr><th>Topic</th><th>Score</th><th>Accuracy</th><th>Status</th></tr>${rows}</table>
  <p style="color:var(--mut);font-size:13px">Adaptive rule: topics &lt;50% are Weak — the Mock page auto-recommends revision from those topics. Topics ≥75% are Strong.</p>`;
}
function readiness(){
  const p = store.get('profile', {}); const ts = Object.values(p);
  if(!ts.length) return {label:'Not assessed', why:'Attempt at least 30 questions to get a readiness estimate.'};
  const asked = ts.reduce((a,b)=>a+b.asked,0), cor = ts.reduce((a,b)=>a+b.correct,0);
  const acc = cor/asked*100;
  if(asked<30) return {label:'Low (insufficient data)', why:`Only ${asked} attempts. Attempt 30+ for a real signal. Current accuracy ${Math.round(acc)}%.`};
  if(acc<55) return {label:'Low', why:`Accuracy ${Math.round(acc)}% across ${asked} Qs. Fix P0 topics (Python, SQL, Pseudocode, Quant) before mocks.`};
  if(acc<70) return {label:'Moderate', why:`Accuracy ${Math.round(acc)}% across ${asked} Qs. You clear easy rounds but medium Qs leak marks. Drill weak topics.`};
  if(acc<85) return {label:'Good', why:`Accuracy ${Math.round(acc)}% across ${asked} Qs. Likely to clear the filter if coding is also solved. Push to 85%+ on P0.`};
  return {label:'Strong', why:`Accuracy ${Math.round(acc)}% across ${asked} Qs. Maintain with timed mocks + 1 coding/day.`};
}
// highlight nav
document.addEventListener('DOMContentLoaded',()=>{
  const f=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  document.querySelectorAll('.navlinks a').forEach(a=>{
    if(a.getAttribute('href').toLowerCase()===f) a.classList.add('on');
  });
  renderDashboard('dashTable');
  const r=document.getElementById('readinessBox');
  if(r){ const o=readiness(); r.innerHTML=`<b>Readiness: ${o.label}</b><br><span style="color:var(--mut)">${o.why}</span>`; }
  // Download-as-PDF button on every page (opens print dialog -> Save as PDF)
  if(!document.getElementById('pdfBtn')){
    const b=document.createElement('button');
    b.id='pdfBtn'; b.textContent='Download as PDF'; b.title='Save this page as PDF';
    b.onclick=()=>window.print();
    document.body.appendChild(b);
  }
});

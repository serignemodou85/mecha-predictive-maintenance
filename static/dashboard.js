const API = '';

// ── 50 Machines ───────────────────────────────────────────────────────────────
const MACHINES = [
  // FR-Lyon (12)
  {id:'M001',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1500,couple_Nm:42,usure_outil_min:20},
  {id:'M002',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'L',temp_air_C:26,temp_process_C:37,vitesse_rotation_rpm:1600,couple_Nm:45,usure_outil_min:80},
  {id:'M003',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:25,temp_process_C:36,vitesse_rotation_rpm:1480,couple_Nm:41,usure_outil_min:150},
  {id:'M004',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'H',temp_air_C:24,temp_process_C:34,vitesse_rotation_rpm:1420,couple_Nm:38,usure_outil_min:35},
  {id:'M005',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:27,temp_process_C:39,vitesse_rotation_rpm:1650,couple_Nm:47,usure_outil_min:110},
  {id:'M006',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'L',temp_air_C:28,temp_process_C:45,vitesse_rotation_rpm:2100,couple_Nm:60,usure_outil_min:205},
  {id:'M007',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1500,couple_Nm:42,usure_outil_min:5},
  {id:'M008',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'H',temp_air_C:26,temp_process_C:36,vitesse_rotation_rpm:1550,couple_Nm:44,usure_outil_min:60},
  {id:'M009',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:25,temp_process_C:37,vitesse_rotation_rpm:1520,couple_Nm:43,usure_outil_min:135},
  {id:'M010',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'L',temp_air_C:29,temp_process_C:50,vitesse_rotation_rpm:2300,couple_Nm:65,usure_outil_min:240},
  {id:'M011',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'M',temp_air_C:26,temp_process_C:36,vitesse_rotation_rpm:1580,couple_Nm:44,usure_outil_min:90},
  {id:'M012',pays:'FR',ville:'Lyon',usine:'FR-Lyon',type:'H',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1450,couple_Nm:40,usure_outil_min:15},
  // FR-Toulouse (10)
  {id:'M013',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'H',temp_air_C:27,temp_process_C:38,vitesse_rotation_rpm:1700,couple_Nm:50,usure_outil_min:200},
  {id:'M014',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'M',temp_air_C:28,temp_process_C:40,vitesse_rotation_rpm:1800,couple_Nm:55,usure_outil_min:230},
  {id:'M015',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'L',temp_air_C:29,temp_process_C:50,vitesse_rotation_rpm:2200,couple_Nm:62,usure_outil_min:245},
  {id:'M016',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'M',temp_air_C:26,temp_process_C:36,vitesse_rotation_rpm:1600,couple_Nm:46,usure_outil_min:55},
  {id:'M017',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'H',temp_air_C:27,temp_process_C:37,vitesse_rotation_rpm:1680,couple_Nm:49,usure_outil_min:120},
  {id:'M018',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'M',temp_air_C:28,temp_process_C:41,vitesse_rotation_rpm:1850,couple_Nm:56,usure_outil_min:170},
  {id:'M019',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'L',temp_air_C:30,temp_process_C:48,vitesse_rotation_rpm:2100,couple_Nm:60,usure_outil_min:252},
  {id:'M020',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'M',temp_air_C:26,temp_process_C:36,vitesse_rotation_rpm:1580,couple_Nm:44,usure_outil_min:30},
  {id:'M021',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'H',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1520,couple_Nm:43,usure_outil_min:75},
  {id:'M022',pays:'FR',ville:'Toulouse',usine:'FR-Toulouse',type:'M',temp_air_C:27,temp_process_C:39,vitesse_rotation_rpm:1720,couple_Nm:51,usure_outil_min:145},
  // FR-Nantes (10)
  {id:'M023',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'M',temp_air_C:24,temp_process_C:34,vitesse_rotation_rpm:1400,couple_Nm:38,usure_outil_min:10},
  {id:'M024',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'L',temp_air_C:25,temp_process_C:36,vitesse_rotation_rpm:1550,couple_Nm:43,usure_outil_min:60},
  {id:'M025',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'H',temp_air_C:24,temp_process_C:34,vitesse_rotation_rpm:1380,couple_Nm:37,usure_outil_min:100},
  {id:'M026',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'M',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1460,couple_Nm:40,usure_outil_min:160},
  {id:'M027',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'L',temp_air_C:27,temp_process_C:44,vitesse_rotation_rpm:2000,couple_Nm:58,usure_outil_min:220},
  {id:'M028',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'M',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1490,couple_Nm:41,usure_outil_min:45},
  {id:'M029',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'H',temp_air_C:24,temp_process_C:34,vitesse_rotation_rpm:1420,couple_Nm:38,usure_outil_min:85},
  {id:'M030',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'M',temp_air_C:25,temp_process_C:36,vitesse_rotation_rpm:1510,couple_Nm:42,usure_outil_min:130},
  {id:'M031',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'L',temp_air_C:28,temp_process_C:46,vitesse_rotation_rpm:2050,couple_Nm:59,usure_outil_min:235},
  {id:'M032',pays:'FR',ville:'Nantes',usine:'FR-Nantes',type:'M',temp_air_C:25,temp_process_C:35,vitesse_rotation_rpm:1470,couple_Nm:40,usure_outil_min:25},
  // ES-Madrid (10)
  {id:'M033',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'M',temp_air_C:30,temp_process_C:42,vitesse_rotation_rpm:1900,couple_Nm:58,usure_outil_min:220},
  {id:'M034',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'L',temp_air_C:31,temp_process_C:55,vitesse_rotation_rpm:2700,couple_Nm:70,usure_outil_min:252},
  {id:'M035',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'H',temp_air_C:29,temp_process_C:40,vitesse_rotation_rpm:1820,couple_Nm:54,usure_outil_min:70},
  {id:'M036',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'M',temp_air_C:30,temp_process_C:43,vitesse_rotation_rpm:1950,couple_Nm:59,usure_outil_min:140},
  {id:'M037',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'L',temp_air_C:32,temp_process_C:52,vitesse_rotation_rpm:2500,couple_Nm:68,usure_outil_min:240},
  {id:'M038',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'M',temp_air_C:30,temp_process_C:42,vitesse_rotation_rpm:1880,couple_Nm:57,usure_outil_min:50},
  {id:'M039',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'H',temp_air_C:29,temp_process_C:40,vitesse_rotation_rpm:1800,couple_Nm:53,usure_outil_min:105},
  {id:'M040',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'M',temp_air_C:31,temp_process_C:44,vitesse_rotation_rpm:2000,couple_Nm:60,usure_outil_min:180},
  {id:'M041',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'L',temp_air_C:33,temp_process_C:56,vitesse_rotation_rpm:2800,couple_Nm:72,usure_outil_min:248},
  {id:'M042',pays:'ES',ville:'Madrid',usine:'ES-Madrid',type:'M',temp_air_C:30,temp_process_C:41,vitesse_rotation_rpm:1860,couple_Nm:55,usure_outil_min:35},
  // ES-Barcelone (8)
  {id:'M043',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'H',temp_air_C:28,temp_process_C:39,vitesse_rotation_rpm:1650,couple_Nm:48,usure_outil_min:100},
  {id:'M044',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'M',temp_air_C:29,temp_process_C:41,vitesse_rotation_rpm:1750,couple_Nm:52,usure_outil_min:180},
  {id:'M045',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'L',temp_air_C:30,temp_process_C:48,vitesse_rotation_rpm:2200,couple_Nm:63,usure_outil_min:230},
  {id:'M046',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'M',temp_air_C:28,temp_process_C:39,vitesse_rotation_rpm:1700,couple_Nm:50,usure_outil_min:55},
  {id:'M047',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'H',temp_air_C:27,temp_process_C:38,vitesse_rotation_rpm:1630,couple_Nm:47,usure_outil_min:15},
  {id:'M048',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'M',temp_air_C:29,temp_process_C:42,vitesse_rotation_rpm:1780,couple_Nm:53,usure_outil_min:155},
  {id:'M049',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'L',temp_air_C:31,temp_process_C:50,vitesse_rotation_rpm:2400,couple_Nm:67,usure_outil_min:245},
  {id:'M050',pays:'ES',ville:'Barcelone',usine:'ES-Barcelone',type:'M',temp_air_C:28,temp_process_C:40,vitesse_rotation_rpm:1720,couple_Nm:51,usure_outil_min:75},
];

const FLAGS    = { FR:'🇫🇷', ES:'🇪🇸' };
const PAYS_NOM = { FR:'France', ES:'Espagne' };
const VILLES_FR = ['Lyon','Toulouse','Nantes'];
const VILLES_ES = ['Madrid','Barcelone'];

let results={}, history={}, lastUpdate=null;
let autoOn=true, countdown=30, timer=null;
let chart=null, activeMachine=null, activeTab='rul';

// ── Simulation dégradation ────────────────────────────────────────────────────
let simActive=false, simInterval=null;
let simUsure={};
MACHINES.forEach(m => simUsure[m.id] = m.usure_outil_min);

function toggleSim() {
  simActive = !simActive;
  const btn = document.getElementById('sim-btn');
  btn.textContent = simActive ? '⏹ Arrêter simulation' : '▶ Simuler dégradation';
  btn.className   = 'sim-btn' + (simActive ? ' active' : '');
  if (simActive) {
    simInterval = setInterval(() => {
      MACHINES.forEach(m => {
        simUsure[m.id] = Math.min(260, simUsure[m.id] + Math.floor(Math.random()*5)+3);
      });
      loadMachines();
    }, 5000);
    loadMachines();
  } else {
    clearInterval(simInterval); simInterval=null;
    MACHINES.forEach(m => simUsure[m.id] = m.usure_outil_min);
    loadMachines();
  }
}

// ── Countdown temps réel ──────────────────────────────────────────────────────
let countdownLiveInterval=null;
const critiqueDates={};

function parseDatePanne(str) {
  if (!str) return null;
  const parts = str.split(' à ');
  if (parts.length < 2) return null;
  const [d,mo,y] = parts[0].split('/');
  const [h,mi]   = parts[1].split(':');
  return new Date(+y, +mo-1, +d, +h, +mi, 0);
}

function machineOffset(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 26) + 50;
}

function variedDate(machineId, dateStr) {
  const dt = parseDatePanne(dateStr);
  if (!dt) return null;
  dt.setDate(dt.getDate() + machineOffset(machineId));
  return dt;
}

function fmtDate(dt) {
  if (!dt) return '—';
  const d  = String(dt.getDate()).padStart(2,'0');
  const mo = String(dt.getMonth()+1).padStart(2,'0');
  const h  = String(dt.getHours()).padStart(2,'0');
  const mi = String(dt.getMinutes()).padStart(2,'0');
  return `${d}/${mo}/${dt.getFullYear()} à ${h}:${mi}`;
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Panne imminente !';
  const h = Math.floor(ms/3600000);
  const m = Math.floor((ms%3600000)/60000);
  const s = Math.floor((ms%60000)/1000);
  return h>0 ? `dans ${h}h ${m}m ${s}s` : `dans ${m}m ${s}s`;
}

function startCountdownLive() {
  if (countdownLiveInterval) clearInterval(countdownLiveInterval);
  countdownLiveInterval = setInterval(() => {
    const now = Date.now();
    Object.entries(critiqueDates).forEach(([id,dt]) => {
      const el = document.getElementById('cd-'+id);
      if (el && dt) el.textContent = formatCountdown(dt.getTime()-now);
    });
  }, 1000);
}

// ── Filtres ───────────────────────────────────────────────────────────────────
let filterPays='all', filterVille=null;

function setCountry(pays) {
  filterPays=pays; filterVille=null;
  updateFilterUI(); renderMachines(); renderAlerts(); updateKPIs();
}
function setCity(ville) {
  filterVille = filterVille===ville ? null : ville;
  if (filterVille) filterPays = VILLES_FR.includes(ville)?'FR':'ES';
  updateFilterUI(); renderMachines(); renderAlerts(); updateKPIs();
}
function getFiltered() {
  return MACHINES.filter(m=>{
    if (filterVille) return m.ville===filterVille;
    if (filterPays!=='all') return m.pays===filterPays;
    return true;
  });
}
function updateFilterUI() {
  document.getElementById('f-all').className='filter-btn'+(filterPays==='all'&&!filterVille?' active':'');
  document.getElementById('f-fr').className ='filter-btn'+(filterPays==='FR'?' active-fr':'');
  document.getElementById('f-es').className ='filter-btn'+(filterPays==='ES'?' active-es':'');
  [...VILLES_FR,...VILLES_ES].forEach(v=>{
    const btn=document.getElementById('c-'+v); if(!btn)return;
    const isPays=VILLES_FR.includes(v)?'FR':'ES';
    btn.className='city-btn'+(filterVille===v?' active-'+isPays.toLowerCase():'');
    btn.style.opacity=(filterPays!=='all'&&isPays!==filterPays)?'0.35':'1';
    btn.style.pointerEvents=(filterPays!=='all'&&isPays!==filterPays)?'none':'auto';
  });
  const fm=getFiltered();
  const scope=filterVille?filterVille:(filterPays!=='all'?PAYS_NOM[filterPays]:'Tous sites');
  document.getElementById('filter-count').textContent=`${fm.length} machine${fm.length>1?'s':''} — ${scope}`;
  document.getElementById('alert-scope').textContent=filterVille||filterPays!=='all'?`(${scope})`:'';
  document.getElementById('kpi-total-sub').textContent=filterVille?`Site ${filterVille}`:filterPays!=='all'?`Sites ${PAYS_NOM[filterPays]}`:'5 usines MECHA';
}

// ── Auto-refresh ──────────────────────────────────────────────────────────────
const CIRC=2*Math.PI*9;
function toggleAuto(){
  autoOn=!autoOn;
  document.getElementById('auto-btn').textContent=autoOn?'⏱ Auto ON':'⏱ Auto OFF';
  document.getElementById('auto-btn').className='auto-toggle'+(autoOn?' on':'');
  document.getElementById('ring-wrap').style.opacity=autoOn?'1':'0.3';
  autoOn?startTimer():(clearInterval(timer),timer=null);
}
function startTimer(){
  clearInterval(timer); countdown=30; updateRing();
  timer=setInterval(()=>{countdown--;updateRing();if(countdown<=0){countdown=30;loadMachines();}},1000);
}
function updateRing(){
  document.getElementById('ring-fg').style.strokeDashoffset=CIRC*(1-countdown/30);
  document.getElementById('cnum').textContent=countdown;
}

// ── Historique ────────────────────────────────────────────────────────────────
function addHistory(id,rul,prob){
  if(!history[id])history[id]=[];
  history[id].push({t:new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),rul:Math.round(rul),prob:Math.round(prob*100)});
  if(history[id].length>20)history[id].shift();
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(id){
  activeMachine=id; activeTab='rul';
  const m=MACHINES.find(x=>x.id===id);
  document.getElementById('modal-title').textContent=`${FLAGS[m.pays]} ${id} — ${m.usine}`;
  refreshModalStats();
  document.getElementById('modal').classList.add('open');
  document.getElementById('tab-rul').className='chart-tab active';
  document.getElementById('tab-prob').className='chart-tab';
  drawChart(); fillForm(id);
}
function closeModal(){document.getElementById('modal').classList.remove('open');}
function refreshModalStats(){
  const r=results[activeMachine];
  document.getElementById('m-rul').textContent   =r?Math.round(r.RUL_min)+' min':'—';
  document.getElementById('m-prob').textContent  =r?Math.round(r.probabilite_panne*100)+'%':'—';
  document.getElementById('m-alerte').textContent=r?r.niveau_alerte:'—';
}
function switchTab(tab){
  activeTab=tab;
  document.getElementById('tab-rul').className ='chart-tab'+(tab==='rul'?' active':'');
  document.getElementById('tab-prob').className='chart-tab'+(tab==='prob'?' active':'');
  drawChart();
}

// ── Graphe avec seuils ────────────────────────────────────────────────────────
function drawChart(){
  const h=history[activeMachine]||[];
  const labels=h.length?h.map(x=>x.t):['—'];
  const data  =h.length?h.map(x=>activeTab==='rul'?x.rul:x.prob):[0];
  const color =activeTab==='rul'?'#1D9E75':'#E24B4A';
  const label =activeTab==='rul'?'RUL (min)':'Prob. panne (%)';
  const sAtt  =activeTab==='rul'?60:45;
  const sCrit =activeTab==='rul'?30:70;
  const lAtt  =activeTab==='rul'?`Seuil ATTENTION (${sAtt} min)`:`Seuil ATTENTION (${sAtt}%)`;
  const lCrit =activeTab==='rul'?`Seuil CRITIQUE (${sCrit} min)`:`Seuil CRITIQUE (${sCrit}%)`;
  if(chart)chart.destroy();
  chart=new Chart(document.getElementById('histChart').getContext('2d'),{
    type:'line',
    data:{labels,datasets:[
      {label,data,borderColor:color,backgroundColor:color+'22',fill:true,tension:.3,pointRadius:4,pointBackgroundColor:color},
      {label:lAtt, data:Array(labels.length).fill(sAtt), borderColor:'#EF9F27',borderDash:[5,5],pointRadius:0,fill:false,tension:0,borderWidth:1.5},
      {label:lCrit,data:Array(labels.length).fill(sCrit),borderColor:'#E24B4A',borderDash:[5,5],pointRadius:0,fill:false,tension:0,borderWidth:1.5},
    ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:true,position:'bottom',labels:{font:{size:10},boxWidth:12,padding:8}}},
      scales:{y:{beginAtZero:false,grid:{color:'#F1EFE8'},ticks:{font:{size:11}}},
              x:{grid:{display:false},ticks:{font:{size:10},maxTicksLimit:8}}}}
  });
}

// ── API ───────────────────────────────────────────────────────────────────────
async function checkAPI(){
  try{
    await(await fetch(API+'/health',{signal:AbortSignal.timeout(3000)})).json();
    document.getElementById('api-dot').className='api-dot ok';
    document.getElementById('api-status-text').textContent='API connectée';
    return true;
  }catch{
    document.getElementById('api-dot').className='api-dot err';
    document.getElementById('api-status-text').textContent='API non disponible';
    return false;
  }
}

async function loadMachines(){
  if(!await checkAPI()){
    document.getElementById('machines-container').innerHTML='<div style="text-align:center;padding:2rem;color:#A32D2D;">Impossible de joindre l\'API Flask.<br>Lance : <code>python app.py</code></div>';
    document.getElementById('alerts-container').innerHTML='<div class="no-alerts">API non disponible</div>';
    updateKPIs(); return;
  }
  try{
    const payload=MACHINES.map(m=>({
      machine_id:m.id, usine:m.usine, type_piece:m.type,
      temp_air_C:m.temp_air_C, temp_process_C:m.temp_process_C,
      vitesse_rotation_rpm:m.vitesse_rotation_rpm, couple_Nm:m.couple_Nm,
      usure_outil_min:simUsure[m.id]
    }));
    const data=await(await fetch(API+'/predict/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})).json();
    results={};
    data.results.forEach(r=>{
      results[r.machine_id]=r;
      addHistory(r.machine_id,r.RUL_min,r.probabilite_panne);
      if(r.niveau_alerte==='CRITIQUE'&&r.date_panne_estimee){
        critiqueDates[r.machine_id]=variedDate(r.machine_id, r.date_panne_estimee);
      } else {
        delete critiqueDates[r.machine_id];
      }
    });
    lastUpdate=new Date().toLocaleTimeString('fr-FR');
    document.getElementById('last-update').textContent=`Dernière mise à jour : ${lastUpdate}`;
    renderMachines(); renderAlerts(); updateKPIs(); renderRapport();
    startCountdownLive();
    if(document.getElementById('modal').classList.contains('open')&&activeMachine){refreshModalStats();drawChart();}
  }catch(e){
    document.getElementById('machines-container').innerHTML=`<div style="text-align:center;padding:2rem;color:#A32D2D;">Erreur : ${e.message}</div>`;
  }
}

// ── Rendu machines avec barre de vie ─────────────────────────────────────────
function renderMachines(){
  const now=new Date().toLocaleTimeString('fr-FR');
  const fm=getFiltered();
  if(!fm.length){document.getElementById('machines-container').innerHTML='<div class="no-machines">Aucune machine pour ce filtre.</div>';return;}
  const byPays={};
  fm.forEach(m=>{if(!byPays[m.pays])byPays[m.pays]={};if(!byPays[m.pays][m.ville])byPays[m.pays][m.ville]=[];byPays[m.pays][m.ville].push(m);});
  let html='';
  for(const [pays,villes] of Object.entries(byPays)){
    const paysMs=fm.filter(m=>m.pays===pays);
    const critPays=paysMs.filter(m=>results[m.id]&&results[m.id].niveau_alerte==='CRITIQUE').length;
    const attPays =paysMs.filter(m=>results[m.id]&&results[m.id].niveau_alerte==='ATTENTION').length;
    const s1=critPays?`🔴 ${critPays} critique${critPays>1?'s':''} `:'';
    const s2=attPays ?`🟠 ${attPays} attention`:'';
    html+=`<div class="country-section">
      <div class="country-header ${pays.toLowerCase()}">
        <span style="font-size:20px">${FLAGS[pays]}</span>
        <span class="country-name ${pays.toLowerCase()}">${PAYS_NOM[pays]}</span>
        <span class="country-stats">${s1}${s2}${!s1&&!s2?'✅ Toutes nominales':''}</span>
      </div>`;
    for(const [ville,ms] of Object.entries(villes)){
      html+=`<div class="usine-group">
        <div class="usine-header"><div class="usine-dot ${pays.toLowerCase()}"></div><div class="usine-title">${ville} — ${ms[0].usine}</div></div>
        <div class="machines-row">`;
      ms.forEach(m=>{
        const r=results[m.id], c=r?cls(r.niveau_alerte):'loading';
        const pct=r?Math.min(100,Math.round(r.RUL_min/260*100)):50;
        const icon = c==='critique'?'🔴':c==='attention'?'🟠':'🟢';
        html+=`<div class="machine-card ${c}" onclick="openModal('${m.id}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px">
            <div class="mc-country">${FLAGS[m.pays]} ${m.ville}</div>
            <span style="font-size:11px">${icon}</span>
          </div>
          <div class="mc-id ${c}">${m.id}</div>
          <div class="mc-rul ${c}">RUL : ${r?Math.round(r.RUL_min)+' min':'...'}</div>
          <div class="mc-badge ${c}">${r?r.niveau_alerte:'Chargement'}</div>
          <div class="life-bar-wrap"><div class="life-bar-fill ${c}" style="width:${pct}%"></div></div>
        </div>`;
      });
      html+='</div></div>';
    }
    html+='</div>';
  }
  document.getElementById('machines-container').innerHTML=html;
}

// ── Alertes avec countdown ────────────────────────────────────────────────────
function renderAlerts(){
  const now=new Date().toLocaleTimeString('fr-FR');
  const fm=getFiltered();
  const alerts=[
    ...fm.filter(m=>results[m.id]&&results[m.id].niveau_alerte==='CRITIQUE'),
    ...fm.filter(m=>results[m.id]&&results[m.id].niveau_alerte==='ATTENTION')
  ];
  if(!alerts.length){document.getElementById('alerts-container').innerHTML='<div class="no-alerts">✅ Aucune alerte — toutes les machines sont nominales.</div>';return;}
  document.getElementById('alerts-container').innerHTML=alerts.map(m=>{
    const r=results[m.id], c=cls(r.niveau_alerte);
    const isCrit=r.niveau_alerte==='CRITIQUE';
    return `<div class="alert-item">
      <div class="alert-dot ${c}"></div>
      <div style="flex:1">
        <div class="alert-machine"><span>${FLAGS[m.pays]}</span> ${m.id} — ${m.ville}</div>
        <div class="alert-detail">RUL : ${Math.round(r.RUL_min)} min | Prob. : ${Math.round(r.probabilite_panne*100)}%</div>
        ${r.date_panne_estimee?`<div class="alert-detail" style="font-weight:bold">Panne estimée le ${fmtDate(variedDate(m.id,r.date_panne_estimee))}</div>`:''}
        ${isCrit?`<div class="countdown-live" id="cd-${m.id}">Calcul...</div>`:''}
        <div class="alert-time">${now}</div>
      </div>
    </div>`;
  }).join('');
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
function updateKPIs(){
  const fm=getFiltered();
  const wr=fm.filter(m=>results[m.id]);
  const normal   =wr.filter(m=>results[m.id].niveau_alerte==='NORMAL').length;
  const attention=wr.filter(m=>results[m.id].niveau_alerte==='ATTENTION').length;
  const critique =wr.filter(m=>results[m.id].niveau_alerte==='CRITIQUE').length;
  const urgentes =wr.filter(m=>results[m.id].RUL_min<1440).length;
  const dispo    =wr.length>0?Math.round(normal/wr.length*100):0;
  const rulMoyen =wr.length>0?Math.round(wr.reduce((s,m)=>s+results[m.id].RUL_min,0)/wr.length/60):0;
  document.getElementById('kpi-total').textContent     =fm.length;
  document.getElementById('kpi-normal').textContent    =normal;
  document.getElementById('kpi-attention').textContent =attention;
  document.getElementById('kpi-critique').textContent  =critique;
  document.getElementById('kpi-urgentes').textContent  =urgentes;
  document.getElementById('kpi-planif').textContent    =attention;
  document.getElementById('kpi-dispo').textContent     =dispo+'%';
  document.getElementById('kpi-rul-moyen').textContent =rulMoyen+'h';
}

// ── Rapport de maintenance ────────────────────────────────────────────────────
function renderRapport(){
  const fm=getFiltered();
  const wr=fm.filter(m=>results[m.id]);
  if(!wr.length) return;
  document.getElementById('rapport-date').textContent=`Généré le ${new Date().toLocaleString('fr-FR')}`;
  const sort=(a,b)=>results[a.id].RUL_min-results[b.id].RUL_min;
  const arret =wr.filter(m=>results[m.id].niveau_alerte==='CRITIQUE').sort(sort);
  const planif=wr.filter(m=>results[m.id].niveau_alerte==='ATTENTION').sort(sort);
  const ok    =wr.filter(m=>results[m.id].niveau_alerte==='NORMAL').sort(sort);
  const rows=ms=>ms.length?ms.map(m=>{const r=results[m.id];return`<tr>
    <td><strong>${m.id}</strong></td><td>${FLAGS[m.pays]} ${m.ville} — ${m.usine}</td>
    <td>${Math.round(r.RUL_min)} min</td><td>${Math.round(r.probabilite_panne*100)}%</td>
    <td>${fmtDate(variedDate(m.id,r.date_panne_estimee))}</td></tr>`;}).join('')
    :'<tr><td colspan="5" style="color:#888780;text-align:center;padding:8px">Aucune</td></tr>';
  const th='<tr><th>Machine</th><th>Site</th><th>RUL</th><th>Prob.</th><th>Panne estimée</th></tr>';
  document.getElementById('rapport-container').innerHTML=`
    <div class="rapport-section"><div class="rapport-badge critique">Arrêt immédiat — ${arret.length} machine${arret.length!==1?'s':''}</div>
      <table class="rapport-table">${th}${rows(arret)}</table></div>
    <div class="rapport-section"><div class="rapport-badge attention">Planifiable — ${planif.length} machine${planif.length!==1?'s':''}</div>
      <table class="rapport-table">${th}${rows(planif)}</table></div>
    <div class="rapport-section"><div class="rapport-badge normal">Parc nominal — ${ok.length} machine${ok.length!==1?'s':''}</div>
      <table class="rapport-table">${th}${rows(ok)}</table></div>`;
}

function exportCSV(){
  const fm=getFiltered();
  let csv=`Rapport MECHA — ${new Date().toLocaleString('fr-FR')}\nMachine,Pays,Ville,Usine,Alerte,Prob.(%),RUL(min),Panne estimée\n`;
  [...fm].sort((a,b)=>{const o={CRITIQUE:0,ATTENTION:1,NORMAL:2};return(o[(results[a.id]||{}).niveau_alerte]??3)-(o[(results[b.id]||{}).niveau_alerte]??3);})
  .forEach(m=>{const r=results[m.id];
    csv+=r?`${m.id},${PAYS_NOM[m.pays]},${m.ville},${m.usine},${r.niveau_alerte},${Math.round(r.probabilite_panne*100)},${Math.round(r.RUL_min)},${r.date_panne_estimee||'—'}\n`
         :`${m.id},${PAYS_NOM[m.pays]},${m.ville},${m.usine},N/A,N/A,N/A,N/A\n`;});
  dlFile(csv,`mecha_alertes_${today()}.csv`,'text/csv');
}

function exportRapportCSV(){
  const fm=getFiltered().filter(m=>results[m.id]);
  let csv=`Rapport maintenance MECHA — ${new Date().toLocaleString('fr-FR')}\nMachine,Pays,Ville,Usine,Statut,RUL(min),Prob.(%),Panne estimée\n`;
  fm.sort((a,b)=>{const o={CRITIQUE:0,ATTENTION:1,NORMAL:2};return o[results[a.id].niveau_alerte]-o[results[b.id].niveau_alerte];})
  .forEach(m=>{const r=results[m.id];
    csv+=`${m.id},${PAYS_NOM[m.pays]},${m.ville},${m.usine},${r.niveau_alerte},${Math.round(r.RUL_min)},${Math.round(r.probabilite_panne*100)},${fmtDate(variedDate(m.id,r.date_panne_estimee))}\n`;});
  dlFile(csv,`mecha_rapport_${today()}.csv`,'text/csv');
}

function exportRapportJSON(){
  const fm=getFiltered().filter(m=>results[m.id]);
  const data={generated:new Date().toISOString(),scope:filterVille||(filterPays!=='all'?PAYS_NOM[filterPays]:'Tous sites'),
    machines:fm.map(m=>({id:m.id,pays:PAYS_NOM[m.pays],ville:m.ville,usine:m.usine,...results[m.id]}))};
  dlFile(JSON.stringify(data,null,2),`mecha_rapport_${today()}.json`,'application/json');
}

function dlFile(content,filename,type){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=filename; a.click();
}
function today(){return new Date().toISOString().slice(0,10);}
function cls(a){return a==='CRITIQUE'?'critique':a==='ATTENTION'?'attention':'normal';}

function fillForm(id){
  const m=MACHINES.find(x=>x.id===id); if(!m)return;
  document.getElementById('f-machine').value=m.id;
  document.getElementById('f-usine').value=m.usine;
  document.getElementById('f-type').value=m.type;
  document.getElementById('f-tair').value=m.temp_air_C;
  document.getElementById('f-tproc').value=m.temp_process_C;
  document.getElementById('f-vit').value=m.vitesse_rotation_rpm;
  document.getElementById('f-couple').value=m.couple_Nm;
  document.getElementById('f-usure').value=simUsure[m.id]||m.usure_outil_min;
  document.getElementById('result-box').style.display='none';
}

async function predict(){
  const btn=document.getElementById('predict-btn');
  btn.disabled=true; btn.textContent='Calcul en cours...';
  try{
    const payload={
      machine_id:document.getElementById('f-machine').value,
      usine:document.getElementById('f-usine').value,
      type_piece:document.getElementById('f-type').value,
      temp_air_C:+document.getElementById('f-tair').value,
      temp_process_C:+document.getElementById('f-tproc').value,
      vitesse_rotation_rpm:+document.getElementById('f-vit').value,
      couple_Nm:+document.getElementById('f-couple').value,
      usure_outil_min:+document.getElementById('f-usure').value,
      model:document.getElementById('f-model').value,
    };
    const data=await(await fetch(API+'/predict',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})).json();
    const pred=data.prediction, c=cls(pred.niveau_alerte);
    const box=document.getElementById('result-box');
    box.className='result-box '+c; box.style.display='block';
    document.getElementById('result-header').className='result-header '+c;
    document.getElementById('result-header').textContent=`${pred.niveau_alerte} — Machine ${data.machine_id}`;
    const dateEl=document.getElementById('res-date');
    if(pred.date_panne_estimee){dateEl.className='result-date '+c;dateEl.style.display='block';dateEl.textContent=`Panne estimée le ${pred.date_panne_estimee}`;}
    else{dateEl.style.display='none';}
    document.getElementById('res-model').textContent=`Modèle utilisé : ${data.modele_utilise||'N/A'}`;
    document.getElementById('res-prob').textContent=Math.round(pred.probabilite_panne*100)+'%';
    document.getElementById('res-rul').textContent=Math.round(pred.RUL_min)+' min';
    document.getElementById('res-alerte').textContent=pred.niveau_alerte;
    document.getElementById('res-reco').textContent=data.recommandation;
  }catch(e){alert('Erreur API : '+e.message);}
  btn.disabled=false; btn.textContent='Lancer la prédiction';
}

function refreshAll(){results={};renderMachines();loadMachines();if(autoOn){clearInterval(timer);startTimer();}}

function switchGraphTab(tab){
  ['classif','rul'].forEach(t=>{
    document.getElementById('gpanel-'+t).style.display = t===tab ? 'grid' : 'none';
    document.getElementById('gtab-'+t).classList.toggle('active', t===tab);
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
updateFilterUI();
loadMachines();
if(autoOn) startTimer();

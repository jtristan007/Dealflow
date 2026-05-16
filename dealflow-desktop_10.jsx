import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

const ThemeCtx = createContext(null);
const useC = () => useContext(ThemeCtx);

const DARK = {
  bg0:"#2e2e2e",bg1:"#363636",bg2:"#3f3f3f",bg3:"#484848",
  border:"rgba(255,255,255,0.10)",border2:"rgba(255,255,255,0.18)",
  text0:"#f8fafc",text1:"#cbd5e1",text2:"#8a9ab5",text3:"#606878",
  accent:"#5b21b6",accent2:"#6d28d9",accentL:"#a78bfa",
  green:"#34d399",blue:"#38bdf8",amber:"#fbbf24",
  orange:"#fb923c",red:"#f87171",pink:"#f472b6",teal:"#2dd4bf",
  thumb:"#555",scrollbar:"#555",rangeBorder:"#363636",
};
const LIGHT = {
  bg0:"#f0f2f5",bg1:"#ffffff",bg2:"#f8fafc",bg3:"#eef1f6",
  border:"rgba(0,0,0,0.09)",border2:"rgba(0,0,0,0.16)",
  text0:"#0f172a",text1:"#334155",text2:"#64748b",text3:"#94a3b8",
  accent:"#5b21b6",accent2:"#6d28d9",accentL:"#6d28d9",
  green:"#059669",blue:"#0284c7",amber:"#d97706",
  orange:"#ea580c",red:"#dc2626",pink:"#db2777",teal:"#0d9488",
  thumb:"#c0c8d8",scrollbar:"#e2e8f0",rangeBorder:"#ffffff",
};

const SOURCE_CFG = {
  "Zillow":        {icon:"Z",color:"#1277e1",bg:"rgba(18,119,225,.12)", bd:"rgba(18,119,225,.35)"},
  "Redfin":        {icon:"R",color:"#c8232c",bg:"rgba(200,35,44,.12)",  bd:"rgba(200,35,44,.35)"},
  "Tax Delinquent":{icon:"T",color:"#d97706",bg:"rgba(217,119,6,.12)",  bd:"rgba(217,119,6,.35)"},
  "Homes.com":     {icon:"H",color:"#0d9488",bg:"rgba(13,148,136,.12)", bd:"rgba(13,148,136,.35)"},
  "Facebook":      {icon:"F",color:"#1877f2",bg:"rgba(24,119,242,.12)", bd:"rgba(24,119,242,.35)"},
  "Crexi":         {icon:"C",color:"#ea580c",bg:"rgba(234,88,12,.12)",  bd:"rgba(234,88,12,.35)"},
};

const STATUS_CFG = {
  "New Lead":       {bg:"rgba(109,40,217,.12)",txt:"#7c3aed",bd:"rgba(109,40,217,.3)"},
  "Lead":           {bg:"rgba(217,119,6,.12)", txt:"#d97706",bd:"rgba(217,119,6,.3)"},
  "Analyzing":      {bg:"rgba(2,132,199,.12)", txt:"#0284c7",bd:"rgba(2,132,199,.3)"},
  "Under Contract": {bg:"rgba(5,150,105,.12)", txt:"#059669",bd:"rgba(5,150,105,.3)"},
  "Closed":         {bg:"rgba(100,116,139,.1)",txt:"#64748b",bd:"rgba(100,116,139,.25)"},
};

const STRAT_COLOR = {
  "Subject-To":"#7c3aed","Loan Takeover":"#0284c7",
  "Fix & Flip":"#ea580c","Wholesale":"#0d9488","BRRRR":"#db2777",
};

const TEAM = [
  {id:1,name:"Julian",role:"Partner / Lead",avatar:"J",color:"linear-gradient(135deg,#5b21b6,#38bdf8)"},
  {id:2,name:"Alex",  role:"Analyst",       avatar:"A",color:"linear-gradient(135deg,#c8232c,#f472b6)"},
];

// ── BASE DEALS — always present, live scraped deals prepend on top ─────────────
const DEALS = [
  {id:1, added:"Today",    address:"3317 Magnolia Blvd",   city:"Memphis",       state:"TN",strategy:"Subject-To",   status:"New Lead",       arv:229000,offer:108000,repair:0,    fee:13000,days:0, seller:"Denise R.", phone:"(901)555-0174",motivated:true, loanBal:96000, rate:"3.1%",pmt:411,  source:"Tax Delinquent",assignee:1,notes:"3 months behind. Inherited from mother. Wants fast close, no hassle.",tags:["Inherited","Pre-foreclosure","Urgent"],motivationSignals:["behind on payments","inherited"],daysOnMarket:0},
  {id:2, added:"Today",    address:"804 Creekside Dr",     city:"Tulsa",         state:"OK",strategy:"Fix & Flip",   status:"New Lead",       arv:298000,offer:159000,repair:46000,fee:11000,days:0, seller:"Gary M.",   phone:"(918)555-0382",motivated:false,loanBal:0,     rate:"—",  pmt:0,    source:"Redfin",       assignee:2,notes:"Vacant 14 months. Full interior needed. ARV conservative.",tags:["Vacant","Rehab","Upside"],motivationSignals:["vacant","as-is"],daysOnMarket:87},
  {id:3, added:"Today",    address:"512 Wren St",          city:"Albuquerque",   state:"NM",strategy:"Wholesale",    status:"New Lead",       arv:241000,offer:117000,repair:0,    fee:16000,days:0, seller:"Luis P.",   phone:"(505)555-0629",motivated:true, loanBal:0,     rate:"—",  pmt:0,    source:"Facebook",     assignee:2,notes:"Landlord done with tenants. 2/1 SFR. All cash preferred.",tags:["Off-Market","Motivated","Cash"],motivationSignals:["motivated seller","cash only"],daysOnMarket:0},
  {id:4, added:"Today",    address:"1901 Amber Ridge Ct",  city:"Louisville",    state:"KY",strategy:"BRRRR",        status:"New Lead",       arv:312000,offer:141000,repair:52000,fee:12000,days:0, seller:"Tanya B.",  phone:"(502)555-0817",motivated:true, loanBal:0,     rate:"—",  pmt:0,    source:"Zillow",       assignee:1,notes:"Divorce sale. Moving in 30 days. Needs full gut. BRRRR candidate.",tags:["Divorce","Motivated","Gut Rehab"],motivationSignals:["divorce","must sell"],daysOnMarket:12},
  {id:5, added:"Today",    address:"228 Stillwater Ave",   city:"Oklahoma City", state:"OK",strategy:"Loan Takeover",status:"Lead",           arv:277000,offer:138000,repair:0,    fee:14000,days:1, seller:"Frank D.",  phone:"(405)555-0451",motivated:true, loanBal:124000,rate:"2.875%",pmt:515,source:"Tax Delinquent",assignee:1,notes:"Behind 1 payment. Rate is exceptional. Seller open to cash-at-close.",tags:["Sub2 Candidate","Low Rate","Urgent"],motivationSignals:["behind on payments","low rate"],daysOnMarket:0},
  {id:6, added:"Yesterday",address:"7740 Pintail Ln",      city:"Raleigh",       state:"NC",strategy:"Fix & Flip",   status:"Analyzing",      arv:385000,offer:209000,repair:58000,fee:14000,days:1, seller:"Sheila K.", phone:"(919)555-0238",motivated:false,loanBal:0,     rate:"—",  pmt:0,    source:"Redfin",       assignee:2,notes:"High-appreciation corridor. Comparable sold $402K last month.",tags:["Hot Market","High ROI","Cosmetic+"],motivationSignals:["price reduced"],daysOnMarket:54},
  {id:7, added:"Yesterday",address:"4025 Harrow Gate Rd",  city:"Birmingham",    state:"AL",strategy:"Subject-To",   status:"Analyzing",      arv:198000,offer:89000, repair:0,    fee:10000,days:2, seller:"Marcus T.", phone:"(205)555-0763",motivated:true, loanBal:78000, rate:"3.4%",pmt:346,  source:"Facebook",     assignee:1,notes:"Job loss. 2 months behind. FHA loan, current servicer cooperative.",tags:["Pre-foreclosure","FHA","Motivated"],motivationSignals:["job loss","behind on payments"],daysOnMarket:0},
  {id:8, added:"Yesterday",address:"6102 Pelican Bay Dr",  city:"Jacksonville",  state:"FL",strategy:"Wholesale",    status:"Analyzing",      arv:319000,offer:162000,repair:0,    fee:19000,days:2, seller:"Cynthia W.",phone:"(904)555-0344",motivated:true, loanBal:0,     rate:"—",  pmt:0,    source:"Homes.com",    assignee:2,notes:"Estate sale. 3 heirs, all motivated. Clean title. Quick close target.",tags:["Probate","Estate","Multi-Heir"],motivationSignals:["estate sale","probate"],daysOnMarket:21},
  {id:9, added:"Apr 20",   address:"339 Elmwood Ter",      city:"Richmond",      state:"VA",strategy:"BRRRR",        status:"Under Contract", arv:347000,offer:172000,repair:49000,fee:13000,days:4, seller:"Harold N.", phone:"(804)555-0592",motivated:false,loanBal:0,     rate:"—",  pmt:0,    source:"Zillow",       assignee:1,notes:"Under contract. Refinance lined up at 75% LTV. Strong rental market.",tags:["BRRRR Play","Refi Ready","Cash Flow"],motivationSignals:[],daysOnMarket:0},
  {id:10,added:"Apr 20",   address:"1485 Dovetail Pkwy",   city:"Baton Rouge",   state:"LA",strategy:"Subject-To",   status:"Under Contract", arv:261000,offer:123000,repair:0,    fee:14000,days:3, seller:"Yvette C.", phone:"(225)555-0681",motivated:true, loanBal:109000,rate:"3.0%",pmt:459,  source:"Tax Delinquent",assignee:2,notes:"Pending close. End buyer confirmed. Spread locked at $138K.",tags:["Close Pending","Sub2","Assigned"],motivationSignals:["behind on payments"],daysOnMarket:0},
  {id:11,added:"Apr 19",   address:"2801 Ironwood Cir",    city:"Tucson",        state:"AZ",strategy:"Fix & Flip",   status:"Closed",         arv:334000,offer:177000,repair:51000,fee:12000,days:14,seller:"Dale R.",   phone:"(520)555-0127",motivated:false,loanBal:0,     rate:"—",  pmt:0,    source:"Redfin",       assignee:1,notes:"CLOSED. Sold $341K. Net profit after all costs: $87K. Clean deal.",tags:["Closed","Profitable"],motivationSignals:[],daysOnMarket:0},
  {id:12,added:"Apr 18",   address:"908 Foxgrove Ln",      city:"Kansas City",   state:"MO",strategy:"Loan Takeover",status:"Closed",         arv:289000,offer:144000,repair:0,    fee:15000,days:18,seller:"Brenda S.", phone:"(816)555-0349",motivated:true, loanBal:129000,rate:"2.75%",pmt:526,  source:"Facebook",     assignee:2,notes:"CLOSED. Assigned with $145K equity. End buyer paying $1,500/mo positive cash flow.",tags:["Closed","Cash Flow","Sub2"],motivationSignals:[],daysOnMarket:0},
  {id:13,added:"Today",    address:"2214 Meridian St",     city:"Indianapolis",  state:"IN",strategy:"Subject-To",   status:"New Lead",       arv:248000,offer:118000,repair:0,    fee:14000,days:0, seller:"Derek T.",  phone:"(317)555-0284",motivated:true, loanBal:104000,rate:"3.25%",pmt:452,  source:"Tax Delinquent",assignee:1,notes:"3 months behind on payments. Owner relocating out of state. Sub2 setup ideal — great rate to assume.",tags:["Sub2","Relocation","Urgent"],motivationSignals:["behind on payments","relocating"],daysOnMarket:0},
];

const SOURCES_STATS = [
  {name:"Tax Delinquent",leads:24,closed:6,bestSpread:195000},
  {name:"Facebook",      leads:16,closed:4,bestSpread:174000},
  {name:"Redfin",        leads:18,closed:3,bestSpread:162000},
  {name:"Zillow",        leads:21,closed:3,bestSpread:181000},
  {name:"Homes.com",     leads:11,closed:2,bestSpread:157000},
  {name:"Crexi",         leads:8, closed:1,bestSpread:195000},
];

const BASE_MARKETS = [
  {name:"Raleigh NC",       deals:1,spread:176000,trend:"+19%",hot:true},
  {name:"Jacksonville FL",  deals:1,spread:157000,trend:"+13%",hot:true},
  {name:"Louisville KY",    deals:1,spread:171000,trend:"+11%",hot:true},
  {name:"Oklahoma City OK", deals:2,spread:152000,trend:"+9%", hot:true},
  {name:"Richmond VA",      deals:1,spread:175000,trend:"+10%",hot:true},
  {name:"Memphis TN",       deals:1,spread:121000,trend:"+6%", hot:false},
  {name:"Baton Rouge LA",   deals:1,spread:138000,trend:"+4%", hot:false},
  {name:"Indianapolis IN",  deals:1,spread:168000,trend:"+14%",hot:true},
  {name:"Tucson AZ",        deals:1,spread:157000,trend:"+2%", hot:false},
];

const ALL_MARKETS_LIST = ["Indianapolis IN","Memphis TN","Tulsa OK","Oklahoma City OK","Louisville KY","Raleigh NC","Birmingham AL","Jacksonville FL","Richmond VA","Baton Rouge LA","Tucson AZ","Kansas City MO","Albuquerque NM"];

const fmt  = n => `$${(n/1000).toFixed(0)}K`;
const fmtF = n => `$${Number(n).toLocaleString()}`;

const API   = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const post  = body => fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});

// ── LIVE SCRAPER HOOK ─────────────────────────────────────────────────────────
function useScraper() {
  const [liveDeals, setLiveDeals]         = useState([]);
  const [sourceStatus, setSourceStatus]   = useState({});
  const [scraping, setScraping]           = useState(false);
  const [lastFetch, setLastFetch]         = useState(null);
  const [partnerUpdate, setPartnerUpdate] = useState("");
  const [liveMarkets, setLiveMarkets]     = useState([]);
  const idRef = useRef(100);

  const scrapeSource = useCallback(async (sourceName) => {
    setSourceStatus(s => ({...s,[sourceName]:"scraping"}));
    const mktMap = {
      "Zillow":        ALL_MARKETS_LIST.slice(0,4),
      "Redfin":        ALL_MARKETS_LIST.slice(4,8),
      "Tax Delinquent":ALL_MARKETS_LIST.slice(0,6),
      "Homes.com":     ALL_MARKETS_LIST.slice(8,12),
      "Facebook":      ALL_MARKETS_LIST.slice(2,6),
      "Crexi":         ALL_MARKETS_LIST.slice(6,10),
    };
    const mkts = mktMap[sourceName] || ALL_MARKETS_LIST.slice(0,4);
    const queryMap = {
      "Zillow":        `site:zillow.com (price reduced OR "as-is" OR fixer OR estate OR foreclosure) ${mkts.join(" OR ")} 2025`,
      "Redfin":        `site:redfin.com (price reduced OR fixer OR motivated seller) ${mkts.join(" OR ")} 2025`,
      "Tax Delinquent":`tax delinquent property sale auction ${mkts.join(" OR ")} 2025`,
      "Homes.com":     `site:homes.com (estate sale OR probate OR motivated OR "price reduced") ${mkts.join(" OR ")} 2025`,
      "Facebook":      `facebook marketplace real estate FSBO "must sell" motivated seller cash ${mkts.join(" OR ")} 2025`,
      "Crexi":         `site:crexi.com (motivated OR "price reduced" OR landlord OR "value-add") ${mkts.join(" OR ")} 2025`,
    };
    try {
      const r1 = await post({
        model:MODEL, max_tokens:2000,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:`Search: ${queryMap[sourceName]}\n\nReturn a detailed summary of the real listings found — include addresses, prices, days on market, and any motivated seller signals.`}]
      });
      const d1 = await r1.json();
      const raw = (d1.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n").slice(0,3500);
      if (!raw||raw.length<80) { setSourceStatus(s=>({...s,[sourceName]:"no results"})); return []; }

      const r2 = await post({
        model:MODEL, max_tokens:1500,
        messages:[{role:"user",content:`Extract up to 4 motivated seller leads from this scraped data. Source: ${sourceName}.\n\nDATA:\n${raw}\n\nReturn ONLY a JSON array (no markdown):\n[{"address":"123 Main St","city":"Memphis","state":"TN","arv":185000,"offer":120000,"daysOnMarket":67,"strategy":"Fix & Flip","motivated":true,"motivationSignals":["price reduced","as-is"],"notes":"brief description","tags":["Fixer","Motivated"],"url":"https://...","seller":"Name or unknown","phone":"—"}]\n\nStrategy: delinquent/behind → Subject-To; assumable loan → Loan Takeover; repairs>15% ARV → Fix & Flip or BRRRR; clean/quick → Wholesale.\nReturn [] if no real listings found.`}]
      });
      const d2 = await r2.json();
      const txt = (d2.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
      const s = txt.indexOf("["), e = txt.lastIndexOf("]");
      if (s===-1||e===-1) { setSourceStatus(ss=>({...ss,[sourceName]:"parse error"})); return []; }
      const parsed = JSON.parse(txt.slice(s,e+1));
      const leads = parsed.filter(l=>l.address&&l.city).map(l=>({
        id: idRef.current++,
        added:"Today", days:0, status:"New Lead",
        source: sourceName,
        seller: l.seller||"Live Lead",
        phone:  l.phone||"—",
        loanBal: ["Subject-To","Loan Takeover"].includes(l.strategy) ? Math.round((l.arv||200000)*.45) : 0,
        rate:    l.strategy==="Subject-To" ? "~3.5%" : "—",
        pmt:     l.strategy==="Subject-To" ? Math.round(((l.arv||200000)*.45*.04)/12) : 0,
        repair:  ["Fix & Flip","BRRRR"].includes(l.strategy) ? Math.round((l.arv||200000)*.17) : 0,
        fee: 12000,
        assignee: (idRef.current%2)+1,
        arv:   l.arv   || Math.round((l.offer||150000)*1.3),
        offer: l.offer || Math.round((l.arv||200000)*.65),
        isLive: true,
        ...l,
      }));
      setSourceStatus(ss=>({...ss,[sourceName]:`${leads.length} leads`}));
      return leads;
    } catch(err) {
      console.warn(`Scrape error ${sourceName}:`,err);
      setSourceStatus(ss=>({...ss,[sourceName]:"error"}));
      return [];
    }
  },[]);

  const fetchPartnerUpdate = useCallback(async (allLive) => {
    if (!allLive.length) return;
    try {
      const top = allLive.sort((a,b)=>(b.arv-b.offer)-(a.arv-a.offer)).slice(0,5)
        .map(d=>`${d.address}, ${d.city} ${d.state} — ${d.strategy}, spread ${fmtF(d.arv-d.offer)}, motivated: ${d.motivated}`).join("\n");
      const r = await post({model:MODEL,max_tokens:260,messages:[{role:"user",content:`You are a real estate wholesaling partner. Write a 2-3 sentence morning briefing for Julian and Alex about today's freshly scraped live leads. Name addresses and spreads. Direct and actionable. Plain text only.\n\nTop live leads:\n${top}`}]});
      const d = await r.json();
      setPartnerUpdate((d.content||[]).map(b=>b.text||"").join("").trim());
    } catch(e){ console.warn("Partner update error",e); }
  },[]);

  const fetchMarkets = useCallback(async () => {
    try {
      const r = await post({
        model:MODEL, max_tokens:900,
        tools:[{type:"web_search_20250305",name:"web_search"}],
        messages:[{role:"user",content:`Search for current real estate market trends in: ${ALL_MARKETS_LIST.join(", ")}. Return ONLY a JSON array (no markdown):\n[{"name":"Raleigh NC","trend":"+19%","hot":true,"spread":176000,"deals":1,"note":"brief insight"}]`}]
      });
      const d = await r.json();
      const txt = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
      const s=txt.indexOf("["),e=txt.lastIndexOf("]");
      if(s!==-1&&e!==-1){ const p=JSON.parse(txt.slice(s,e+1)); if(p.length) setLiveMarkets(p); }
    } catch(e){ console.warn("Markets error",e); }
  },[]);

  const runScrape = useCallback(async () => {
    if (scraping) return;
    setScraping(true); setLiveDeals([]); setSourceStatus({}); setPartnerUpdate("");
    const sources = Object.keys(SOURCE_CFG);
    const all = [];
    for (let i=0;i<sources.length;i+=2) {
      const results = await Promise.all(sources.slice(i,i+2).map(s=>scrapeSource(s)));
      results.forEach(r=>all.push(...r));
      setLiveDeals([...all]);
    }
    await Promise.all([fetchPartnerUpdate(all), fetchMarkets()]);
    const now = new Date();
    setLastFetch(`${now.toLocaleDateString("en-US",{month:"short",day:"numeric"})} ${now.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}`);
    setScraping(false);
  },[scraping,scrapeSource,fetchPartnerUpdate,fetchMarkets]);

  useEffect(()=>{ runScrape(); },[]);

  return {liveDeals,sourceStatus,scraping,lastFetch,partnerUpdate,liveMarkets,refetch:runScrape};
}

// ── AI PANEL ──────────────────────────────────────────────────────────────────
function AIPanel({deal}){
  const C=useC();
  const [text,setText]=useState("");
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const ran=useRef(false);
  const spread=(deal.arv||0)-(deal.offer||0);

  const analyze=useCallback(async()=>{
    if(busy)return;
    setBusy(true);setText("");setDone(false);
    const prompt=`You are a sharp real estate wholesaling advisor. Analyze this deal concisely.

DEAL: ${deal.address}, ${deal.city} ${deal.state}
Strategy: ${deal.strategy} | Source: ${deal.source}
ARV: ${fmtF(deal.arv||0)} | Offer: ${fmtF(deal.offer||0)} | Spread: ${fmtF(spread)} (${deal.arv?Math.round(spread/deal.arv*100):0}% of ARV)
${deal.strategy==="Fix & Flip"||deal.strategy==="BRRRR"?`Repairs: ${fmtF(deal.repair||0)} | Fee: ${fmtF(deal.fee||0)} | MAO: ${fmtF(Math.round((deal.arv||0)*.70-(deal.repair||0)-(deal.fee||0)))}`:`Loan Bal: ${fmtF(deal.loanBal||0)} | Rate: ${deal.rate||"—"} | Pmt: $${deal.pmt||0}/mo`}
Motivated: ${deal.motivated?"Yes":"No"} | Tags: ${(deal.tags||[]).join(", ")}
Notes: ${deal.notes||"None"}

Plain text only, no markdown symbols. Format exactly:

SCORE: [X/10]
VERDICT: [one punchy sentence]

STRENGTHS:
• [point]
• [point]

RISKS:
• [point]
• [point]

NEXT MOVE:
[1-2 sentence action step]

EXIT:
[Best monetization path]`;
    try{
      const res=await post({model:MODEL,max_tokens:900,messages:[{role:"user",content:prompt}]});
      const data=await res.json();
      const full=data.content?.map(b=>b.text||"").join("")||"Unavailable.";
      let i=0;const words=full.split(" ");
      const iv=setInterval(()=>{if(i<words.length){setText(p=>p+(i===0?"":" ")+words[i]);i++;}else{clearInterval(iv);setDone(true);}},14);
    }catch{setText("AI unavailable.");setDone(true);}
    setBusy(false);
  },[deal.id,busy]);

  useEffect(()=>{if(!ran.current){ran.current=true;analyze();}},[deal.id]);
  const score=text.match(/SCORE:\s*(\d+)\/10/)?.[1];
  const sc=score?parseInt(score):null;
  const scColor=sc>=8?C.green:sc>=6?C.amber:C.red;

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:busy?C.amber:C.accentL,animation:busy?"aiPulse 1s infinite":"none"}}/>
          <span style={{fontSize:11,color:C.accentL,textTransform:"uppercase",letterSpacing:"0.1em"}}>AI Analysis</span>
        </div>
        <button onClick={analyze} disabled={busy} style={{background:"rgba(109,40,217,.15)",border:"1px solid rgba(109,40,217,.35)",color:C.accentL,padding:"4px 11px",borderRadius:6,fontSize:10,cursor:"pointer",fontFamily:"inherit",opacity:busy?.5:1}}>↻ Re-run</button>
      </div>
      {sc&&(
        <div style={{margin:"12px 14px 0",padding:"10px 14px",background:`rgba(${sc>=8?"5,150,105":sc>=6?"217,119,6":"220,38,38"},.08)`,border:`1px solid rgba(${sc>=8?"5,150,105":sc>=6?"217,119,6":"220,38,38"},.25)`,borderRadius:10,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:38,fontWeight:800,color:scColor,lineHeight:1}}>{sc}<span style={{fontSize:13,color:C.text3}}>/10</span></div>
          <div style={{fontSize:11,color:C.text1}}>{sc>=8?"Strong — move fast.":sc>=6?"Solid — push harder.":"Thin margins — careful."}</div>
        </div>
      )}
      <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
        {busy&&!text&&(<div style={{display:"flex",gap:6,alignItems:"center",color:C.text3,padding:"8px 0"}}>{[0,.15,.3].map(d=>(<div key={d} style={{width:6,height:6,borderRadius:"50%",background:C.accentL,animation:`aiPulse 1s ${d}s infinite`}}/>))}<span style={{marginLeft:6,fontSize:12}}>Analyzing…</span></div>)}
        <pre style={{fontFamily:"inherit",fontSize:12,lineHeight:1.85,color:C.text1,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{text}{!done&&text&&<span style={{color:C.accentL,animation:"aiPulse .8s infinite"}}>▌</span>}</pre>
      </div>
    </div>
  );
}

// ── DETAIL PANEL ──────────────────────────────────────────────────────────────
function DetailPanel({deal,onClose}){
  const C=useC();
  const [tab,setTab]=useState("overview");
  const spread=(deal.arv||0)-(deal.offer||0);
  const src=SOURCE_CFG[deal.source]||SOURCE_CFG["Zillow"];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",background:C.bg1}}>
      <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:C.text0,lineHeight:1.2}}>{deal.address}</div>
            <div style={{fontSize:11,color:C.text2,marginTop:3}}>
              {deal.city}, {deal.state} · Added {deal.added}
              {deal.isLive&&<span style={{marginLeft:6,color:C.green,fontSize:9}}>● Live</span>}
            </div>
          </div>
          <button onClick={onClose} style={{background:C.bg3,border:`1px solid ${C.border}`,color:C.text2,width:26,height:26,borderRadius:6,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
          <span style={{padding:"3px 9px",borderRadius:999,fontSize:9,fontWeight:600,background:STATUS_CFG[deal.status]?.bg,color:STATUS_CFG[deal.status]?.txt,border:`1px solid ${STATUS_CFG[deal.status]?.bd}`}}>{deal.status}</span>
          <span style={{padding:"3px 9px",borderRadius:999,fontSize:9,color:STRAT_COLOR[deal.strategy]||C.text2,background:C.bg3,border:`1px solid ${C.border}`}}>{deal.strategy}</span>
          <span style={{padding:"3px 9px",borderRadius:999,fontSize:9,color:src.color,background:src.bg,border:`1px solid ${src.bd}`}}>{src.icon} {deal.source}</span>
          {deal.motivated&&<span style={{padding:"3px 9px",borderRadius:999,fontSize:9,color:C.amber,background:"rgba(217,119,6,.1)",border:"1px solid rgba(217,119,6,.3)"}}>🔥 Hot</span>}
          {deal.daysOnMarket>0&&<span style={{padding:"3px 9px",borderRadius:999,fontSize:9,color:C.text2,background:C.bg3,border:`1px solid ${C.border}`}}>{deal.daysOnMarket}d on market</span>}
        </div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {[...(deal.tags||[]),...(deal.motivationSignals||[])].filter((v,i,a)=>a.indexOf(v)===i).map(t=>(
            <span key={t} style={{padding:"2px 8px",borderRadius:4,fontSize:9,color:C.text2,background:C.bg3,border:`1px solid ${C.border}`}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0,background:C.bg1}}>
        {["overview","numbers","team","ai"].map(t=>(
          <div key={t} onClick={()=>setTab(t)} style={{flex:1,textAlign:"center",padding:"9px 0",fontSize:10,textTransform:"capitalize",cursor:"pointer",borderBottom:tab===t?`2px solid ${C.accentL}`:"2px solid transparent",color:tab===t?C.accentL:C.text2,transition:"color .15s",background:"transparent"}}>
            {t==="ai"?"✦ AI":t}
          </div>
        ))}
      </div>
      <div style={{flex:1,overflowY:"auto",background:C.bg1}}>
        {tab==="overview"&&(
          <div style={{padding:"14px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[["ARV",fmtF(deal.arv||0),C.text1],["Offer",fmtF(deal.offer||0),C.text1],["Spread",fmtF(spread),C.green],
                deal.strategy==="Fix & Flip"||deal.strategy==="BRRRR"?["Repairs",fmtF(deal.repair||0),C.orange]:["Loan Bal",fmtF(deal.loanBal||0),C.blue]
              ].map(([l,v,c])=>(
                <div key={l} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px"}}>
                  <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:3}}>{l}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:c}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
              <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Seller Notes</div>
              <div style={{fontSize:12,color:C.text1,lineHeight:1.7}}>{deal.notes||"No notes available."}</div>
            </div>
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:deal.url&&!deal.url.includes("...")?10:0}}>
              <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Contact</div>
              <div style={{fontSize:13,color:C.text0,fontWeight:500}}>{deal.seller||"Unknown"}</div>
              <div style={{fontSize:12,color:C.text2,marginTop:3}}>{deal.phone||"—"}</div>
            </div>
            {deal.url&&!deal.url.includes("...")&&(
              <a href={deal.url} target="_blank" rel="noreferrer" style={{display:"block",padding:"10px 14px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,fontSize:11,color:C.accentL,textDecoration:"none"}}>
                ↗ View Original Listing on {deal.source}
              </a>
            )}
          </div>
        )}
        {tab==="numbers"&&(
          <div style={{padding:"14px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,marginBottom:10,color:C.text0}}>Deal Economics</div>
            {(deal.strategy==="Fix & Flip"||deal.strategy==="BRRRR"
              ?[["ARV",deal.arv||0,C.text1],["- Repairs",-(deal.repair||0),C.orange],["- Fee",-(deal.fee||0),C.text2],["- Sell Costs (8%)",-Math.round((deal.arv||0)*.08),C.text2],["= Profit",(deal.arv||0)-(deal.offer||0)-(deal.repair||0)-(deal.fee||0)-Math.round((deal.arv||0)*.08),C.green]]
              :[["ARV",deal.arv||0,C.text1],["- Offer",-(deal.offer||0),C.text2],["= Equity",spread,C.green],["Loan Bal",deal.loanBal||0,C.blue],["Mo. Pmt",deal.pmt||0,C.blue]]
            ).map(([l,v,c],i,arr)=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:i===arr.length-1?"rgba(5,150,105,.06)":"transparent",borderRadius:i===arr.length-1?8:0,borderTop:i>0?`1px solid ${C.border}`:"none"}}>
                <span style={{fontSize:12,color:C.text2}}>{l}</span>
                <span style={{fontSize:13,fontWeight:i===arr.length-1?700:400,color:c}}>{l.includes("Pmt")?"$"+v:fmtF(Math.abs(v))}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:"12px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10}}>
              <div style={{fontSize:9,color:C.text3,marginBottom:5}}>MAO (70% Rule)</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:C.accentL}}>{fmtF(Math.round((deal.arv||0)*.70-(deal.repair||0)-(deal.fee||0)))}</div>
            </div>
          </div>
        )}
        {tab==="team"&&(
          <div style={{padding:"14px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,marginBottom:12,color:C.text0}}>Team Assignment</div>
            {TEAM.map(m=>(
              <div key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:m.id===deal.assignee?"rgba(109,40,217,.1)":C.bg2,border:`1px solid ${m.id===deal.assignee?"rgba(109,40,217,.35)":C.border}`,borderRadius:10,marginBottom:8}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,color:C.text0,fontWeight:500}}>{m.name}</div>
                  <div style={{fontSize:11,color:C.text2,marginTop:2}}>{m.role}</div>
                </div>
                {m.id===deal.assignee&&<span style={{fontSize:9,color:C.accentL,background:"rgba(109,40,217,.12)",padding:"3px 8px",borderRadius:999,border:"1px solid rgba(109,40,217,.3)"}}>Assigned</span>}
              </div>
            ))}
            <div style={{marginTop:14,padding:"12px 14px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10}}>
              <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Source</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:8,background:src.bg,border:`1px solid ${src.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:src.color}}>{src.icon}</div>
                <div>
                  <div style={{fontSize:13,color:C.text0}}>{deal.source}</div>
                  <div style={{fontSize:10,color:C.text2}}>Pulled {deal.added}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {tab==="ai"&&<AIPanel deal={deal}/>}
      </div>
    </div>
  );
}

// ── SOURCE INTELLIGENCE ───────────────────────────────────────────────────────
function SourcesView({liveDeals,sourceStatus,scraping}){
  const C=useC();
  return(
    <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:C.text0,marginBottom:4}}>Source Intelligence</div>
      <div style={{fontSize:12,color:C.text2,marginBottom:24}}>Performance across all 6 lead sources — live scraped daily.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
        {SOURCES_STATS.map(s=>{
          const src=SOURCE_CFG[s.name];
          const conv=((s.closed/s.leads)*100).toFixed(0);
          const st=sourceStatus[s.name]||"";
          const liveCount=liveDeals.filter(d=>d.source===s.name).length;
          return(
            <div key={s.name} style={{background:C.bg2,border:`1px solid ${st==="scraping"?src.bd:C.border}`,borderRadius:14,padding:20,position:"relative",overflow:"hidden",transition:"border .3s"}}>
              <div style={{position:"absolute",top:-10,right:-10,width:70,height:70,borderRadius:"50%",background:src.bg,opacity:.5}}/>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <div style={{width:34,height:34,borderRadius:9,background:src.bg,border:`1px solid ${src.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:src.color}}>{src.icon}</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:C.text0}}>{s.name}</div>
                  {st==="scraping"&&<div style={{fontSize:9,color:C.amber,marginTop:2}}>⟳ Scraping live…</div>}
                  {liveCount>0&&<div style={{fontSize:9,color:C.green,marginTop:2}}>● {liveCount} live today</div>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                {[["Leads",s.leads,C.text0],["Closed",s.closed,C.green],["Conv.",conv+"%",src.color]].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:700,color:c}}>{v}</div>
                    <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div>
                  </div>
                ))}
              </div>
              {st==="scraping"&&<div style={{height:3,background:C.bg3,borderRadius:2,overflow:"hidden",marginBottom:6}}><div style={{height:"100%",width:"60%",background:src.color,borderRadius:2,animation:"scrapeBar 1.5s infinite"}}/></div>}
              <div style={{height:3,background:C.bg3,borderRadius:2}}>
                <div style={{width:`${Math.min(100,(s.bestSpread/210000)*100)}%`,height:"100%",background:src.color,borderRadius:2,opacity:.8}}/>
              </div>
              <div style={{fontSize:10,color:C.text3,marginTop:4}}>Best spread: {fmt(s.bestSpread)}</div>
            </div>
          );
        })}
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:C.text0,marginBottom:14}}>Partner Notes — Source Strategy</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[
            {src:"Tax Delinquent",note:"Top close rate at 25%. Memphis and Baton Rouge lists are freshest. Pull weekly.",icon:"🏆"},
            {src:"Facebook",      note:"Highest motivation score. Respond within 1hr. Best for Wholesale & Sub2.",icon:"⚡"},
            {src:"Zillow",        note:"Volume leader. Filter 60+ days on market and price drops. Set daily alerts.",icon:"🔔"},
            {src:"Redfin",        note:"Best for flip comps. Cross-ref ARV here. Raleigh corridor is performing well.",icon:"🔍"},
            {src:"Homes.com",     note:"Low competition source. FL and VA markets showing strong estate leads.",icon:"🌱"},
            {src:"Crexi",         note:"Multi-unit plays only. Landlord fatigue is real — response time is key.",icon:"📈"},
          ].map(n=>(
            <div key={n.src} style={{display:"flex",gap:10,padding:"10px 12px",background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8}}>
              <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:SOURCE_CFG[n.src].color,marginBottom:3}}>{n.src}</div>
                <div style={{fontSize:11,color:C.text1,lineHeight:1.6}}>{n.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TEAM VIEW ─────────────────────────────────────────────────────────────────
function TeamView({deals}){
  const C=useC();
  return(
    <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:C.text0,marginBottom:4}}>Our Team</div>
      <div style={{fontSize:12,color:C.text2,marginBottom:24}}>Deal ownership and workload at a glance.</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
        {TEAM.map(m=>{
          const myDeals=deals.filter(d=>d.assignee===m.id);
          const spread=myDeals.reduce((s,d)=>s+(d.arv-d.offer),0);
          const hot=myDeals.filter(d=>d.motivated).length;
          return(
            <div key={m.id} style={{background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:14,padding:22}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
                <div style={{width:50,height:50,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,color:"#fff",flexShrink:0}}>{m.avatar}</div>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,color:C.text0}}>{m.name}</div>
                  <div style={{fontSize:11,color:C.text2,marginTop:2}}>{m.role}</div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                {[["Deals",myDeals.length,C.accentL],["Pipeline",fmt(spread),C.green],["Hot",hot,C.amber]].map(([l,v,c])=>(
                  <div key={l} style={{background:C.bg3,borderRadius:8,padding:"10px 8px",textAlign:"center"}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:c}}>{v}</div>
                    <div style={{fontSize:9,color:C.text3,marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
              <div>
                {myDeals.slice(0,3).map(d=>(
                  <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderTop:`1px solid ${C.border}`}}>
                    <div>
                      <div style={{fontSize:11,color:C.text0}}>{d.address.split(" ").slice(0,3).join(" ")}</div>
                      <div style={{fontSize:9,color:C.text2}}>{d.strategy}</div>
                    </div>
                    <div style={{fontSize:12,color:C.green,fontWeight:600}}>{fmt(d.arv-d.offer)}</div>
                  </div>
                ))}
                {myDeals.length>3&&<div style={{fontSize:10,color:C.text3,paddingTop:6}}>+{myDeals.length-3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:C.text0,marginBottom:12}}>Today's Partner Update ✦</div>
        <div style={{fontSize:12,color:C.text1,lineHeight:1.85}}>
          <strong style={{color:C.accentL}}>Julian</strong> — 4 fresh leads this morning. Top priority: <strong style={{color:C.amber}}>228 Stillwater Ave (OKC)</strong> — 2.875% locked rate, seller behind 1 payment, very negotiable. Also review Louisville BRRRR before noon — divorce timeline is tight.<br/><br/>
          <strong style={{color:"#db2777"}}>Alex</strong> — Tulsa flip and Albuquerque wholesale are queued for you. Pull comps on Tulsa before contact — ARV may have upside. Jacksonville estate play looks clean, push for a Thursday walkthrough.<br/><br/>
          <strong style={{color:C.green}}>Overall:</strong> Pipeline sits at $1.87M in potential equity across 12 deals. Two closings confirmed in Richmond and Baton Rouge. Tax Delinquent continues to outperform — pull fresh lists for Memphis and Tulsa this week.
        </div>
      </div>
    </div>
  );
}

// ── DEAL ROW ─────────────────────────────────────────────────────────────────
function DealRow({deal,active,onClick}){
  const C=useC();
  const [hov,setHov]=useState(false);
  const spread=(deal.arv||0)-(deal.offer||0);
  const src=SOURCE_CFG[deal.source]||SOURCE_CFG["Zillow"];
  return(
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{padding:"10px 12px",cursor:"pointer",transition:"background .1s",background:active?"rgba(109,40,217,.12)":hov?"rgba(0,0,0,.04)":"transparent",borderLeft:active?`2px solid ${C.accentL}`:"2px solid transparent"}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,fontWeight:500,color:deal.added==="Today"?C.text0:C.text1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
            {deal.added==="Today"&&<span style={{display:"inline-block",width:5,height:5,borderRadius:"50%",background:deal.isLive?C.green:C.accentL,marginRight:5,verticalAlign:"middle"}}/>}
            {deal.address}
          </div>
          <div style={{fontSize:9,color:C.text2,marginTop:2}}>
            {deal.city}, {deal.state}
            {deal.isLive&&<span style={{color:C.green,marginLeft:4}}>● live</span>}
          </div>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:C.green,marginLeft:8,flexShrink:0}}>{fmt(spread)}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        <span style={{fontSize:9,color:src.color,background:src.bg,border:`1px solid ${src.bd}`,padding:"1px 6px",borderRadius:999}}>{src.icon}</span>
        <span style={{fontSize:9,color:STRAT_COLOR[deal.strategy]||C.text2,textTransform:"uppercase",letterSpacing:"0.05em"}}>{deal.strategy}</span>
        <span style={{fontSize:8,padding:"1px 6px",borderRadius:999,background:STATUS_CFG[deal.status]?.bg||"rgba(100,116,139,.1)",color:STATUS_CFG[deal.status]?.txt||"#64748b",border:`1px solid ${STATUS_CFG[deal.status]?.bd||"rgba(100,116,139,.25)"}`}}>{deal.status}</span>
        {deal.motivated&&<span style={{fontSize:9,color:C.amber}}>🔥</span>}
        {deal.daysOnMarket>60&&<span style={{fontSize:9,color:C.orange}}>⏱{deal.daysOnMarket}d</span>}
        <span style={{fontSize:9,color:C.text3,marginLeft:"auto"}}>{deal.days===0?"Today":`${deal.days}d`}</span>
      </div>
    </div>
  );
}

// ── OVERVIEW ─────────────────────────────────────────────────────────────────
function Overview({allDeals,liveDeals,markets,scraping,lastFetch,partnerUpdate,onRefresh,onSelect}){
  const C=useC();
  const totalSpread=allDeals.reduce((s,d)=>s+(d.arv-d.offer),0);
  const active=allDeals.filter(d=>d.status!=="Closed");
  const newToday=allDeals.filter(d=>d.added==="Today");
  const contracted=allDeals.filter(d=>d.status==="Under Contract");

  return(
    <div style={{padding:"22px 26px",overflowY:"auto",height:"100%"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:23,fontWeight:800,color:C.text0,letterSpacing:"-0.02em"}}>Morning, Julian 👋</div>
        <div style={{fontSize:12,color:C.text2,marginTop:4}}>
          Your partner (me) has been working overnight.{" "}
          <span style={{color:C.accentL}}>{newToday.length} new deals</span> found across 6 sources.
          {liveDeals.length>0&&<span style={{color:C.green,marginLeft:6}}>+{liveDeals.length} live scraped</span>}
          {lastFetch&&<span style={{color:C.text3,marginLeft:8}}>· {lastFetch}</span>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
        {[
          {l:"Total Equity",v:`$${(totalSpread/1e6).toFixed(2)}M`,sub:`${active.length} active deals`,c:C.green},
          {l:"New Today",   v:newToday.length,                    sub:"across all sources",            c:C.accentL},
          {l:"Contracted",  v:contracted.length,                  sub:"ready to assign",              c:C.amber},
          {l:"Sources Live",v:6,                                  sub:"all feeds active",              c:C.blue},
        ].map(m=>(
          <div key={m.l} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:6}}>{m.l}</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:800,color:m.c,lineHeight:1}}>{m.v}</div>
            <div style={{fontSize:10,color:C.text3,marginTop:5}}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(109,40,217,.08)",border:"1px solid rgba(109,40,217,.25)",borderRadius:12,padding:"14px 18px",marginBottom:18,display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#5b21b6,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontWeight:700,fontSize:12,color:"#fff"}}>✦</div>
        <div style={{fontSize:12,color:C.text1,lineHeight:1.75,flex:1}}>
          <strong style={{color:C.accentL}}>Partner Update — {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}:</strong>{" "}
          {partnerUpdate||"Pulled fresh Tax Delinquent and Facebook lists overnight. 4 new leads with strong motivation signals. Top pick: "}
          {!partnerUpdate&&<><strong style={{color:C.amber}}>228 Stillwater Ave, OKC</strong> — 2.875% locked rate, seller behind 1 payment. Raleigh flip has highest equity potential this week at <strong style={{color:C.green}}>$176K</strong> spread. Move fast on both.</>}
        </div>
        <button onClick={onRefresh} disabled={scraping} style={{background:scraping?"rgba(109,40,217,.05)":"rgba(109,40,217,.15)",border:"1px solid rgba(109,40,217,.35)",color:C.accentL,padding:"5px 12px",borderRadius:7,fontSize:10,cursor:scraping?"default":"pointer",fontFamily:"inherit",flexShrink:0,opacity:scraping?.6:1,whiteSpace:"nowrap"}}>
          {scraping?"Scraping…":"↻ Scrape Now"}
        </button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text0,display:"flex",justifyContent:"space-between"}}>
            <span>Today's New Deals</span>
            <span style={{fontSize:10,color:C.accentL}}>{newToday.length} found{liveDeals.length>0?` · ${liveDeals.length} live`:""}</span>
          </div>
          {newToday.map((d,i,arr)=>{
            const src=SOURCE_CFG[d.source]||SOURCE_CFG["Zillow"];
            return(
              <div key={d.id} onClick={()=>onSelect(d)} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 16px",cursor:"pointer",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{width:28,height:28,borderRadius:7,background:src.bg,border:`1px solid ${src.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:src.color,flexShrink:0}}>{src.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:11,color:C.text0,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {d.address}, {d.city}
                    {d.isLive&&<span style={{marginLeft:5,fontSize:8,color:C.green}}>● LIVE</span>}
                  </div>
                  <div style={{fontSize:9,color:C.text2,marginTop:2}}>{d.strategy} · {d.source}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:12,color:C.green,fontWeight:600}}>{fmt(d.arv-d.offer)}</div>
                  {d.motivated&&<div style={{fontSize:9,color:C.amber}}>🔥 hot</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text0,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>Markets</span>
            {scraping&&<span style={{width:6,height:6,borderRadius:"50%",background:C.amber,display:"inline-block",animation:"aiPulse 1s infinite"}}/>}
          </div>
          <div style={{padding:"8px 0"}}>
            {markets.sort((a,b)=>b.spread-a.spread).slice(0,6).map(m=>(
              <div key={m.name} style={{padding:"6px 16px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:10,color:m.hot?C.text0:C.text1,display:"flex",alignItems:"center",gap:5}}>
                    {m.hot&&<span style={{width:4,height:4,borderRadius:"50%",background:C.accentL,display:"inline-block"}}/>}
                    {m.name}
                  </span>
                  <span style={{fontSize:10,color:m.trend?.startsWith("+")?C.green:C.red,fontWeight:500}}>{m.trend}</span>
                </div>
                <div style={{height:2,background:C.bg3,borderRadius:1}}>
                  <div style={{width:`${Math.min(100,(m.spread/200000)*100)}%`,height:"100%",background:m.hot?"linear-gradient(90deg,#5b21b6,#a78bfa)":"#94a3b8",borderRadius:1}}/>
                </div>
                <div style={{fontSize:9,color:C.text3,marginTop:2}}>{fmt(m.spread)} avg · {m.deals} deals</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAO CALC ─────────────────────────────────────────────────────────────────
function MAOView(){
  const C=useC();
  const [arv,setArv]=useState(310000);
  const [rep,setRep]=useState(48000);
  const [fee,setFee]=useState(13000);
  const [pct,setPct]=useState(70);
  const mao=Math.round(arv*pct/100-rep-fee);
  const prof=arv-mao-rep-fee-Math.round(arv*.08);
  return(
    <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:C.text0,marginBottom:4}}>MAO Calculator</div>
      <div style={{fontSize:12,color:C.text2,marginBottom:24}}>Maximum Allowable Offer — Fix &amp; Flip / BRRRR</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:900}}>
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
          {[{l:"After Repair Value",v:arv,s:setArv,mn:50000,mx:1000000,st:5000,c:C.text0},{l:"Estimated Repairs",v:rep,s:setRep,mn:0,mx:300000,st:1000,c:C.orange},{l:"Assignment Fee",v:fee,s:setFee,mn:0,mx:100000,st:500,c:C.blue}].map(({l,v,s,mn,mx,st,c})=>(
            <div key={l} style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <span style={{fontSize:12,color:C.text2}}>{l}</span>
                <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:c}}>{fmtF(v)}</span>
              </div>
              <input type="range" min={mn} max={mx} step={st} value={v} onChange={e=>s(+e.target.value)} style={{width:"100%"}}/>
            </div>
          ))}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
              <span style={{fontSize:12,color:C.text2}}>Rule %</span>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:C.accentL}}>{pct}%</span>
            </div>
            <input type="range" min={60} max={80} step={1} value={pct} onChange={e=>setPct(+e.target.value)} style={{width:"100%"}}/>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:`linear-gradient(135deg,rgba(91,33,182,.15),${C.bg3})`,border:"1px solid rgba(109,40,217,.35)",borderRadius:14,padding:22,textAlign:"center",flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:10,color:C.accentL,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>Your MAO</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:48,fontWeight:800,color:mao>0?C.accentL:C.red,lineHeight:1}}>{mao>0?fmtF(mao):"—"}</div>
            <div style={{fontSize:10,color:C.text3,marginTop:6}}>{pct}% × ARV − Repairs − Fee</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"rgba(5,150,105,.08)",border:"1px solid rgba(5,150,105,.25)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:C.green,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Flip Profit</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:C.green}}>{fmtF(Math.max(0,prof))}</div>
            </div>
            <div style={{background:"rgba(2,132,199,.08)",border:"1px solid rgba(2,132,199,.25)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:9,color:C.blue,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4}}>Assign Fee</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:700,color:C.blue}}>{fmtF(fee)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CITY COORDINATES (approximate % position on US SVG viewBox 0 0 960 600) ──
const CITY_COORDS = {
  "Indianapolis IN":    {x:530,y:195},
  "Kansas City MO":     {x:362,y:225},
  "Louisville KY":      {x:552,y:230},
  "Richmond VA":        {x:718,y:215},
  "Raleigh NC":         {x:708,y:258},
  "Oklahoma City OK":   {x:310,y:285},
  "Tulsa OK":           {x:338,y:262},
  "Memphis TN":         {x:498,y:314},
  "Birmingham AL":      {x:530,y:358},
  "Baton Rouge LA":     {x:458,y:408},
  "Jacksonville FL":    {x:618,y:416},
  "Albuquerque NM":     {x:148,y:322},
  "Tucson AZ":          {x:124,y:370},
  "Indianapolis":       {x:530,y:195},
  "Kansas City":        {x:362,y:225},
  "Louisville":         {x:552,y:230},
  "Richmond":           {x:718,y:215},
  "Raleigh":            {x:708,y:258},
  "Oklahoma City":      {x:310,y:285},
  "Tulsa":              {x:338,y:262},
  "Memphis":            {x:498,y:314},
  "Birmingham":         {x:530,y:358},
  "Baton Rouge":        {x:458,y:408},
  "Jacksonville":       {x:618,y:416},
  "Albuquerque":        {x:148,y:322},
  "Tucson":             {x:124,y:370},
};

function getDealCoords(deal) {
  const key1 = `${deal.city} ${deal.state}`;
  const key2 = deal.city;
  return CITY_COORDS[key1] || CITY_COORDS[key2] || null;
}

// ── MAP VIEW ──────────────────────────────────────────────────────────────────
function MapView({allDeals, markets, onSelectDeal}) {
  const C = useC();
  const [hovPin, setHovPin] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [filterStrat, setFilterStrat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  const visibleDeals = allDeals.filter(d =>
    (filterStrat==="All"||d.strategy===filterStrat) &&
    (filterStatus==="All"||d.status===filterStatus) &&
    getDealCoords(d)
  );

  // Group deals by city for heat bubble sizing
  const cityGroups = {};
  visibleDeals.forEach(d => {
    const coords = getDealCoords(d);
    if (!coords) return;
    const key = `${d.city} ${d.state}`;
    if (!cityGroups[key]) cityGroups[key] = {coords, deals:[], totalSpread:0};
    cityGroups[key].deals.push(d);
    cityGroups[key].totalSpread += (d.arv-d.offer);
  });

  const maxSpread = Math.max(...Object.values(cityGroups).map(g=>g.totalSpread), 1);

  // Jitter pins within same city so they don't overlap
  function getPinPos(deal, idx, total) {
    const base = getDealCoords(deal);
    if (!base) return null;
    if (total === 1) return base;
    const angle = (idx / total) * 2 * Math.PI;
    const r = 18;
    return {x: base.x + Math.cos(angle)*r, y: base.y + Math.sin(angle)*r};
  }

  const cityPinMap = {};
  visibleDeals.forEach(d => {
    const key = `${d.city} ${d.state}`;
    if (!cityPinMap[key]) cityPinMap[key] = [];
    cityPinMap[key].push(d);
  });

  return (
    <div style={{display:"flex",height:"100%",overflow:"hidden"}}>
      {/* MAP AREA */}
      <div style={{flex:1,position:"relative",background:C.bg0,overflow:"hidden"}}>
        {/* Header */}
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",background:`linear-gradient(to bottom,${C.bg0},transparent)`}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:C.text0}}>Deal Map</div>
            <div style={{fontSize:10,color:C.text2,marginTop:2}}>{visibleDeals.length} deals across {Object.keys(cityGroups).length} markets</div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["All",...Object.keys(STRAT_COLOR)].map(s=>(
              <div key={s} onClick={()=>setFilterStrat(s)}
                style={{padding:"3px 10px",borderRadius:999,fontSize:9,cursor:"pointer",background:filterStrat===s?STRAT_COLOR[s]||"rgba(109,40,217,.8)":"rgba(0,0,0,.25)",color:"#fff",border:`1px solid ${filterStrat===s?STRAT_COLOR[s]||"rgba(109,40,217,.8)":"rgba(255,255,255,.15)"}`,backdropFilter:"blur(8px)",transition:"all .15s"}}>
                {s==="All"?"All Strategies":s}
              </div>
            ))}
          </div>
        </div>

        {/* SVG Regional Map — your 13 working markets */}
        <svg viewBox="60 140 820 350" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines for depth */}
          {[160,200,240,280,320,360,400,440,480].map(y=>(
            <line key={y} x1="60" y1={y} x2="880" y2={y} stroke={C.border} strokeWidth="0.5" opacity="0.4"/>
          ))}
          {[100,160,220,280,340,400,460,520,580,640,700,760,820,880].map(x=>(
            <line key={x} x1={x} y1="140" x2={x} y2="490" stroke={C.border} strokeWidth="0.5" opacity="0.4"/>
          ))}
          {/* State shapes — your working states */}
          {/* NM */ }
          <polygon points="80,260 175,260 182,340 175,410 80,408" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* AZ */}
          <polygon points="80,260 175,260 175,410 116,410 90,380 80,340" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* OK */}
          <polygon points="290,245 490,245 490,260 550,260 550,300 290,300 268,300 268,260" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* TX top strip — partial, for context */}
          <polygon points="268,300 550,300 550,330 460,330 460,370 380,370 300,360 268,340" fill={C.bg3} stroke={C.border} strokeWidth="0.8" opacity="0.4"/>
          {/* KS/MO */}
          <polygon points="290,190 490,190 490,245 290,245" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          <polygon points="490,190 600,192 605,245 490,245" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* AR */}
          <polygon points="460,300 560,300 558,355 458,355" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* TN */}
          <polygon points="460,260 640,252 642,295 458,300" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* IN/KY */}
          <polygon points="490,155 600,155 605,192 490,192" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          <polygon points="490,192 642,192 645,252 490,252" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* MS/AL */}
          <polygon points="458,355 560,355 558,420 456,420" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* LA */}
          <polygon points="390,408 490,408 494,445 430,450 390,438" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* VA/WV/NC */}
          <polygon points="640,192 780,180 790,225 765,238 700,242 645,252" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          <polygon points="700,242 790,225 795,275 730,285 700,278" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* SC/GA */}
          <polygon points="640,275 730,268 735,320 670,340 640,328" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* FL */}
          <polygon points="560,380 670,368 690,400 680,445 640,462 580,458 548,430 548,400" fill={C.bg2} stroke={C.border2} strokeWidth="1" opacity="0.65"/>
          {/* State name labels */}
          {[
            {label:"NM", x:128,y:340},{label:"AZ", x:105,y:350},
            {label:"OK", x:410,y:278},{label:"MO", x:548,y:222},
            {label:"KS", x:388,y:222},{label:"IN", x:545,y:178},
            {label:"KY", x:565,y:230},{label:"TN", x:548,y:282},
            {label:"AR", x:508,y:332},{label:"AL", x:508,y:390},
            {label:"MS", x:476,y:390},{label:"LA", x:438,y:432},
            {label:"VA", x:710,y:215},{label:"NC", x:718,y:268},
            {label:"GA", x:672,y:315},{label:"FL", x:618,y:435},
          ].map(({label,x,y})=>(
            <text key={label} x={x} y={y} textAnchor="middle" fill={C.text3} fontSize="9" fontFamily="DM Mono,monospace" style={{pointerEvents:"none",userSelect:"none"}}>{label}</text>
          ))}

          {/* Heat bubbles per city */}
          {Object.entries(cityGroups).map(([key,g])=>{
            const r = 20 + (g.totalSpread/maxSpread)*40;
            const hot = g.deals.some(d=>d.motivated);
            return (
              <circle key={`heat-${key}`}
                cx={g.coords.x} cy={g.coords.y} r={r}
                fill={hot?"rgba(109,40,217,.12)":"rgba(56,189,248,.06)"}
                stroke={hot?"rgba(109,40,217,.3)":"rgba(56,189,248,.15)"}
                strokeWidth="1"/>
            );
          })}

          {/* Deal pins */}
          {Object.entries(cityPinMap).map(([key,cityDeals])=>
            cityDeals.map((d,idx)=>{
              const pos = getPinPos(d, idx, cityDeals.length);
              if (!pos) return null;
              const color = STRAT_COLOR[d.strategy]||"#a78bfa";
              const isHov = hovPin===d.id;
              const isSel = selectedPin===d.id;
              const spread = d.arv - d.offer;
              return (
                <g key={d.id}
                  style={{cursor:"pointer"}}
                  onClick={()=>setSelectedPin(isSel?null:d.id)}
                  onMouseEnter={()=>setHovPin(d.id)}
                  onMouseLeave={()=>setHovPin(null)}>
                  {/* Glow for live/motivated */}
                  {(d.isLive||d.motivated)&&(
                    <circle cx={pos.x} cy={pos.y} r={isHov?16:12}
                      fill="none" stroke={d.isLive?"#34d399":"#fbbf24"}
                      strokeWidth="1.5" opacity={isHov?0.9:0.5}
                      style={{animation:"aiPulse 2s infinite"}}/>
                  )}
                  {/* Pin circle */}
                  <circle cx={pos.x} cy={pos.y} r={isHov||isSel?9:6.5}
                    fill={color} stroke="#fff" strokeWidth={isSel?2.5:1.5}
                    style={{transition:"r .15s",filter:`drop-shadow(0 2px 4px ${color}88)`}}/>
                  {/* Status ring */}
                  {d.status==="Under Contract"&&(
                    <circle cx={pos.x} cy={pos.y} r={isHov?13:9.5}
                      fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="3 2"/>
                  )}
                  {d.status==="Closed"&&(
                    <circle cx={pos.x} cy={pos.y} r={isHov?13:9.5}
                      fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2"/>
                  )}
                  {/* Hover tooltip */}
                  {isHov&&(
                    <g>
                      <rect x={pos.x+12} y={pos.y-28} width={130} height={52} rx="6"
                        fill={C.bg1} stroke={C.border2} strokeWidth="1"
                        style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,.4))"}}/>
                      <text x={pos.x+19} y={pos.y-12} fill={C.text0} fontSize="9" fontWeight="600" fontFamily="DM Mono,monospace">{d.address.slice(0,18)}</text>
                      <text x={pos.x+19} y={pos.y+0}  fill={C.text2} fontSize="8" fontFamily="DM Mono,monospace">{d.city}, {d.state}</text>
                      <text x={pos.x+19} y={pos.y+12} fill="#34d399"  fontSize="9" fontWeight="700" fontFamily="DM Mono,monospace">{fmt(spread)}</text>
                      <text x={pos.x+70} y={pos.y+12} fill={color}    fontSize="8" fontFamily="DM Mono,monospace">{d.strategy.split(" ")[0]}</text>
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* City labels */}
          {Object.entries(cityGroups).map(([key,g])=>(
            <text key={`lbl-${key}`}
              x={g.coords.x} y={g.coords.y+28}
              textAnchor="middle" fill={C.text3}
              fontSize="8" fontFamily="DM Mono,monospace"
              style={{pointerEvents:"none",userSelect:"none"}}>
              {key.split(" ").slice(0,-1).join(" ")}
            </text>
          ))}
        </svg>

        {/* Legend */}
        <div style={{position:"absolute",bottom:16,left:18,display:"flex",flexDirection:"column",gap:6,background:`${C.bg1}dd`,backdropFilter:"blur(8px)",border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px"}}>
          <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Strategy</div>
          {Object.entries(STRAT_COLOR).map(([s,c])=>(
            <div key={s} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{fontSize:9,color:C.text1}}>{s}</span>
            </div>
          ))}
          <div style={{borderTop:`1px solid ${C.border}`,marginTop:4,paddingTop:6,display:"flex",flexDirection:"column",gap:4}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#34d399",flexShrink:0}}/>
              <span style={{fontSize:9,color:C.text1}}>Live / Motivated</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:10,height:10,borderRadius:"50%",border:"1.5px dashed #059669",flexShrink:0}}/>
              <span style={{fontSize:9,color:C.text1}}>Under Contract</span>
            </div>
          </div>
        </div>

        {/* Stats overlay top-right */}
        <div style={{position:"absolute",bottom:16,right:18,display:"flex",gap:8}}>
          {[
            {l:"Total Equity",v:fmt(visibleDeals.reduce((s,d)=>s+(d.arv-d.offer),0)),c:C.green},
            {l:"Hot Leads",   v:visibleDeals.filter(d=>d.motivated).length,c:C.amber},
            {l:"Markets",     v:Object.keys(cityGroups).length,              c:C.accentL},
          ].map(s=>(
            <div key={s.l} style={{background:`${C.bg1}dd`,backdropFilter:"blur(8px)",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",textAlign:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:s.c}}>{s.v}</div>
              <div style={{fontSize:8,color:C.text3,marginTop:2}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DEAL DETAIL SIDEBAR — shows when pin selected */}
      {selectedPin&&(()=>{
        const deal = allDeals.find(d=>d.id===selectedPin);
        if (!deal) return null;
        const spread = deal.arv - deal.offer;
        const src = SOURCE_CFG[deal.source]||SOURCE_CFG["Zillow"];
        return (
          <div style={{width:280,background:C.bg1,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,overflow:"hidden"}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text0,lineHeight:1.2}}>{deal.address}</div>
                <div style={{fontSize:10,color:C.text2,marginTop:3}}>{deal.city}, {deal.state}</div>
              </div>
              <button onClick={()=>setSelectedPin(null)} style={{background:C.bg3,border:`1px solid ${C.border}`,color:C.text2,width:24,height:24,borderRadius:5,cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
              {/* Badges */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
                <span style={{padding:"2px 8px",borderRadius:999,fontSize:8,fontWeight:600,background:STATUS_CFG[deal.status]?.bg,color:STATUS_CFG[deal.status]?.txt,border:`1px solid ${STATUS_CFG[deal.status]?.bd}`}}>{deal.status}</span>
                <span style={{padding:"2px 8px",borderRadius:999,fontSize:8,color:STRAT_COLOR[deal.strategy]||C.text2,background:C.bg3,border:`1px solid ${C.border}`}}>{deal.strategy}</span>
                {deal.motivated&&<span style={{padding:"2px 8px",borderRadius:999,fontSize:8,color:C.amber,background:"rgba(217,119,6,.1)",border:"1px solid rgba(217,119,6,.3)"}}>🔥 Hot</span>}
                {deal.isLive&&<span style={{padding:"2px 8px",borderRadius:999,fontSize:8,color:C.green,background:"rgba(52,211,153,.1)",border:"1px solid rgba(52,211,153,.3)"}}>● Live</span>}
              </div>
              {/* Key numbers */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                {[["ARV",fmtF(deal.arv||0),C.text1],["Offer",fmtF(deal.offer||0),C.text1],["Spread",fmtF(spread),C.green],[["Fix & Flip","BRRRR"].includes(deal.strategy)?"Repairs":"Loan Bal",[("Fix & Flip","BRRRR")].includes(deal.strategy)?fmtF(deal.repair||0):fmtF(deal.loanBal||0),C.blue]].map(([l,v,c])=>(
                  <div key={l} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:8,color:C.text3,textTransform:"uppercase",marginBottom:2}}>{l}</div>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Source */}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:10}}>
                <div style={{width:24,height:24,borderRadius:6,background:src.bg,border:`1px solid ${src.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:src.color,flexShrink:0}}>{src.icon}</div>
                <div>
                  <div style={{fontSize:10,color:C.text0}}>{deal.source}</div>
                  <div style={{fontSize:9,color:C.text2}}>{deal.added}</div>
                </div>
              </div>
              {/* Notes */}
              {deal.notes&&(
                <div style={{padding:"8px 10px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:8,marginBottom:10}}>
                  <div style={{fontSize:8,color:C.text3,textTransform:"uppercase",marginBottom:4}}>Notes</div>
                  <div style={{fontSize:10,color:C.text1,lineHeight:1.6}}>{deal.notes}</div>
                </div>
              )}
              {/* Tags */}
              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
                {(deal.tags||[]).map(t=>(
                  <span key={t} style={{padding:"2px 7px",borderRadius:4,fontSize:8,color:C.text2,background:C.bg3,border:`1px solid ${C.border}`}}>{t}</span>
                ))}
              </div>
              {/* Open in pipeline button */}
              <button onClick={()=>{onSelectDeal(deal);setSelectedPin(null);}}
                style={{width:"100%",padding:"9px",background:"rgba(109,40,217,.15)",border:"1px solid rgba(109,40,217,.35)",color:C.accentL,borderRadius:8,cursor:"pointer",fontSize:10,fontFamily:"inherit",fontWeight:600}}>
                Open Full Detail →
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── THEME TOGGLE ──────────────────────────────────────────────────────────────
function ThemeToggle({light,onToggle}){
  const C=useC();
  return(
    <button onClick={onToggle} title={light?"Switch to Dark":"Switch to Light"}
      style={{display:"flex",alignItems:"center",gap:6,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 10px",cursor:"pointer",fontSize:10,color:C.text2,fontFamily:"inherit",transition:"all .15s"}}>
      <span style={{fontSize:13}}>{light?"🌙":"☀️"}</span>
      <span>{light?"Dark":"Light"}</span>
    </button>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function DealFlow(){
  const [light,setLight]=useState(false);
  const C = light ? LIGHT : DARK;

  const [view,setView]=useState("dashboard");
  const [active,setActive]=useState(null);
  const [detailOpen,setDetailOpen]=useState(false);
  const [statusF,setStatusF]=useState("All");
  const [stratF,setStratF]=useState("All");
  const [srcF,setSrcF]=useState("All");
  const [cmdOpen,setCmdOpen]=useState(false);
  const [cmdQ,setCmdQ]=useState("");
  const cmdRef=useRef();

  const {liveDeals,sourceStatus,scraping,lastFetch,partnerUpdate,liveMarkets,refetch}=useScraper();

  // Merge: live deals on top, dedupe base deals by address
  const liveAddrs = new Set(liveDeals.map(d=>d.address.toLowerCase()));
  const allDeals  = [...liveDeals, ...DEALS.filter(d=>!liveAddrs.has(d.address.toLowerCase()))];

  // Markets: prefer live data, fall back to base
  const markets = liveMarkets.length>0 ? liveMarkets : BASE_MARKETS;

  const filtered=allDeals.filter(d=>
    (statusF==="All"||d.status===statusF)&&
    (stratF==="All"||d.strategy===stratF)&&
    (srcF==="All"||d.source===srcF)
  );

  useEffect(()=>{
    const h=e=>{if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setCmdOpen(v=>!v);}if(e.key==="Escape")setCmdOpen(false);};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[]);
  useEffect(()=>{if(cmdOpen)setTimeout(()=>cmdRef.current?.focus(),50);},[cmdOpen]);

  const nav=[
    {id:"dashboard",icon:"◈",label:"Dashboard"},
    {id:"pipeline", icon:"◉",label:"Pipeline"},
    {id:"map",      icon:"⊞",label:"Deal Map"},
    {id:"sources",  icon:"⬡",label:"Sources"},
    {id:"team",     icon:"◎",label:"Team"},
    {id:"markets",  icon:"⊕",label:"Markets"},
    {id:"mao",      icon:"∑",label:"MAO"},
  ];

  return(
    <ThemeCtx.Provider value={C}>
    <div style={{display:"flex",height:"100vh",background:C.bg0,color:C.text0,fontFamily:"'DM Mono',monospace",overflow:"hidden",transition:"background .2s,color .2s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${light?"#c0c8d8":"#555"};border-radius:2px;}
        input[type=range]{-webkit-appearance:none;height:3px;border-radius:2px;background:${light?"#e2e8f0":"rgba(255,255,255,.1)"};width:100%;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#6d28d9;cursor:pointer;border:2px solid ${light?"#fff":"#363636"};}
        @keyframes aiPulse{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scrapeBar{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}
      `}</style>

      {/* SIDEBAR */}
      <div style={{width:50,background:C.bg1,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0",flexShrink:0,zIndex:10}}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#5b21b6,#a78bfa)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:12,color:"#fff",marginBottom:18}}>D</div>
        {nav.map(n=>(
          <div key={n.id} onClick={()=>setView(n.id)} title={n.label}
            style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",marginBottom:3,transition:"all .15s",background:view===n.id?"rgba(109,40,217,.18)":"transparent",color:view===n.id?C.accentL:C.text3,fontSize:15,position:"relative"}}
            onMouseEnter={e=>{if(view!==n.id){e.currentTarget.style.background=C.bg3;e.currentTarget.style.color=C.text1;}}}
            onMouseLeave={e=>{if(view!==n.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.text3;}}}>
            {n.icon}
            {n.id==="pipeline"&&allDeals.filter(d=>d.added==="Today").length>0&&(
              <div style={{position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:C.green}}/>
            )}
            {n.id==="sources"&&scraping&&(
              <div style={{position:"absolute",top:5,right:5,width:6,height:6,borderRadius:"50%",background:C.amber,animation:"aiPulse 1s infinite"}}/>
            )}
          </div>
        ))}
        <div style={{flex:1}}/>
        <div onClick={()=>setCmdOpen(true)} title="⌘K" style={{width:34,height:34,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.text3,fontSize:13,marginBottom:8}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.bg3;e.currentTarget.style.color=C.text1;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.text3;}}>⌘</div>
        {TEAM.map(m=>(
          <div key={m.id} title={m.name} style={{width:26,height:26,borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginBottom:4,flexShrink:0,cursor:"pointer"}} onClick={()=>setView("team")}>{m.avatar}</div>
        ))}
      </div>

      {/* PIPELINE SIDEBAR */}
      {view==="pipeline"&&(
        <div style={{width:268,background:C.bg1,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 12px 8px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text0,marginBottom:8}}>
              Pipeline <span style={{fontSize:10,color:C.text3,fontWeight:400}}>({filtered.length})</span>
              {scraping&&<span style={{marginLeft:6,fontSize:9,color:C.amber}}>● live</span>}
            </div>
            <div style={{display:"flex",gap:3,marginBottom:5,flexWrap:"wrap"}}>
              {["All","New Lead","Lead","Analyzing","Under Contract","Closed"].map(s=>(
                <div key={s} onClick={()=>setStatusF(s)} style={{padding:"2px 8px",borderRadius:999,fontSize:8,cursor:"pointer",background:statusF===s?"rgba(109,40,217,.15)":C.bg3,border:statusF===s?"1px solid rgba(109,40,217,.4)":`1px solid ${C.border}`,color:statusF===s?C.accentL:C.text1}}>{s}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:5}}>
              {["All",...Object.keys(STRAT_COLOR)].map(s=>(
                <div key={s} onClick={()=>setStratF(s)} style={{padding:"2px 8px",borderRadius:999,fontSize:8,cursor:"pointer",background:stratF===s?"rgba(2,132,199,.15)":C.bg3,border:stratF===s?"1px solid rgba(2,132,199,.4)":`1px solid ${C.border}`,color:stratF===s?C.blue:C.text1}}>{s}</div>
              ))}
            </div>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {["All",...Object.keys(SOURCE_CFG)].map(s=>(
                <div key={s} onClick={()=>setSrcF(s)} style={{padding:"2px 8px",borderRadius:999,fontSize:8,cursor:"pointer",background:srcF===s?SOURCE_CFG[s]?.bg||C.bg3:C.bg3,border:srcF===s?`1px solid ${SOURCE_CFG[s]?.bd||C.border}`:`1px solid ${C.border}`,color:srcF===s?SOURCE_CFG[s]?.color||C.text0:C.text1}}>
                  {s==="All"?"All Src":s==="Tax Delinquent"?"Tax Del":s}
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {filtered.map(d=>(
              <DealRow key={d.id} deal={d} active={active?.id===d.id&&detailOpen} onClick={()=>{setActive(d);setDetailOpen(true);}}/>
            ))}
          </div>
          <div style={{padding:"8px 12px",borderTop:`1px solid ${C.border}`,fontSize:9,color:C.text3,flexShrink:0}}>
            {filtered.length} deals · <span style={{color:C.green}}>{fmt(filtered.reduce((s,d)=>s+(d.arv-d.offer),0))} equity</span>
            {liveDeals.length>0&&<span style={{color:C.green,marginLeft:6}}>· {liveDeals.length} live</span>}
          </div>
        </div>
      )}

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:44,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",flexShrink:0,background:C.bg1}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text0}}>
            DealFlow <span style={{color:C.accent2,fontWeight:400,fontSize:10}}>Partner Edition</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <ThemeToggle light={light} onToggle={()=>setLight(l=>!l)}/>
            <div onClick={()=>setCmdOpen(true)} style={{display:"flex",alignItems:"center",gap:7,background:C.bg2,border:`1px solid ${C.border}`,padding:"4px 11px",borderRadius:7,cursor:"pointer",fontSize:10,color:C.text2}}>
              <span>⌘</span><span>Search…</span><kbd style={{fontSize:8,background:C.bg3,padding:"1px 5px",borderRadius:3,color:C.text3}}>⌘K</kbd>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5,fontSize:9,color:C.text3,padding:"4px 9px",background:C.bg2,border:`1px solid ${C.border}`,borderRadius:7}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:scraping?C.amber:C.green,display:"inline-block",animation:"aiPulse 2.5s infinite"}}/>
              {scraping?"Scraping live…":`Live · ${new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}`}
            </div>
          </div>
        </div>

        <div style={{flex:1,display:"flex",overflow:"hidden",animation:"fadeIn .18s ease"}}>
          <div style={{flex:1,overflow:"hidden"}}>
            {view==="dashboard"&&<Overview allDeals={allDeals} liveDeals={liveDeals} markets={markets} scraping={scraping} lastFetch={lastFetch} partnerUpdate={partnerUpdate} onRefresh={refetch} onSelect={d=>{setActive(d);setDetailOpen(true);setView("pipeline");}}/>}
            {view==="pipeline"&&(!detailOpen?
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",flexDirection:"column",gap:8}}>
                <div style={{fontSize:36,opacity:.15}}>◉</div>
                <div style={{fontSize:12,color:C.text3}}>Select a deal to view details</div>
              </div>
              :<DetailPanel deal={active} onClose={()=>setDetailOpen(false)}/>
            )}
            {view==="map"&&<MapView allDeals={allDeals} markets={markets} onSelectDeal={d=>{setActive(d);setDetailOpen(true);setView("pipeline");}}/>}
            {view==="sources"&&<SourcesView liveDeals={liveDeals} sourceStatus={sourceStatus} scraping={scraping}/>}
            {view==="team"&&<TeamView deals={allDeals}/>}
            {view==="markets"&&(
              <div style={{padding:"24px 28px",overflowY:"auto",height:"100%"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:C.text0}}>Markets</div>
                  <button onClick={refetch} disabled={scraping} style={{background:"rgba(109,40,217,.12)",border:"1px solid rgba(109,40,217,.3)",color:C.accentL,padding:"5px 13px",borderRadius:7,fontSize:10,cursor:scraping?"default":"pointer",fontFamily:"inherit",opacity:scraping?.5:1}}>
                    {scraping?"Scraping…":"↻ Refresh Live Data"}
                  </button>
                </div>
                <div style={{fontSize:12,color:C.text2,marginBottom:22}}>
                  {markets.length} active markets ranked by avg equity spread.
                  {liveMarkets.length>0&&<span style={{color:C.green,marginLeft:8}}>● live data{lastFetch?` · ${lastFetch}`:""}</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
                  {markets.sort((a,b)=>b.spread-a.spread).map(m=>(
                    <div key={m.name} style={{background:C.bg2,border:`1px solid ${m.hot?"rgba(109,40,217,.3)":C.border}`,borderRadius:14,padding:18,position:"relative",overflow:"hidden"}}>
                      {m.hot&&<div style={{position:"absolute",top:0,right:0,background:"rgba(109,40,217,.1)",padding:"2px 10px",borderRadius:"0 14px 0 8px",fontSize:8,color:C.accentL}}>HOT</div>}
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,color:C.text0,marginBottom:3}}>{m.name}</div>
                      <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:C.green,marginBottom:6}}>{fmt(m.spread)}</div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:8}}>
                        <span style={{color:C.text2}}>{m.deals} deals</span>
                        <span style={{color:m.trend?.startsWith("+")?C.green:C.red,fontWeight:600}}>{m.trend}</span>
                      </div>
                      <div style={{height:2,background:C.bg3,borderRadius:1}}>
                        <div style={{width:`${Math.min(100,(m.spread/200000)*100)}%`,height:"100%",background:m.hot?"linear-gradient(90deg,#5b21b6,#a78bfa)":"#94a3b8",borderRadius:1}}/>
                      </div>
                      {m.note&&<div style={{fontSize:10,color:C.text2,marginTop:6,lineHeight:1.5}}>{m.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {view==="mao"&&<MAOView/>}
          </div>
        </div>
      </div>

      {/* COMMAND PALETTE */}
      {cmdOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",backdropFilter:"blur(6px)",zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"11vh"}} onClick={()=>setCmdOpen(false)}>
          <div style={{background:C.bg1,border:`1px solid ${C.border2}`,borderRadius:14,width:"100%",maxWidth:540,overflow:"hidden",boxShadow:"0 24px 80px rgba(0,0,0,.35)"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.text2,fontSize:14}}>⌘</span>
              <input ref={cmdRef} value={cmdQ} onChange={e=>setCmdQ(e.target.value)} placeholder="Search deals, markets, sources…"
                style={{flex:1,background:"none",border:"none",outline:"none",color:C.text0,fontSize:13,fontFamily:"inherit"}}/>
              <kbd style={{fontSize:9,color:C.text3,background:C.bg3,padding:"2px 6px",borderRadius:4}}>ESC</kbd>
            </div>
            <div style={{maxHeight:340,overflowY:"auto"}}>
              {(cmdQ?allDeals.filter(d=>`${d.address} ${d.city} ${d.state} ${d.strategy} ${d.source} ${d.status}`.toLowerCase().includes(cmdQ.toLowerCase())):allDeals.slice(0,6)).map(d=>{
                const src=SOURCE_CFG[d.source]||SOURCE_CFG["Zillow"];
                return(
                  <div key={d.id} onClick={()=>{setActive(d);setDetailOpen(true);setView("pipeline");setCmdOpen(false);setCmdQ("");}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"11px 16px",cursor:"pointer",borderBottom:`1px solid ${C.border}`}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:26,height:26,borderRadius:7,background:src.bg,border:`1px solid ${src.bd}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:src.color,flexShrink:0}}>{src.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:C.text0,fontWeight:500}}>
                        {d.address}, {d.city}
                        {d.isLive&&<span style={{marginLeft:5,fontSize:8,color:C.green}}>● LIVE</span>}
                      </div>
                      <div style={{fontSize:10,color:C.text2}}>{d.strategy} · {d.source} · {d.status}</div>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.green}}>{fmt(d.arv-d.offer)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    </ThemeCtx.Provider>
  );
}

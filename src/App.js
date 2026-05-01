import { useState, useEffect } from "react";

// ─── Storage keys ─────────────────────────────────────────────────────────────
const SK = {
  inventory:"thc-inv-v5", requests:"thc-req-v5",
  sellers:"thc-sel-v5",   listings:"thc-lst-v5",
  users:"thc-usr-v5",     session:"thc-ses-v5",
};

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:"u0", email:"admin@thc.in",         password:"admin123",  role:"admin",  name:"Admin",        phone:"", createdAt:"2024-01-01" },
  { id:"u1", email:"vikram@thc.in",         password:"vikram123", role:"seller", name:"Vikram Nair",  phone:"+91 98400 11111", createdAt:"2024-01-15", sellerId:"s1" },
  { id:"u2", email:"priya@thc.in",          password:"priya123",  role:"seller", name:"Priya Menon",  phone:"+91 98400 22222", createdAt:"2024-03-01", sellerId:"s2" },
  { id:"u3", email:"buyer@thc.in",          password:"buyer123",  role:"buyer",  name:"Arjun Sharma", phone:"+91 98400 33333", createdAt:"2024-09-01" },
];

const SEED_INVENTORY = [
  { id:"w1",  brand:"HMT",    model:"Pilot",     reference:"HMT-PIL-001", decade:"1970s", condition:"Excellent", price:2800, description:"Black dial, luminous hands, original crown intact. Hand-wound 17-jewel movement.", available:true,  tags:["pilot","hand-wound","black dial"] },
  { id:"w2",  brand:"HMT",    model:"Janata",    reference:"HMT-JAN-002", decade:"1980s", condition:"Good",      price:1200, description:"India's people's watch. Honest patina on a cream dial. Original bracelet. Automatic.", available:true,  tags:["janata","automatic"] },
  { id:"w3",  brand:"HMT",    model:"Kanchan",   reference:"HMT-KAN-003", decade:"1970s", condition:"Good",      price:1800, description:"Ladies' dress piece. Gold-tone, champagne dial, manual wind. Tiny and perfect.", available:false, tags:["kanchan","ladies","dress"] },
  { id:"w4",  brand:"HMT",    model:"Chetak",    reference:"HMT-CHE-004", decade:"1980s", condition:"Fair",      price:900,  description:"Named after Maharana Pratap's horse. Day-date, silver sunburst dial.", available:true,  tags:["chetak","day-date"] },
  { id:"w5",  brand:"HMT",    model:"Sona",      reference:"HMT-SON-005", decade:"1990s", condition:"Mint",      price:3500, description:"Deadstock. Box and papers. 21-jewel automatic. This doesn't come up often.", available:true,  tags:["sona","mint","deadstock"] },
  { id:"w6",  brand:"HMT",    model:"Rajat",     reference:"HMT-RAJ-006", decade:"1980s", condition:"Excellent", price:2200, description:"Silver jubilee commemorative. Exhibition caseback.", available:true,  tags:["rajat","commemorative"] },
  { id:"w7",  brand:"HMT",    model:"Jawan",     reference:"HMT-JAW-007", decade:"1970s", condition:"Good",      price:1600, description:"Military feel. Bold Arabic numerals, rugged case, hand-wound.", available:true,  tags:["jawan","military"] },
  { id:"w8",  brand:"Allwyn", model:"Stride",    reference:"ALW-STR-001", decade:"1980s", condition:"Good",      price:1400, description:"Clean white dial, date at 3, original bracelet. Quartz.", available:true,  tags:["allwyn","stride","quartz"] },
  { id:"w9",  brand:"Allwyn", model:"Challenge", reference:"ALW-CHL-002", decade:"1980s", condition:"Fair",      price:800,  description:"Water-resistant, bold indices. The beater you actually want.", available:true,  tags:["allwyn","challenge"] },
  { id:"w10", brand:"Allwyn", model:"Orion",     reference:"ALW-ORI-003", decade:"1990s", condition:"Excellent", price:1100, description:"Slim profile, champagne dial, gold-tone. One of the last Allywyns.", available:false, tags:["allwyn","orion","slim"] },
  { id:"w11", brand:"Ricoh",  model:"Datomatic", reference:"RIC-DAT-001", decade:"1970s", condition:"Good",      price:2000, description:"Japanese movement, India market. Day-date, silver dial.", available:true,  tags:["ricoh","datomatic","automatic"] },
  { id:"w12", brand:"Ricoh",  model:"Adonis",    reference:"RIC-ADN-002", decade:"1980s", condition:"Excellent", price:2600, description:"Dress watch. Thin, applied indices, polished and brushed finishing.", available:true,  tags:["ricoh","adonis","dress"] },
];

const SEED_SELLERS = [
  { id:"s1", name:"Vikram Nair",  handle:"@vikram_dials",  city:"Bangalore", bio:"Collecting HMT since 2015. Specialise in pre-1980 hand-wounds. Every watch sold has been worn by me first.", verified:true,  rating:4.9, reviewCount:34, joinDate:"2024-01", sales:41, badge:"Top Seller", avatar:"VN" },
  { id:"s2", name:"Priya Menon",  handle:"@priya_vintage", city:"Chennai",   bio:"Allwyn and Ricoh specialist. I find them, clean them, document them. No restorations, original only.",       verified:true,  rating:4.7, reviewCount:18, joinDate:"2024-03", sales:22, badge:"Verified",    avatar:"PM" },
  { id:"s3", name:"Rohan Das",    handle:"@rohan_hmt",     city:"Delhi",     bio:"HMT Pilot hunter. If it exists, I've probably held it. Honest about condition, always.",                     verified:false, rating:4.2, reviewCount:6,  joinDate:"2024-09", sales:8,  badge:null,          avatar:"RD" },
  { id:"s4", name:"Ananya Shah",  handle:"@ananya_dials",  city:"Mumbai",    bio:"Curating Indian horology for the new generation. Clean photos, honest descriptions.",                        verified:true,  rating:4.8, reviewCount:11, joinDate:"2024-07", sales:14, badge:"Verified",    avatar:"AS" },
];

const SEED_LISTINGS = [
  { id:"l1", sellerId:"s1", brand:"HMT",    model:"Pilot",     reference:"HMT-PIL-88",  decade:"1970s", condition:"Excellent", price:3200, description:"Original black dial, no refinish. Case has honest wear. Movement serviced 2023.", verified:true,  createdAt:"2024-10-01" },
  { id:"l2", sellerId:"s1", brand:"HMT",    model:"Jawan",     reference:"HMT-JAW-22",  decade:"1970s", condition:"Good",      price:1800, description:"Bold Arabic numerals, original bracelet. Shows wear but nothing offensive. Hand-wound.", verified:true,  createdAt:"2024-10-12" },
  { id:"l3", sellerId:"s2", brand:"Allwyn", model:"Stride",    reference:"ALW-STR-77",  decade:"1980s", condition:"Excellent", price:1600, description:"White dial, no yellowing. Original bracelet. Quartz running strong.", verified:true,  createdAt:"2024-10-18" },
  { id:"l4", sellerId:"s4", brand:"Ricoh",  model:"Datomatic", reference:"RIC-DAT-55",  decade:"1970s", condition:"Good",      price:2200, description:"Day-date, silver dial. Japanese 21-jewel auto. Honest case scratches.", verified:true,  createdAt:"2024-10-20" },
  { id:"l5", sellerId:"s3", brand:"HMT",    model:"Chetak",    reference:"HMT-CHE-33",  decade:"1980s", condition:"Fair",      price:700,  description:"Day-date working. Dial has a small spot near 4. Priced accordingly.", verified:false, createdAt:"2024-10-22" },
];

// UPI config — replace with real UPI ID
const UPI_ID  = "thehorologicalcatalog@upi";
const UPI_NAME= "The Horological Catalog";

// ─── AI search ────────────────────────────────────────────────────────────────
async function aiSearch(query, inventory) {
  const inv = inventory.map(w=>`ID:${w.id}|${w.brand} ${w.model}(${w.decade})|₹${w.price}|${w.condition}|Avail:${w.available}`).join("\n");
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514",max_tokens:700,
        messages:[{role:"user",content:`Vintage Indian watch sourcing expert. Only HMT, Allwyn, Ricoh.\n\nINVENTORY:\n${inv}\n\nQUERY:"${query}"\n\nJSON only:\n{"matchedIds":[],"summary":"2-3 sentences","sourcing_note":"","confidence":"high|medium|low"}`}]
      })
    });
    const d = await res.json();
    return JSON.parse((d.content?.map(c=>c.text||"").join("")||"{}").replace(/```json|```/g,"").trim());
  } catch { return {matchedIds:[],summary:"Search complete.",sourcing_note:"",confidence:"low"}; }
}

// ─── Global CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#F4EFE6;--bg2:#EDE6DA;--bg3:#E2DBD0;
  --ink:#1A1612;--ink2:#4A423A;--ink3:#8A7E74;
  --gold:#B8860B;--glt:#D4A017;--gbg:#FDF6E3;--gbd:#DCC57A;
  --red:#C0392B;--rbg:#FAEEEC;--rbd:#E8B5AE;
  --grn:#2E7D52;--gnbg:#E8F5EE;--gnbd:#A8D5BC;
  --blu:#3730A3;--bbg:#EEF2FF;--bbd:#B0BFFF;
  --bd:#C8BFB0;--bd2:#DDD6CC;
}
body{background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:var(--bg2);} ::-webkit-scrollbar-thumb{background:var(--bd);}
input,textarea,select{background:#fff;border:1.5px solid var(--bd);color:var(--ink);padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:14px;border-radius:4px;width:100%;outline:none;transition:border-color .15s;-webkit-appearance:none;}
input:focus,textarea:focus,select:focus{border-color:var(--ink);}
input::placeholder,textarea::placeholder{color:var(--ink3);}
button{cursor:pointer;font-family:'DM Sans',sans-serif;border:none;transition:all .15s;}
.btn-ink{background:var(--ink);color:var(--bg);padding:11px 22px;font-size:13px;font-weight:500;border-radius:4px;display:inline-flex;align-items:center;gap:8px;}
.btn-ink:hover{background:#2d2520;} .btn-ink:disabled{opacity:.5;cursor:not-allowed;}
.btn-ghost{background:transparent;color:var(--ink);border:1.5px solid var(--bd);padding:10px 20px;font-size:13px;border-radius:4px;}
.btn-ghost:hover{border-color:var(--ink);background:var(--bg2);}
.btn-gold{background:var(--gold);color:#fff;padding:11px 22px;font-size:13px;font-weight:500;border-radius:4px;}
.btn-gold:hover{background:var(--glt);}
.btn-green{background:var(--grn);color:#fff;padding:11px 22px;font-size:13px;font-weight:500;border-radius:4px;}
.btn-green:hover{background:#237a45;}
.tag{display:inline-flex;align-items:center;gap:4px;background:var(--bg3);border:1px solid var(--bd);color:var(--ink2);padding:3px 9px;font-size:10px;font-family:'DM Mono',monospace;letter-spacing:.08em;border-radius:3px;text-transform:uppercase;}
.tag-grn{background:var(--gnbg);border-color:var(--gnbd);color:var(--grn);}
.tag-red{background:var(--rbg);border-color:var(--rbd);color:var(--red);}
.tag-gold{background:var(--gbg);border-color:var(--gbd);color:var(--gold);}
.tag-blu{background:var(--bbg);border-color:var(--bbd);color:var(--blu);}
.card{background:#fff;border:1.5px solid var(--bd2);border-radius:8px;padding:24px;transition:border-color .15s,box-shadow .15s;}
.card:hover{border-color:var(--bd);box-shadow:0 2px 14px rgba(0,0,0,.07);}
.fade-in{animation:fadeUp .35s ease both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.sl{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink3);margin-bottom:8px;display:block;}
.fl{font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--ink2);margin-bottom:6px;display:block;}
.divider{width:100%;height:1px;background:var(--bd2);margin:24px 0;}
.avatar{width:38px;height:38px;border-radius:50%;background:var(--ink);color:var(--bg);display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:12px;font-weight:500;flex-shrink:0;}
.vbadge{display:inline-flex;align-items:center;gap:3px;background:var(--gbg);border:1px solid var(--gbd);color:var(--gold);padding:2px 7px;font-size:9px;font-family:'DM Mono',monospace;letter-spacing:.1em;border-radius:2px;text-transform:uppercase;}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.ticker{animation:ticker 34s linear infinite;white-space:nowrap;display:inline-block;}
/* Modal overlay */
.overlay{position:fixed;inset:0;background:rgba(26,22,18,.55);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
.modal{background:#fff;border-radius:12px;padding:36px;width:100%;max-width:440px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.2);}
/* UPI QR mock */
.upi-box{background:var(--gbg);border:2px dashed var(--gbd);border-radius:8px;padding:24px;text-align:center;}
/* Step tabs */
.stab{padding:9px 16px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.12em;background:none;border-bottom:2.5px solid transparent;margin-bottom:-1.5px;color:var(--ink3);}
.stab.active{color:var(--ink);border-bottom-color:var(--ink);}
.stab.done{color:var(--grn);}
/* Role pill */
.role-pill{padding:3px 10px;border-radius:20px;font-size:10px;font-family:'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;}
`;

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size="md", onClick, light=false }) {
  const s = size==="sm"?.72:size==="lg"?1.4:1;
  const fg = light?"#F4EFE6":"#1A1612";
  const ac = "#B8860B";
  return (
    <div onClick={onClick} style={{cursor:onClick?"pointer":"default",display:"flex",alignItems:"center",gap:Math.round(13*s),userSelect:"none"}}>
      <svg width={Math.round(46*s)} height={Math.round(46*s)} viewBox="0 0 46 46" fill="none">
        <circle cx="23" cy="23" r="21.5" stroke={fg} strokeWidth="1.5"/>
        <circle cx="23" cy="23" r="17" stroke={ac} strokeWidth="0.6" strokeDasharray="1.4 2.2"/>
        {/* Cardinal ticks */}
        <line x1="23" y1="2.5"  x2="23"   y2="6.5"  stroke={fg} strokeWidth="2"   strokeLinecap="round"/>
        <line x1="23" y1="39.5" x2="23"   y2="43.5" stroke={fg} strokeWidth="2"   strokeLinecap="round"/>
        <line x1="2.5" y1="23"  x2="6.5"  y2="23"   stroke={fg} strokeWidth="2"   strokeLinecap="round"/>
        <line x1="39.5" y1="23" x2="43.5" y2="23"   stroke={fg} strokeWidth="2"   strokeLinecap="round"/>
        {[45,135,225,315].map(d=>{
          const r=(d-90)*Math.PI/180;
          return <line key={d} x1={23+20.5*Math.cos(r)} y1={23+20.5*Math.sin(r)} x2={23+17.5*Math.cos(r)} y2={23+17.5*Math.sin(r)} stroke={fg} strokeWidth="0.8" strokeLinecap="round" opacity="0.5"/>;
        })}
        {/* Hands — connection mark */}
        <line x1="23" y1="23" x2="10" y2="11" stroke={fg} strokeWidth="2.8" strokeLinecap="round"/>
        <line x1="23" y1="23" x2="35" y2="8"  stroke={ac} strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="23" y1="23" x2="26" y2="32" stroke={fg} strokeWidth="1"   strokeLinecap="round" opacity="0.3"/>
        <circle cx="23" cy="23" r="3.5" fill={fg}/>
        <circle cx="23" cy="23" r="1.6" fill={ac}/>
        <rect x="42.5" y="20.5" width="3" height="5" rx="1" fill={ac}/>
      </svg>
      <div style={{lineHeight:1}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:Math.round(19*s),fontWeight:700,letterSpacing:"-0.01em",color:fg,lineHeight:1.1}}>The Horological</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:Math.round(8.5*s),letterSpacing:"0.28em",color:ac,textTransform:"uppercase"}}>Catalog</div>
          <div style={{width:1,height:9,background:ac,opacity:.4}}/>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:Math.round(7.5*s),letterSpacing:"0.14em",color:light?"rgba(244,239,230,0.45)":"var(--ink3)",textTransform:"uppercase"}}>Est. 2024</div>
        </div>
      </div>
    </div>
  );
}

// ─── UPI Payment Modal ────────────────────────────────────────────────────────
function UPIModal({ amount, purpose, onSuccess, onClose }) {
  const [step, setStep]   = useState("choose"); // choose | qr | verify | done
  const [method, setMeth] = useState("");
  const [txnId, setTxnId] = useState("");
  const [err, setErr]     = useState("");

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose)}`;

  const handleVerify = () => {
    if (txnId.trim().length < 6) { setErr("Enter a valid UTR / Transaction ID (min 6 chars)."); return; }
    setStep("done");
    setTimeout(() => onSuccess(txnId.trim()), 1200);
  };

  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal fade-in">
        <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"none",fontSize:20,color:"var(--ink3)",lineHeight:1}}>×</button>

        {/* Header */}
        <div style={{marginBottom:24}}>
          <div className="sl" style={{marginBottom:4}}>Secure Payment</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>₹{amount.toLocaleString("en-IN")}</div>
          <div style={{fontSize:12,color:"var(--ink3)",marginTop:3}}>{purpose}</div>
        </div>

        {step==="choose" && (
          <div className="fade-in">
            <div className="sl">Choose payment method</div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
              {[
                {id:"upi_app", icon:"📱", label:"UPI App", sub:"GPay, PhonePe, Paytm, BHIM"},
                {id:"qr",      icon:"◻",  label:"Scan QR Code", sub:"Any UPI app"},
                {id:"upi_id",  icon:"⌨",  label:"Pay via UPI ID", sub:`Send to ${UPI_ID}`},
              ].map(m=>(
                <div key={m.id} onClick={()=>setMeth(m.id)} style={{
                  border:"1.5px solid", borderColor:method===m.id?"var(--ink)":"var(--bd)",
                  borderRadius:6, padding:"12px 16px", cursor:"pointer",
                  background:method===m.id?"var(--bg2)":"#fff",
                  display:"flex", alignItems:"center", gap:14,
                  transition:"all .15s"
                }}>
                  <span style={{fontSize:22}}>{m.icon}</span>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{m.label}</div>
                    <div style={{fontSize:11,color:"var(--ink3)"}}>{m.sub}</div>
                  </div>
                  {method===m.id && <span style={{marginLeft:"auto",color:"var(--grn)",fontSize:16}}>✓</span>}
                </div>
              ))}
            </div>
            <button className="btn-gold" style={{width:"100%",padding:13,fontSize:14}} onClick={()=>{if(!method){setErr("Select a method.");return;}setErr("");setStep("qr");}}>
              Continue →
            </button>
            {err && <div style={{color:"var(--red)",fontSize:12,marginTop:10,textAlign:"center"}}>{err}</div>}
          </div>
        )}

        {step==="qr" && (
          <div className="fade-in">
            <div className="upi-box" style={{marginBottom:20}}>
              {/* QR mock — in production replace with real Razorpay/Cashfree QR */}
              <svg width="140" height="140" viewBox="0 0 140 140" style={{margin:"0 auto",display:"block",marginBottom:12}}>
                <rect width="140" height="140" fill="#fff"/>
                {/* Outer finder patterns */}
                <rect x="8"  y="8"  width="36" height="36" rx="4" fill="none" stroke="#1A1612" strokeWidth="4"/>
                <rect x="14" y="14" width="24" height="24" rx="2" fill="#1A1612"/>
                <rect x="96" y="8"  width="36" height="36" rx="4" fill="none" stroke="#1A1612" strokeWidth="4"/>
                <rect x="102" y="14" width="24" height="24" rx="2" fill="#1A1612"/>
                <rect x="8"  y="96" width="36" height="36" rx="4" fill="none" stroke="#1A1612" strokeWidth="4"/>
                <rect x="14" y="102" width="24" height="24" rx="2" fill="#1A1612"/>
                {/* Data dots pattern */}
                {[52,58,64,70,76,82,88].map(x=>[52,58,64,70,76,82,88].map(y=>(
                  Math.sin(x*y*0.03)>0.2?<rect key={`${x}${y}`} x={x} y={y} width="5" height="5" rx="1" fill="#1A1612"/>:null
                )))}
                {/* Centre logo */}
                <circle cx="70" cy="70" r="14" fill="#fff"/>
                <circle cx="70" cy="70" r="10" fill="#1A1612"/>
                <circle cx="70" cy="70" r="4"  fill="#B8860B"/>
              </svg>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--ink2)",letterSpacing:"0.08em"}}>{UPI_ID}</div>
              <div style={{fontSize:11,color:"var(--ink3)",marginTop:4}}>Scan with any UPI app</div>
            </div>

            {method==="upi_id" && (
              <div style={{background:"var(--bg2)",border:"1.5px solid var(--bd)",borderRadius:6,padding:14,marginBottom:16,textAlign:"center"}}>
                <div className="sl" style={{marginBottom:4}}>Send payment to</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:500,letterSpacing:"0.06em"}}>{UPI_ID}</div>
                <div style={{fontSize:12,color:"var(--ink3)",marginTop:4}}>Amount: ₹{amount}</div>
              </div>
            )}

            {method==="upi_app" && (
              <a href={upiLink} style={{display:"block",marginBottom:16}}>
                <button className="btn-gold" style={{width:"100%",padding:12,fontSize:13}}>Open UPI App →</button>
              </a>
            )}

            <div className="sl" style={{marginBottom:6}}>After paying — enter UTR / Transaction ID</div>
            <input value={txnId} onChange={e=>{setTxnId(e.target.value);setErr("");}} placeholder="12-digit UTR or Transaction ID" style={{marginBottom:12,fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}/>
            {err && <div style={{color:"var(--red)",fontSize:12,marginBottom:10}}>{err}</div>}
            <button className="btn-green" style={{width:"100%",padding:13,fontSize:14}} onClick={handleVerify}>I've paid — confirm →</button>
            <button className="btn-ghost" style={{width:"100%",marginTop:10,fontSize:12}} onClick={()=>setStep("choose")}>← Change method</button>
          </div>
        )}

        {step==="done" && (
          <div className="fade-in" style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:52,marginBottom:12}}>✓</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,marginBottom:8}}>Payment received.</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--ink3)",marginBottom:4}}>UTR: {txnId}</div>
            <div style={{fontSize:13,color:"var(--ink3)"}}>Confirming your order…</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onLogin, onClose, defaultRole="buyer" }) {
  const [mode, setMode]     = useState("login");   // login | signup
  const [role, setRole]     = useState(defaultRole);
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [name, setName]     = useState("");
  const [phone, setPhone]   = useState("");
  const [err, setErr]       = useState("");

  const DEMO = { admin:"admin@thc.in / admin123", seller:"vikram@thc.in / vikram123", buyer:"buyer@thc.in / buyer123" };

  const handleLogin = (users) => {
    const u = users.find(u=>u.email===email.trim()&&u.password===pass);
    if (!u) { setErr("Wrong email or password."); return; }
    onLogin(u);
  };

  const handleSignup = (users, saveUsers) => {
    if (!name||!email||!pass) { setErr("Fill all required fields."); return; }
    if (users.find(u=>u.email===email.trim())) { setErr("Email already registered."); return; }
    const newUser = { id:"u"+Date.now(), email:email.trim(), password:pass, role, name, phone, createdAt:new Date().toISOString() };
    saveUsers([...users, newUser]);
    onLogin(newUser);
  };

  return (
    <AuthModalInner mode={mode} setMode={setMode} role={role} setRole={setRole}
      email={email} setEmail={setEmail} pass={pass} setPass={setPass}
      name={name} setName={setName} phone={phone} setPhone={setPhone}
      err={err} setErr={setErr} DEMO={DEMO}
      handleLogin={handleLogin} handleSignup={handleSignup} onClose={onClose}/>
  );
}

// We need access to users inside the modal — pass via context trick
function AuthModalInner({ mode, setMode, role, setRole, email, setEmail, pass, setPass, name, setName, phone, setPhone, err, setErr, DEMO, handleLogin, handleSignup, onClose }) {
  const { users, saveUsers } = useGlobalUsers();
  const roleColors = { buyer:"#3730A3", seller:"#2E7D52", admin:"#C0392B" };

  return (
    <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="modal fade-in" style={{maxWidth:400}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"none",fontSize:20,color:"var(--ink3)",lineHeight:1}}>×</button>

        <div style={{textAlign:"center",marginBottom:28}}>
          <Logo size="sm"/>
        </div>

        {/* Role selector */}
        <div style={{display:"flex",gap:6,marginBottom:24,background:"var(--bg2)",padding:4,borderRadius:6}}>
          {["buyer","seller","admin"].map(r=>(
            <button key={r} onClick={()=>{setRole(r);setErr("");}} style={{
              flex:1, padding:"8px 0", borderRadius:4, fontSize:12,
              fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase",
              background:role===r?"#fff":"transparent",
              color:role===r?roleColors[r]:"var(--ink3)",
              boxShadow:role===r?"0 1px 4px rgba(0,0,0,.1)":"none",
              fontWeight:role===r?500:400,
            }}>{r}</button>
          ))}
        </div>

        {/* Demo hint */}
        <div style={{background:"var(--gbg)",border:"1px solid var(--gbd)",borderRadius:4,padding:"8px 12px",marginBottom:20,fontSize:11,color:"var(--ink3)",fontFamily:"'DM Mono',monospace",letterSpacing:"0.04em"}}>
          Demo: {DEMO[role]}
        </div>

        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:20,textAlign:"center"}}>
          {mode==="login"?"Sign in":"Create account"}
        </div>

        {mode==="signup" && (
          <>
            <div style={{marginBottom:12}}><label className="fl">Full Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></div>
            <div style={{marginBottom:12}}><label className="fl">Phone / WhatsApp</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 98xxx xxxxx"/></div>
          </>
        )}
        <div style={{marginBottom:12}}><label className="fl">Email *</label><input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="your@email.com"/></div>
        <div style={{marginBottom:20}}><label className="fl">Password *</label><input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} placeholder="••••••••"/></div>

        {err && <div style={{color:"var(--red)",fontSize:12,marginBottom:14,textAlign:"center"}}>{err}</div>}

        <button className="btn-ink" style={{width:"100%",padding:13,fontSize:14,justifyContent:"center"}}
          onClick={()=> mode==="login" ? handleLogin(users) : handleSignup(users,saveUsers)}>
          {mode==="login"?"Sign in →":"Create account →"}
        </button>

        <div style={{textAlign:"center",marginTop:16,fontSize:13,color:"var(--ink3)"}}>
          {mode==="login" ? <>No account? <button onClick={()=>{setMode("signup");setErr("");}} style={{background:"none",color:"var(--gold)",fontWeight:500,fontSize:13,textDecoration:"underline"}}>Sign up</button></> :
            <>Have an account? <button onClick={()=>{setMode("login");setErr("");}} style={{background:"none",color:"var(--gold)",fontWeight:500,fontSize:13,textDecoration:"underline"}}>Sign in</button></>}
        </div>
      </div>
    </div>
  );
}

// ─── Global users context (simple) ────────────────────────────────────────────
let _globalUsers = [];
let _setGlobalUsers = null;
function useGlobalUsers() {
  return { users: _globalUsers, saveUsers: _setGlobalUsers || (()=>{}) };
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]         = useState("home");
  const [inventory, setInv]     = useState([]);
  const [requests, setReqs]     = useState([]);
  const [sellers, setSellers]   = useState([]);
  const [listings, setListings] = useState([]);
  const [users, setUsers]       = useState([]);
  const [session, setSession]   = useState(null); // { user }
  const [showAuth, setShowAuth] = useState(false);
  const [authRole, setAuthRole] = useState("buyer");
  const [toast, setToast]       = useState(null);
  const [mounted, setMounted]   = useState(false);

  // Wire up global users ref
  _globalUsers   = users;
  _setGlobalUsers = (v) => { setUsers(v); persist(SK.users, v); };

  useEffect(()=>{
    (async()=>{
      const load = async (k,fb) => { try { const r=await window.storage.get(k); return r?JSON.parse(r.value):fb; } catch { return fb; } };
      setInv(     await load(SK.inventory, SEED_INVENTORY));
      setReqs(    await load(SK.requests,  []));
      setSellers( await load(SK.sellers,   SEED_SELLERS));
      setListings(await load(SK.listings,  SEED_LISTINGS));
      setUsers(   await load(SK.users,     SEED_USERS));
      const ses = await load(SK.session,   null);
      if (ses) setSession(ses);
      setMounted(true);
    })();
  },[]);

  const persist = async (k,v) => { try { await window.storage.set(k,JSON.stringify(v)); } catch {} };
  const saveInv  = v => { setInv(v);      persist(SK.inventory,v); };
  const saveReqs = v => { setReqs(v);     persist(SK.requests,v); };
  const saveSel  = v => { setSellers(v);  persist(SK.sellers,v); };
  const saveLst  = v => { setListings(v); persist(SK.listings,v); };
  const showToast = (msg,dur=3000) => { setToast(msg); setTimeout(()=>setToast(null),dur); };

  const login = (user) => {
    const ses = { user, loginAt:new Date().toISOString() };
    setSession(ses); persist(SK.session,ses);
    setShowAuth(false);
    showToast(`Welcome back, ${user.name.split(" ")[0]} ✓`);
    if (user.role==="admin")  setView("admin");
    else if (user.role==="seller") setView("seller-dash");
  };
  const logout = () => { setSession(null); persist(SK.session,null); setView("home"); showToast("Signed out."); };

  const openAuth = (role="buyer") => { setAuthRole(role); setShowAuth(true); };

  if (!mounted) return (
    <div style={{background:"#F4EFE6",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Logo size="lg"/></div>
  );

  const u = session?.user;
  const isAdmin  = u?.role==="admin";
  const isSeller = u?.role==="seller";
  const isBuyer  = u?.role==="buyer";

  const NAV_LINKS = [
    ["search","Browse"],
    ["request","Request — ₹99"],
    ["auth-svc","Authenticate"],
    ["market","Marketplace"],
    ["track","Track"],
  ];

  return (
    <div style={{minHeight:"100vh",background:"#F4EFE6"}}>
      <style>{CSS}</style>

      {toast && <div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1A1612",color:"#F4EFE6",padding:"12px 24px",borderRadius:6,zIndex:9999,fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:"0.06em",whiteSpace:"nowrap",boxShadow:"0 4px 24px rgba(0,0,0,.25)"}}>{toast}</div>}

      {showAuth && <AuthModal defaultRole={authRole} onLogin={login} onClose={()=>setShowAuth(false)}/>}

      {/* Ticker */}
      <div style={{background:"#1A1612",padding:"7px 0",overflow:"hidden"}}>
        <div className="ticker" style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#D4A017",letterSpacing:"0.18em"}}>
          {"HMT · ALLWYN · RICOH · TRUSTED SELLERS · SOURCING ₹99 · AUTHENTICITY ₹300 · EST. 2024 · DELHI · ".repeat(8)}
        </div>
      </div>

      {/* Header */}
      <header style={{background:"rgba(244,239,230,.96)",borderBottom:"1.5px solid #C8BFB0",padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(12px)"}}>
        <Logo size="sm" onClick={()=>setView("home")}/>
        <nav style={{display:"flex",gap:2,alignItems:"center"}}>
          {NAV_LINKS.map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?"#1A1612":"transparent",color:view===v?"#F4EFE6":"#4A423A",padding:"7px 13px",fontSize:12.5,fontWeight:view===v?500:400,borderRadius:4,border:"none"}}>
              {label}
            </button>
          ))}
          <div style={{width:1,height:18,background:"#C8BFB0",margin:"0 6px"}}/>

          {!u ? (
            <div style={{display:"flex",gap:6}}>
              <button className="btn-ghost" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>openAuth("buyer")}>Sign in</button>
              <button className="btn-ink"   style={{fontSize:12,padding:"7px 14px"}} onClick={()=>openAuth("seller")}>Sell a watch</button>
            </div>
          ) : (
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {isAdmin  && <button onClick={()=>setView("admin")}       style={{background:"var(--rbg)",color:"var(--red)",border:"1px solid var(--rbd)",padding:"6px 12px",fontSize:11,borderRadius:4,fontFamily:"'DM Mono',monospace"}}>ADMIN</button>}
              {isSeller && <button onClick={()=>setView("seller-dash")} style={{background:"var(--gnbg)",color:"var(--grn)",border:"1px solid var(--gnbd)",padding:"6px 12px",fontSize:11,borderRadius:4,fontFamily:"'DM Mono',monospace"}}>SELLER DASHBOARD</button>}
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:"#fff",border:"1.5px solid var(--bd)",borderRadius:20}}>
                <div className="avatar" style={{width:26,height:26,fontSize:10}}>{u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
                <span style={{fontSize:12,fontWeight:500}}>{u.name.split(" ")[0]}</span>
                <span className="role-pill" style={{background:u.role==="admin"?"var(--rbg)":u.role==="seller"?"var(--gnbg)":"var(--bbg)",color:u.role==="admin"?"var(--red)":u.role==="seller"?"var(--grn)":"var(--blu)"}}>{u.role}</span>
              </div>
              <button className="btn-ghost" style={{fontSize:11,padding:"7px 12px",color:"var(--ink3)"}} onClick={logout}>Sign out</button>
            </div>
          )}
        </nav>
      </header>

      <main style={{maxWidth:1060,margin:"0 auto",padding:"52px 24px 100px"}}>
        {view==="home"        && <HomeView    setView={setView} inventory={inventory} sellers={sellers} session={session} openAuth={openAuth}/>}
        {view==="search"      && <SearchView  inventory={inventory}/>}
        {view==="request"     && <RequestView inventory={inventory} requests={requests} saveRequests={saveReqs} session={session} openAuth={openAuth} toast={showToast}/>}
        {view==="auth-svc"    && <AuthSvcView requests={requests} saveRequests={saveReqs} session={session} openAuth={openAuth} toast={showToast}/>}
        {view==="market"      && <MarketView  sellers={sellers} listings={listings} saveSellers={saveSel} saveListings={saveLst} session={session} openAuth={openAuth} toast={showToast}/>}
        {view==="track"       && <TrackView   requests={requests} session={session}/>}
        {view==="seller-dash" && isSeller && <SellerDash session={session} sellers={sellers} saveSellers={saveSel} listings={listings} saveListings={saveLst} toast={showToast}/>}
        {view==="admin"       && isAdmin  && <AdminView  inventory={inventory} saveInventory={saveInv} requests={requests} saveRequests={saveReqs} sellers={sellers} saveSellers={saveSel} listings={listings} saveListings={saveLst} users={users} saveUsers={v=>{setUsers(v);persist(SK.users,v);}} toast={showToast}/>}
        {view==="admin"       && !isAdmin && <AccessDenied openAuth={()=>openAuth("admin")}/>}
        {view==="seller-dash" && !isSeller && <AccessDenied openAuth={()=>openAuth("seller")}/>}
      </main>

      <footer style={{background:"#1A1612",padding:"28px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <Logo size="sm" light/>
        <div style={{textAlign:"right"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#D4A017",letterSpacing:"0.2em",marginBottom:4}}>HMT · ALLWYN · RICOH</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",letterSpacing:"0.1em"}}>@THEHOROLOGICALCATALOG · DELHI · 2024</div>
        </div>
      </footer>
    </div>
  );
}

// ─── Access Denied ────────────────────────────────────────────────────────────
function AccessDenied({ openAuth }) {
  return (
    <div style={{textAlign:"center",padding:"80px 0"}}>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:900,marginBottom:12}}>⊘</div>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,marginBottom:8}}>Access restricted.</div>
      <p style={{color:"var(--ink3)",marginBottom:24}}>You need to sign in with the right role to view this page.</p>
      <button className="btn-ink" onClick={openAuth}>Sign in →</button>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeView({ setView, inventory, sellers, session, openAuth }) {
  const avail = inventory.filter(w=>w.available).length;
  return (
    <div className="fade-in">
      <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:56,alignItems:"center",marginBottom:72}}>
        <div>
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            <span className="tag">Vintage Indian Watches</span>
            <span className="tag tag-grn">{avail} in stock</span>
            <span className="tag tag-gold">✦ {sellers.filter(s=>s.verified).length} Verified Sellers</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:58,fontWeight:900,lineHeight:1.04,marginBottom:22,letterSpacing:"-0.025em"}}>
            Your nani's<br/>watch deserves<br/><em style={{color:"#B8860B"}}>your wrist.</em>
          </h1>
          <p style={{fontSize:15,color:"#4A423A",lineHeight:1.75,maxWidth:420,marginBottom:36}}>
            We source, verify and authenticate HMT, Allwyn and Ricoh timepieces. India's horological heritage — curated for those who get it.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn-ink" style={{fontSize:14}} onClick={()=>setView("request")}>Request a watch — ₹99 →</button>
            <button className="btn-ghost" style={{fontSize:14}} onClick={()=>setView("market")}>Trusted Sellers</button>
            {!session && <button className="btn-ghost" style={{fontSize:14,borderColor:"var(--gbd)",color:"var(--gold)"}} onClick={()=>openAuth("seller")}>List your watch</button>}
          </div>
        </div>
        {/* Watch illustration */}
        <div style={{display:"flex",justifyContent:"center"}}>
          <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
            <rect x="93" y="8"   width="84" height="52" rx="7" fill="#C8BFB0"/>
            <rect x="103" y="8" width="64" height="47" rx="5" fill="#B8A898"/>
            <rect x="93" y="260" width="84" height="52" rx="7" fill="#C8BFB0"/>
            <rect x="103" y="265" width="64" height="47" rx="5" fill="#B8A898"/>
            <rect x="128" y="289" width="22" height="10" rx="2" fill="#8A7E74"/>
            <rect x="252" y="140" width="16" height="20" rx="3" fill="#B8860B"/>
            <circle cx="140" cy="160" r="114" fill="#2A2420"/>
            <circle cx="140" cy="160" r="108" fill="#1A1612"/>
            <circle cx="140" cy="160" r="102" fill="#F4EFE6"/>
            <circle cx="140" cy="160" r="98" stroke="#B8860B" strokeWidth="0.75" fill="none"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((d,i)=>{
              const r=(d-90)*Math.PI/180,maj=i%3===0,r1=96,r2=maj?86:91;
              return <line key={d} x1={140+r1*Math.cos(r)} y1={160+r1*Math.sin(r)} x2={140+r2*Math.cos(r)} y2={160+r2*Math.sin(r)} stroke="#1A1612" strokeWidth={maj?2.5:1.2}/>;
            })}
            <text x="140" y="126" textAnchor="middle" fill="#1A1612" fontFamily="'Playfair Display',serif" fontSize="15" fontWeight="900" letterSpacing="4">HMT</text>
            <text x="140" y="142" textAnchor="middle" fill="#8A7E74" fontFamily="'DM Mono',monospace" fontSize="7" letterSpacing="2.5">PILOT</text>
            <line x1="140" y1="160" x2="140" y2="88"  stroke="#1A1612" strokeWidth="4.5" strokeLinecap="round"/>
            <line x1="140" y1="160" x2="192" y2="124" stroke="#1A1612" strokeWidth="3"   strokeLinecap="round"/>
            <line x1="140" y1="160" x2="134" y2="196" stroke="#B8860B" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="140" cy="160" r="5" fill="#1A1612"/>
            <circle cx="140" cy="160" r="2.5" fill="#B8860B"/>
          </svg>
        </div>
      </div>

      {/* Brand strip */}
      <div style={{background:"#1A1612",borderRadius:8,padding:"24px 32px",marginBottom:52,display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:24}}>
        {[{n:"HMT",s:"Est. 1961 · Bangalore",b:"The OG"},{n:"Allwyn",s:"Hyderabad · 1942–98",b:"Slept on"},{n:"Ricoh",s:"Japan × India · 70s–80s",b:"Rare find"}].map(b=>(
          <div key={b.n} style={{textAlign:"center"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#D4A017",letterSpacing:"0.18em",marginBottom:4}}>{b.b.toUpperCase()}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:"#F4EFE6"}}>{b.n}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",letterSpacing:"0.1em",marginTop:3}}>{b.s}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <span className="sl">Services</span>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:52}}>
        {[
          {n:"01",t:"Source It",p:"₹99",b:"You describe, we hunt. Token fee locks in your request. 7–14 days.",v:"request",c:"#1A1612"},
          {n:"02",t:"Authenticate",p:"₹300",b:"Picked up something dodgy? We tell you if it's real. Certificate.",v:"auth-svc",c:"#B8860B"},
          {n:"03",t:"Browse",p:"Free",b:"Pre-sourced, verified stock. Condition reports, no gatekeeping.",v:"search",c:"#2E7D52"},
          {n:"04",t:"Sell",p:"Free",b:"List on our marketplace. Get verified. Build a reputation.",v:"market",c:"#3730A3"},
        ].map(s=>(
          <div key={s.n} className="card" style={{position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-10,right:6,fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:900,color:s.c,opacity:.06,lineHeight:1,pointerEvents:"none"}}>{s.n}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:s.c,letterSpacing:"0.16em",marginBottom:8}}>{s.n} / {s.p}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:8}}>{s.t}</div>
            <p style={{fontSize:12.5,color:"#4A423A",lineHeight:1.65,marginBottom:18}}>{s.b}</p>
            <button className="btn-ghost" style={{fontSize:12,padding:"7px 14px"}} onClick={()=>setView(s.v)}>Go →</button>
          </div>
        ))}
      </div>

      {/* Featured sellers */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
        <div><span className="sl">Trusted Sellers</span><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700}}>People who know their watches.</h3></div>
        <button className="btn-ghost" style={{fontSize:12}} onClick={()=>setView("market")}>All sellers →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:14,marginBottom:52}}>
        {sellers.filter(s=>s.verified).slice(0,3).map(s=><SellerCard key={s.id} seller={s}/>)}
      </div>

      {/* Recent inventory */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
        <div><span className="sl">Just dropped</span><h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700}}>Available now.</h3></div>
        <button className="btn-ghost" style={{fontSize:12}} onClick={()=>setView("search")}>View all →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {inventory.filter(w=>w.available).slice(0,4).map(w=><WatchCard key={w.id} watch={w}/>)}
      </div>
    </div>
  );
}

// ─── Watch Card ───────────────────────────────────────────────────────────────
function WatchCard({ watch:w, sellerName, sellerVerified }) {
  return (
    <div className="card fade-in" style={{opacity:w.available?1:.55}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",letterSpacing:"0.15em",marginBottom:4,textTransform:"uppercase"}}>{w.brand} · {w.decade}</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,lineHeight:1.1}}>{w.model}</div>
          <div style={{fontSize:9.5,color:"#8A7E74",fontFamily:"'DM Mono',monospace",marginTop:2}}>Ref. {w.reference}</div>
        </div>
        <span className={`tag ${w.available?"tag-grn":"tag-red"}`}>{w.available?"Available":"Sold"}</span>
      </div>
      <p style={{fontSize:12.5,color:"#4A423A",lineHeight:1.65,marginBottom:14}}>{w.description}</p>
      {sellerName && (
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:12,padding:"8px 12px",background:"var(--bg2)",borderRadius:4}}>
          <span style={{fontSize:12,color:"#4A423A"}}>By <strong>{sellerName}</strong></span>
          {sellerVerified && <span className="vbadge">✦ Verified</span>}
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#B8860B"}}>₹{w.price.toLocaleString("en-IN")}</div>
        <span className="tag">{w.condition}</span>
      </div>
    </div>
  );
}

// ─── Seller Card ──────────────────────────────────────────────────────────────
function SellerCard({ seller:s, onClick }) {
  const stars="★".repeat(Math.round(s.rating||0))+"☆".repeat(5-Math.round(s.rating||0));
  return (
    <div className="card" onClick={onClick} style={{cursor:onClick?"pointer":"default"}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
        <div className="avatar">{s.avatar}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:3}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:700}}>{s.name}</div>
            {s.verified && <span className="vbadge" style={s.badge==="Top Seller"?{background:"#FFF0F5",borderColor:"#F4AACA",color:"#9B2C5C"}:{}}>✦ {s.badge||"Verified"}</span>}
          </div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:"#8A7E74"}}>{s.handle} · {s.city}</div>
        </div>
      </div>
      <p style={{fontSize:12.5,color:"#4A423A",lineHeight:1.6,marginBottom:12}}>{s.bio}</p>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><span style={{color:"#B8860B",fontSize:13}}>{stars}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",marginLeft:6}}>{s.rating} ({s.reviewCount})</span></div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>{s.sales} sales</span>
      </div>
    </div>
  );
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function SearchView({ inventory }) {
  const [q,setQ]     = useState("");
  const [load,setL]  = useState(false);
  const [res,setRes] = useState(null);
  const [mat,setMat] = useState(null);
  const [filt,setF]  = useState("All");

  const doSearch = async () => {
    if (!q.trim()) return;
    setL(true); setRes(null); setMat(null);
    const r = await aiSearch(q,inventory);
    setRes(r); setMat(inventory.filter(w=>r.matchedIds?.includes(w.id)));
    setL(false);
  };

  const shown = res?(mat||[]):inventory.filter(w=>filt==="All"||w.brand===filt);

  return (
    <div className="fade-in">
      <div style={{marginBottom:32}}><span className="sl">AI Search</span><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,letterSpacing:"-0.025em"}}>Find your watch.</h2></div>
      <div style={{display:"flex",gap:10,marginBottom:28}}>
        <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="HMT Pilot black dial 70s under ₹3k  ·  Allwyn quartz date  ·  Ricoh auto deadstock" style={{flex:1}}/>
        <button className="btn-ink" onClick={doSearch} disabled={load} style={{minWidth:100,whiteSpace:"nowrap"}}>{load?"Scanning…":"Search →"}</button>
      </div>
      {load && <div style={{textAlign:"center",padding:48,fontFamily:"'DM Mono',monospace",fontSize:11,color:"#8A7E74",letterSpacing:"0.2em"}}>SEARCHING…</div>}
      {res && (
        <div style={{background:"#fff",border:"1.5px solid var(--bd)",borderLeft:"4px solid var(--gold)",borderRadius:6,padding:18,marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span className="sl" style={{marginBottom:0}}>AI Match</span><span className={`tag ${res.confidence==="high"?"tag-grn":res.confidence==="medium"?"tag-gold":"tag-red"}`}>{res.confidence?.toUpperCase()}</span></div>
          <p style={{fontSize:14,lineHeight:1.7,marginBottom:res.sourcing_note?10:0}}>{res.summary}</p>
          {res.sourcing_note && <p style={{fontSize:12,color:"#8A7E74",fontStyle:"italic",borderTop:"1px solid #EAE3D8",paddingTop:8,marginTop:8}}>Sourcing: {res.sourcing_note}</p>}
        </div>
      )}
      {!res && (
        <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
          {["All","HMT","Allwyn","Ricoh"].map(b=>(
            <button key={b} onClick={()=>setF(b)} style={{background:filt===b?"#1A1612":"#fff",color:filt===b?"#F4EFE6":"#4A423A",border:"1.5px solid",borderColor:filt===b?"#1A1612":"var(--bd)",padding:"7px 18px",fontSize:12,borderRadius:4}}>{b}</button>
          ))}
          <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#8A7E74",alignSelf:"center"}}>{shown.filter(w=>w.available).length} available</span>
        </div>
      )}
      {shown.length>0
        ?<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(252px,1fr))",gap:14}}>{shown.map(w=><WatchCard key={w.id} watch={w}/>)}</div>
        :!load&&<div style={{textAlign:"center",padding:56,fontFamily:"'DM Mono',monospace",fontSize:12,color:"#8A7E74"}}>No match — request it and we'll source it.</div>}
    </div>
  );
}

// ─── REQUEST ──────────────────────────────────────────────────────────────────
function RequestView({ inventory, requests, saveRequests, session, openAuth, toast }) {
  const [step,setStep]     = useState(1);
  const [form,setForm]     = useState({name:session?.user?.name||"",email:session?.user?.email||"",phone:session?.user?.phone||"",brand:"",model:"",decade:"",condition:"",budget:"",notes:"",addAuth:false});
  const [aiRes,setAiRes]   = useState(null);
  const [loading,setLoad]  = useState(false);
  const [showUPI,setShowUPI] = useState(false);
  const [oid,setOid]       = useState(null);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));

  const check = async () => {
    if(!form.brand||!form.model){toast("Brand and model required.");return;}
    setLoad(true);
    try{setAiRes(await aiSearch(`${form.brand} ${form.model} ${form.decade} ${form.condition} ₹${form.budget}`,inventory));}
    catch{setAiRes({matchedIds:[],summary:"We'll source this.",sourcing_note:"",confidence:"low"});}
    setLoad(false); setStep(2);
  };

  const handlePaySuccess = (txnId) => {
    const id="THC-"+Date.now().toString(36).toUpperCase(), amt=99+(form.addAuth?300:0);
    saveRequests([...requests,{id,...form,watch:`${form.brand} ${form.model}`,amount:amt,txnId,status:"Received",createdAt:new Date().toISOString(),userId:session?.user?.id||null,aiMatchedIds:aiRes?.matchedIds||[],aiSummary:aiRes?.summary||"",updates:[{date:new Date().toISOString(),note:"Payment confirmed. Request received."}]}]);
    setShowUPI(false); setOid(id); setStep(4); toast("You're in — "+id);
  };

  const amt = 99+(form.addAuth?300:0);

  return (
    <div className="fade-in">
      {showUPI && <UPIModal amount={amt} purpose={`Sourcing: ${form.brand} ${form.model}`} onSuccess={handlePaySuccess} onClose={()=>setShowUPI(false)}/>}

      <div style={{marginBottom:32}}>
        <span className="sl">Watch Sourcing</span>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,letterSpacing:"-0.025em",marginBottom:6}}>Tell us what you want.</h2>
        <p style={{color:"#4A423A",fontSize:14}}>₹99 non-refundable · 7–14 days · We tap our network so you don't have to.</p>
      </div>

      <div style={{display:"flex",borderBottom:"1.5px solid var(--bd)",marginBottom:28}}>
        {["Details","AI Match","Payment","Done"].map((l,i)=>(
          <button key={l} className={`stab ${step===i+1?"active":step>i+1?"done":""}`}>{step>i+1?"✓ ":""}{i+1}. {l.toUpperCase()}</button>
        ))}
      </div>

      {step===1 && (
        <div className="fade-in">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="fl">Name *</label><input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Arjun Sharma"/></div>
            <div><label className="fl">Email *</label><input value={form.email} onChange={e=>f("email",e.target.value)} placeholder="arjun@email.com"/></div>
            <div><label className="fl">WhatsApp</label><input value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="+91 98xxx xxxxx"/></div>
            <div><label className="fl">Brand *</label><select value={form.brand} onChange={e=>f("brand",e.target.value)}><option value="">Select</option><option>HMT</option><option>Allwyn</option><option>Ricoh</option></select></div>
            <div><label className="fl">Model *</label><input value={form.model} onChange={e=>f("model",e.target.value)} placeholder="Pilot, Janata, Stride…"/></div>
            <div><label className="fl">Decade</label><select value={form.decade} onChange={e=>f("decade",e.target.value)}><option value="">Any era</option>{["1960s","1970s","1980s","1990s"].map(d=><option key={d}>{d}</option>)}</select></div>
            <div><label className="fl">Condition</label><select value={form.condition} onChange={e=>f("condition",e.target.value)}><option value="">Any</option>{["Mint / NOS","Excellent","Good","Fair"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="fl">Budget ₹</label><input value={form.budget} onChange={e=>f("budget",e.target.value)} placeholder="e.g. 2500"/></div>
          </div>
          <div style={{marginBottom:14}}><label className="fl">Notes</label><textarea value={form.notes} onChange={e=>f("notes",e.target.value)} rows={3} placeholder="Original crown? Specific dial? Exhibition caseback?"/></div>
          <div style={{background:"var(--gbg)",border:"1.5px solid var(--gbd)",borderRadius:6,padding:16,marginBottom:24,display:"flex",gap:12,alignItems:"flex-start"}}>
            <input type="checkbox" id="addA" checked={form.addAuth} onChange={e=>f("addAuth",e.target.checked)} style={{width:"auto",marginTop:3,accentColor:"#B8860B"}}/>
            <label htmlFor="addA" style={{cursor:"pointer"}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:2}}>Add Authenticity Check <span style={{color:"#B8860B"}}>+₹300</span></div>
              <div style={{fontSize:12,color:"#8A7E74",lineHeight:1.6}}>Dial, hands, movement, case verified. Certificate included.</div>
            </label>
          </div>
          <button className="btn-ink" onClick={check} disabled={loading}>{loading?"Checking inventory…":"Check availability →"}</button>
        </div>
      )}

      {step===2 && aiRes && (
        <div className="fade-in">
          <div style={{background:"#fff",border:"1.5px solid var(--bd)",borderLeft:"4px solid var(--gold)",borderRadius:6,padding:20,marginBottom:20}}>
            <span className="sl">AI Check</span>
            <p style={{fontSize:14,lineHeight:1.7}}>{aiRes.summary}</p>
            {aiRes.sourcing_note && <p style={{fontSize:12,color:"#8A7E74",fontStyle:"italic",borderTop:"1px solid #EAE3D8",paddingTop:8,marginTop:8}}>Sourcing: {aiRes.sourcing_note}</p>}
          </div>
          <div style={{background:"#fff",border:"1.5px solid var(--bd)",borderRadius:6,padding:20,marginBottom:20}}>
            {[["Watch",`${form.brand} ${form.model}${form.decade?" · "+form.decade:""}`],["Sourcing fee","₹99 (non-refundable)"],...(form.addAuth?[["Auth check","₹300"]]:[])]
              .map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:12,marginBottom:10,color:"#4A423A"}}><span style={{color:"#8A7E74"}}>{k}</span><span>{v}</span></div>))}
            <div style={{borderTop:"1.5px solid #EAE3D8",paddingTop:12,display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:15}}><span>Total</span><span style={{color:"#B8860B"}}>₹{amt}</span></div>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button className="btn-ghost" onClick={()=>setStep(1)}>← Edit</button>
            <button className="btn-gold"  onClick={()=>setStep(3)}>To payment →</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="fade-in">
          <div style={{background:"#fff",border:"1.5px solid var(--bd)",borderRadius:8,padding:32,maxWidth:400}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,marginBottom:20}}>Payment</div>
            <div style={{background:"var(--bg2)",border:"1.5px solid var(--bd)",borderRadius:6,padding:20,textAlign:"center",marginBottom:24}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",letterSpacing:"0.2em",marginBottom:8}}>TOTAL DUE</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:900,color:"#B8860B",lineHeight:1}}>₹{amt}</div>
              <div style={{fontSize:11,color:"#8A7E74",marginTop:8}}>Non-refundable{form.addAuth?" · auth check included":""}</div>
            </div>
            <button className="btn-gold" style={{width:"100%",padding:14,fontSize:15,marginBottom:10}} onClick={()=>setShowUPI(true)}>
              Pay via UPI →
            </button>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:8}}>
              {["GPay","PhonePe","Paytm","BHIM"].map(app=>(
                <span key={app} style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",background:"var(--bg2)",padding:"3px 8px",borderRadius:3}}>{app}</span>
              ))}
            </div>
            <button className="btn-ghost" style={{width:"100%",marginTop:12}} onClick={()=>setStep(2)}>← Back</button>
          </div>
        </div>
      )}

      {step===4 && oid && (
        <div className="fade-in" style={{textAlign:"center",padding:"64px 0"}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:64,fontWeight:900,color:"var(--grn)",lineHeight:1,marginBottom:8}}>✓</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:42,fontWeight:900,marginBottom:8,letterSpacing:"-0.02em"}}>You're in.</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#B8860B",letterSpacing:"0.2em",marginBottom:24}}>{oid}</div>
          <p style={{color:"#4A423A",fontSize:14,maxWidth:440,margin:"0 auto",lineHeight:1.75}}>We'll WhatsApp or email within 2–3 working days with an update on your {form.brand} {form.model}. Screenshot your ID.</p>
        </div>
      )}
    </div>
  );
}

// ─── AUTH SERVICE ─────────────────────────────────────────────────────────────
function AuthSvcView({ requests, saveRequests, session, openAuth, toast }) {
  const [form,setForm] = useState({name:session?.user?.name||"",email:session?.user?.email||"",phone:"",watchDesc:"",notes:""});
  const [done,setDone] = useState(false);
  const [oid,setOid]   = useState("");
  const [showUPI,setUPI] = useState(false);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));

  const handlePay = () => { if(!form.name||!form.email||!form.watchDesc){toast("Fill required fields.");return;} setUPI(true); };
  const handlePaySuccess = (txnId) => {
    const id="AUTH-"+Date.now().toString(36).toUpperCase();
    saveRequests([...requests,{id,...form,watch:form.watchDesc,type:"auth",amount:300,txnId,status:"Awaiting Photos",createdAt:new Date().toISOString(),userId:session?.user?.id||null,updates:[{date:new Date().toISOString(),note:"Auth request received. Payment confirmed."}]}]);
    setUPI(false); setOid(id); setDone(true); toast("Submitted — "+id);
  };

  return (
    <div className="fade-in">
      {showUPI && <UPIModal amount={300} purpose="Authenticity Check" onSuccess={handlePaySuccess} onClose={()=>setUPI(false)}/>}
      <div style={{marginBottom:32}}><span className="sl">Authenticity Service</span>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,letterSpacing:"-0.025em",marginBottom:8}}>Real or not?<br/><em style={{color:"#B8860B"}}>We'll tell you.</em></h2>
        <p style={{color:"#4A423A",fontSize:14,maxWidth:520,lineHeight:1.75}}>Send photos, we examine everything. Certificate in 3–5 days. <strong>₹300.</strong></p>
      </div>
      {!done ? (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="fl">Name *</label><input value={form.name} onChange={e=>f("name",e.target.value)} placeholder="Your name"/></div>
            <div><label className="fl">Email *</label><input value={form.email} onChange={e=>f("email",e.target.value)} placeholder="your@email.com"/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">WhatsApp</label><input value={form.phone} onChange={e=>f("phone",e.target.value)} placeholder="+91 98xxx xxxxx"/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">Watch *</label><input value={form.watchDesc} onChange={e=>f("watchDesc",e.target.value)} placeholder="HMT Pilot black dial · Allwyn Challenge · be specific"/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">Doubts / backstory</label><textarea value={form.notes} onChange={e=>f("notes",e.target.value)} rows={3} placeholder="Where from? What's suspicious? Serial number?"/></div>
          </div>
          <button className="btn-gold" onClick={handlePay}>Pay ₹300 via UPI & Submit →</button>
        </>
      ) : (
        <div style={{textAlign:"center",padding:"64px 0"}}>
          <div style={{fontSize:52,color:"var(--grn)",fontWeight:900,lineHeight:1,marginBottom:12}}>◈</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:900,marginBottom:8}}>Request logged.</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#B8860B",letterSpacing:"0.2em",marginBottom:20}}>{oid}</div>
          <p style={{color:"#4A423A",fontSize:14,maxWidth:440,margin:"0 auto",lineHeight:1.75}}>WhatsApp within 24h with photo upload link. Certificate in 3–5 days.</p>
        </div>
      )}
    </div>
  );
}

// ─── TRACK ────────────────────────────────────────────────────────────────────
function TrackView({ requests, session }) {
  const [id,setId] = useState("");
  const [found,setF] = useState(null);
  const [done,setD]  = useState(false);
  const sc={Received:"#B8860B","Awaiting Photos":"#B8860B",Searching:"#3730A3","Match Found":"#2E7D52",Dispatched:"#2E7D52",Completed:"#2E7D52","Not Found":"#C0392B"};

  // Auto-show user's own orders
  const myOrders = session?.user ? requests.filter(r=>r.userId===session.user.id) : [];

  const track = () => { setD(true); setF(requests.find(r=>r.id===id.trim().toUpperCase())||null); };

  return (
    <div className="fade-in">
      <div style={{marginBottom:32}}><span className="sl">Order Tracking</span><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,letterSpacing:"-0.025em"}}>Where's my watch?</h2></div>
      <div style={{display:"flex",gap:10,marginBottom:28}}>
        <input value={id} onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&track()} placeholder="THC-XXXXX or AUTH-XXXXX" style={{fontFamily:"'DM Mono',monospace",letterSpacing:"0.06em"}}/>
        <button className="btn-ink" onClick={track}>Track</button>
      </div>
      {done && !found && <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--red)",marginBottom:24}}>No order found. Check your ID.</div>}
      {found && (
        <div className="card fade-in" style={{marginBottom:28}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",letterSpacing:"0.15em",marginBottom:5}}>{found.id} · {found.type==="auth"?"AUTH":"SOURCING"} · ₹{found.amount}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700}}>{found.watch}</div>
              <div style={{fontSize:13,color:"#4A423A",marginTop:4}}>{found.name} · {found.email}</div>
            </div>
            <span className="tag" style={{background:(sc[found.status]||"#8A7E74")+"18",borderColor:(sc[found.status]||"#8A7E74")+"55",color:sc[found.status]||"#8A7E74"}}>{found.status}</span>
          </div>
          <div className="divider" style={{margin:"14px 0"}}/>
          <span className="sl">Activity</span>
          {found.updates?.map((u,i)=>(
            <div key={i} style={{display:"flex",gap:16,marginBottom:10,fontSize:13}}>
              <div style={{fontFamily:"'DM Mono',monospace",color:"#8A7E74",fontSize:10,whiteSpace:"nowrap",marginTop:2}}>{new Date(u.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</div>
              <div style={{color:"#4A423A"}}>{u.note}</div>
            </div>
          ))}
          {found.txnId && <div style={{marginTop:12,fontFamily:"'DM Mono',monospace",fontSize:11,color:"#8A7E74"}}>UTR: {found.txnId}</div>}
        </div>
      )}

      {myOrders.length>0 && (
        <>
          <div className="divider"/>
          <span className="sl">Your Orders</span>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {myOrders.map(r=>(
              <div key={r.id} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px"}}>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",marginBottom:3}}>{r.id}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700}}>{r.watch}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <span className="tag" style={{background:(sc[r.status]||"#8A7E74")+"18",borderColor:(sc[r.status]||"#8A7E74")+"55",color:sc[r.status]||"#8A7E74",marginBottom:4,display:"inline-block"}}>{r.status}</span>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",marginTop:4}}>₹{r.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
function MarketView({ sellers, listings, saveSellers, saveListings, session, openAuth, toast }) {
  const [tab,setTab]     = useState("browse");
  const [filt,setFilt]   = useState("all");
  const [selSel,setSelSel] = useState(null);
  const [lf,setLF]       = useState({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:"",tags:""});
  const [sf,setSF]       = useState({name:"",handle:"",city:"",bio:"",email:"",instagram:""});
  const [appDone,setAD]  = useState(false);
  const [showUPI,setUPI] = useState(false);
  const lu=(k,v)=>setLF(p=>({...p,[k]:v}));
  const su=(k,v)=>setSF(p=>({...p,[k]:v}));

  const getBySeller = id => sellers.find(s=>s.id===id);
  const shown = listings.filter(l=>filt==="all"||getBySeller(l.sellerId)?.verified);
  const mySellerId = session?.user?.sellerId;
  const mySeller = sellers.find(s=>s.id===mySellerId);

  const submitListing = () => {
    if(!lf.brand||!lf.model||!lf.price){toast("Brand, model, price required.");return;}
    saveListings([...listings,{...lf,id:"l"+Date.now(),sellerId:mySellerId||"pending",verified:false,createdAt:new Date().toISOString(),price:parseInt(lf.price)}]);
    setLF({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:"",tags:""});
    toast("Listing submitted for review."); setTab("browse");
  };

  const handleApplySuccess = () => {
    if(!sf.name||!sf.email){toast("Name and email required.");return;}
    const av=(sf.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2));
    saveSellers([...sellers,{...sf,id:"s"+Date.now(),verified:false,rating:0,reviewCount:0,joinDate:new Date().toISOString().slice(0,7),sales:0,badge:null,avatar:av}]);
    setAD(true); toast("Application received!");
  };

  return (
    <div className="fade-in">
      <div style={{marginBottom:32}}>
        <span className="sl">Trusted Seller Marketplace</span>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:40,fontWeight:900,letterSpacing:"-0.025em",marginBottom:8}}>Buy from people<br/><em style={{color:"#B8860B"}}>who actually know.</em></h2>
        <p style={{color:"#4A423A",fontSize:14,maxWidth:520,lineHeight:1.7}}>Every seller reviewed before verification. Real ratings from real buyers.</p>
      </div>

      {/* Trust bar */}
      <div style={{display:"flex",gap:20,marginBottom:28,padding:"14px 20px",background:"#fff",border:"1.5px solid var(--bd)",borderRadius:6,flexWrap:"wrap"}}>
        {[{icon:"✦",l:`${sellers.filter(s=>s.verified).length} Verified Sellers`,c:"#B8860B"},{icon:"★",l:`${(sellers.filter(s=>s.rating>0).reduce((a,s)=>a+s.rating,0)/Math.max(sellers.filter(s=>s.rating>0).length,1)).toFixed(1)} Avg Rating`,c:"#B8860B"},{icon:"◉",l:`${listings.filter(l=>l.verified).length} Verified Listings`,c:"#2E7D52"},{icon:"⊕",l:"Verified = 30 days + 5 sales",c:"#3730A3"}].map(item=>(
          <div key={item.l} style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{color:item.c,fontSize:14}}>{item.icon}</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#4A423A"}}>{item.l}</span>
          </div>
        ))}
      </div>

      <div style={{display:"flex",borderBottom:"1.5px solid var(--bd)",marginBottom:24}}>
        {[["browse","Browse"],["sellers","Sellers"],["sell","List a Watch"],["apply","Become a Seller"]].map(([t,l])=>(
          <button key={t} className={`stab ${tab===t?"active":""}`} onClick={()=>{setTab(t);setSelSel(null);}}>{l.toUpperCase()}</button>
        ))}
      </div>

      {tab==="browse" && (
        <div>
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
            {[["all","All"],["verified","Verified only"]].map(([f2,l])=>(
              <button key={f2} onClick={()=>setFilt(f2)} style={{background:filt===f2?"#1A1612":"#fff",color:filt===f2?"#F4EFE6":"#4A423A",border:"1.5px solid",borderColor:filt===f2?"#1A1612":"var(--bd)",padding:"7px 16px",fontSize:12,borderRadius:4}}>{l}</button>
            ))}
            <span style={{marginLeft:"auto",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#8A7E74"}}>{shown.length} listings</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(258px,1fr))",gap:14}}>
            {shown.map(l=>{
              const sel=getBySeller(l.sellerId);
              return (
                <div key={l.id} className="card" style={{position:"relative"}}>
                  {l.verified && <div style={{position:"absolute",top:14,right:14}}><span className="tag tag-gold">✦ Verified</span></div>}
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:3}}>{l.brand} · {l.decade}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,marginBottom:2}}>{l.model}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",marginBottom:10}}>Ref. {l.reference}</div>
                  <p style={{fontSize:12.5,color:"#4A423A",lineHeight:1.65,marginBottom:14}}>{l.description}</p>
                  {sel && (
                    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"var(--bg2)",borderRadius:4,marginBottom:12}}>
                      <div className="avatar" style={{width:26,height:26,fontSize:10}}>{sel.avatar}</div>
                      <div><div style={{fontSize:12,fontWeight:500}}>{sel.name}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>★ {sel.rating} · {sel.city}</div></div>
                      {sel.verified && <span className="vbadge" style={{marginLeft:"auto"}}>✦</span>}
                    </div>
                  )}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#B8860B"}}>₹{l.price?.toLocaleString("en-IN")}</div>
                    <span className="tag">{l.condition}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab==="sellers" && !selSel && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(238px,1fr))",gap:14}}>
          {sellers.map(s=><div key={s.id} onClick={()=>setSelSel(s)}><SellerCard seller={s} onClick={()=>setSelSel(s)}/></div>)}
        </div>
      )}

      {tab==="sellers" && selSel && (
        <div className="fade-in">
          <button className="btn-ghost" style={{fontSize:12,marginBottom:20}} onClick={()=>setSelSel(null)}>← All Sellers</button>
          <div className="card" style={{marginBottom:20}}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:16}}>
              <div className="avatar" style={{width:52,height:52,fontSize:16}}>{selSel.avatar}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700}}>{selSel.name}</div>
                  {selSel.verified && <span className="vbadge" style={selSel.badge==="Top Seller"?{background:"#FFF0F5",borderColor:"#F4AACA",color:"#9B2C5C"}:{}}>✦ {selSel.badge||"Verified"}</span>}
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",marginBottom:8}}>{selSel.handle} · {selSel.city}</div>
                <p style={{fontSize:13.5,color:"#4A423A",lineHeight:1.7,maxWidth:500}}>{selSel.bio}</p>
              </div>
            </div>
            <div className="divider" style={{margin:"14px 0"}}/>
            <div style={{display:"flex",gap:28,flexWrap:"wrap"}}>
              {[["Rating",`★ ${selSel.rating||"—"} (${selSel.reviewCount})`],["Sales",selSel.sales+" watches"],["Since",selSel.joinDate],["Status",selSel.verified?"Verified ✦":"Pending"]].map(([k,v])=>(
                <div key={k}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",textTransform:"uppercase",marginBottom:3}}>{k}</div><div style={{fontSize:14,fontWeight:500,color:k==="Status"&&selSel.verified?"#B8860B":"#1A1612"}}>{v}</div></div>
              ))}
            </div>
          </div>
          <span className="sl">Listings by {selSel.name}</span>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(258px,1fr))",gap:14}}>
            {listings.filter(l=>l.sellerId===selSel.id).map(l=>(
              <div key={l.id} className="card">
                {l.verified && <span className="tag tag-gold" style={{display:"inline-block",marginBottom:10}}>✦ Verified</span>}
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",textTransform:"uppercase",marginBottom:3}}>{l.brand} · {l.decade}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,marginBottom:8}}>{l.model}</div>
                <p style={{fontSize:12.5,color:"#4A423A",lineHeight:1.65,marginBottom:12}}>{l.description}</p>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:"#B8860B"}}>₹{l.price?.toLocaleString("en-IN")}</div>
                  <span className="tag">{l.condition}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="sell" && (
        <div style={{maxWidth:560}}>
          {!session ? (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,marginBottom:12}}>Sign in to list a watch</div>
              <p style={{color:"#4A423A",marginBottom:24,lineHeight:1.7}}>You need a seller account to create listings.</p>
              <button className="btn-ink" onClick={()=>openAuth("seller")}>Sign in as Seller →</button>
            </div>
          ) : (
            <>
              {mySeller && <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"var(--gnbg)",border:"1px solid var(--gnbd)",borderRadius:6,marginBottom:20}}>
                <div className="avatar">{mySeller.avatar}</div>
                <div><div style={{fontSize:14,fontWeight:500}}>{mySeller.name}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74"}}>{mySeller.verified?"✦ Verified seller":"Pending verification"}</div></div>
              </div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                <div><label className="fl">Brand *</label><select value={lf.brand} onChange={e=>lu("brand",e.target.value)}><option value="">Select</option><option>HMT</option><option>Allwyn</option><option>Ricoh</option></select></div>
                <div><label className="fl">Model *</label><input value={lf.model} onChange={e=>lu("model",e.target.value)} placeholder="Pilot, Stride…"/></div>
                <div><label className="fl">Reference</label><input value={lf.reference} onChange={e=>lu("reference",e.target.value)} placeholder="Ref no."/></div>
                <div><label className="fl">Decade</label><select value={lf.decade} onChange={e=>lu("decade",e.target.value)}><option value="">Any</option>{["1960s","1970s","1980s","1990s"].map(d=><option key={d}>{d}</option>)}</select></div>
                <div><label className="fl">Condition</label><select value={lf.condition} onChange={e=>lu("condition",e.target.value)}><option value="">Select</option>{["Mint","Excellent","Good","Fair"].map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label className="fl">Price ₹ *</label><input value={lf.price} onChange={e=>lu("price",e.target.value)} placeholder="2500"/></div>
                <div style={{gridColumn:"1/-1"}}><label className="fl">Description *</label><textarea value={lf.description} onChange={e=>lu("description",e.target.value)} rows={4} placeholder="Be honest. Dial, case, movement. What's original, what's not."/></div>
              </div>
              <button className="btn-ink" onClick={submitListing}>Submit listing →</button>
            </>
          )}
        </div>
      )}

      {tab==="apply" && !appDone && (
        <div style={{maxWidth:560}}>
          <div style={{marginBottom:24}}>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,marginBottom:10}}>Apply for Verified status</h3>
            <div style={{background:"#fff",border:"1.5px solid var(--bd)",borderRadius:6,padding:16,marginBottom:20}}>
              {[["01","Apply below — 2 minutes"],["02","Team reviews within 72 hours"],["03","5 sales at 4.5+ = Verified ✦ badge"],["04","25 sales at 4.8+ = Top Seller badge"]].map(([s,t])=>(
                <div key={s} style={{display:"flex",gap:12,marginBottom:10}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#B8860B",letterSpacing:"0.1em",marginTop:2,flexShrink:0}}>{s}</span><span style={{fontSize:13,color:"#4A423A"}}>{t}</span></div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="fl">Full Name *</label><input value={sf.name} onChange={e=>su("name",e.target.value)} placeholder="Arjun Sharma"/></div>
            <div><label className="fl">Email *</label><input value={sf.email} onChange={e=>su("email",e.target.value)} placeholder="arjun@email.com"/></div>
            <div><label className="fl">Handle</label><input value={sf.handle} onChange={e=>su("handle",e.target.value)} placeholder="@arjun_dials"/></div>
            <div><label className="fl">City</label><input value={sf.city} onChange={e=>su("city",e.target.value)} placeholder="Mumbai"/></div>
          </div>
          <div style={{marginBottom:18}}><label className="fl">About you *</label><textarea value={sf.bio} onChange={e=>su("bio",e.target.value)} rows={3} placeholder="How long collecting? What do you specialise in?"/></div>
          <button className="btn-ink" onClick={handleApplySuccess}>Submit application →</button>
        </div>
      )}

      {tab==="apply" && appDone && (
        <div style={{textAlign:"center",padding:"60px 0"}}>
          <div style={{fontSize:48,color:"#2E7D52",fontWeight:900,marginBottom:12}}>✦</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:900,marginBottom:8}}>Application in.</div>
          <p style={{color:"#4A423A",fontSize:14,maxWidth:420,margin:"0 auto",lineHeight:1.75}}>We review within 72 hours. Complete 5 sales at 4.5+ to earn your Verified badge.</p>
        </div>
      )}
    </div>
  );
}

// ─── SELLER DASHBOARD ─────────────────────────────────────────────────────────
function SellerDash({ session, sellers, saveSellers, listings, saveListings, toast }) {
  const mySellerId = session?.user?.sellerId;
  const mySeller   = sellers.find(s=>s.id===mySellerId);
  const myListings = listings.filter(l=>l.sellerId===mySellerId);
  const [tab,setTab] = useState("overview");
  const [lf,setLF]   = useState({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:""});
  const lu=(k,v)=>setLF(p=>({...p,[k]:v}));

  const submitListing = () => {
    if(!lf.brand||!lf.model||!lf.price){toast("Brand, model, price required.");return;}
    saveListings([...listings,{...lf,id:"l"+Date.now(),sellerId:mySellerId,verified:false,createdAt:new Date().toISOString(),price:parseInt(lf.price)}]);
    setLF({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:""});
    toast("Listing submitted for review."); setTab("listings");
  };

  return (
    <div className="fade-in">
      <div style={{marginBottom:28}}>
        <span className="sl">Seller Dashboard</span>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,letterSpacing:"-0.02em"}}>
            {mySeller?.name||session.user.name}
          </h2>
          {mySeller?.verified
            ? <span className="vbadge" style={mySeller.badge==="Top Seller"?{background:"#FFF0F5",borderColor:"#F4AACA",color:"#9B2C5C"}:{}}>✦ {mySeller.badge||"Verified"}</span>
            : <span className="tag tag-red">Pending Verification</span>}
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
        {[["Total Listings",myListings.length],["Verified",myListings.filter(l=>l.verified).length],["Sales",mySeller?.sales||0],["Rating",mySeller?.rating?`★ ${mySeller.rating}`:"—"]].map(([k,v])=>(
          <div key={k} className="card" style={{textAlign:"center",padding:"20px 16px"}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#B8860B",marginBottom:4}}>{v}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",letterSpacing:"0.1em",textTransform:"uppercase"}}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",borderBottom:"1.5px solid var(--bd)",marginBottom:24}}>
        {[["overview","Overview"],["listings","My Listings"],["add","Add Listing"]].map(([t,l])=>(
          <button key={t} className={`stab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l.toUpperCase()}</button>
        ))}
      </div>

      {tab==="overview" && (
        <div>
          {!mySeller?.verified && (
            <div style={{background:"var(--gbg)",border:"1.5px solid var(--gbd)",borderRadius:6,padding:20,marginBottom:20}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,marginBottom:8}}>Get Verified ✦</div>
              <p style={{fontSize:13.5,color:"#4A423A",lineHeight:1.7}}>Complete 5 sales at 4.5+ average rating and you'll earn the Verified badge. It appears on all your listings and boosts buyer trust significantly.</p>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {myListings.slice(0,4).map(l=>(
              <div key={l.id} className="card">
                {l.verified && <span className="tag tag-gold" style={{display:"inline-block",marginBottom:8}}>✦ Verified</span>}
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700}}>{l.brand} {l.model}</div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",marginBottom:8}}>{l.decade} · {l.condition}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#B8860B"}}>₹{l.price?.toLocaleString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="listings" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:14}}>
          {myListings.length===0 && <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#8A7E74",padding:20}}>No listings yet.</div>}
          {myListings.map(l=>(
            <div key={l.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700}}>{l.brand} {l.model}</div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>{l.decade} · Ref. {l.reference}</div>
                </div>
                <span className={`tag ${l.verified?"tag-gold":"tag-red"}`}>{l.verified?"✦ Live":"Pending"}</span>
              </div>
              <p style={{fontSize:12,color:"#4A423A",lineHeight:1.6,marginBottom:12}}>{l.description}</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#B8860B"}}>₹{l.price?.toLocaleString("en-IN")}</div>
                <button className="btn-ghost" style={{fontSize:11,padding:"6px 12px",color:"var(--red)",borderColor:"var(--rbd)"}} onClick={()=>{saveListings(listings.filter(x=>x.id!==l.id));toast("Removed.");}}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="add" && (
        <div style={{maxWidth:540}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="fl">Brand *</label><select value={lf.brand} onChange={e=>lu("brand",e.target.value)}><option value="">Select</option><option>HMT</option><option>Allwyn</option><option>Ricoh</option></select></div>
            <div><label className="fl">Model *</label><input value={lf.model} onChange={e=>lu("model",e.target.value)} placeholder="Pilot, Stride…"/></div>
            <div><label className="fl">Reference</label><input value={lf.reference} onChange={e=>lu("reference",e.target.value)} placeholder="Ref no."/></div>
            <div><label className="fl">Decade</label><select value={lf.decade} onChange={e=>lu("decade",e.target.value)}><option value="">Any</option>{["1960s","1970s","1980s","1990s"].map(d=><option key={d}>{d}</option>)}</select></div>
            <div><label className="fl">Condition</label><select value={lf.condition} onChange={e=>lu("condition",e.target.value)}><option value="">Select</option>{["Mint","Excellent","Good","Fair"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="fl">Price ₹ *</label><input value={lf.price} onChange={e=>lu("price",e.target.value)} placeholder="2500"/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">Description *</label><textarea value={lf.description} onChange={e=>lu("description",e.target.value)} rows={4} placeholder="Honest condition report. Dial, hands, case, movement."/></div>
          </div>
          <button className="btn-ink" onClick={submitListing}>Submit listing →</button>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN ─────────────────────────────────────────────────────────────────────
function AdminView({ inventory, saveInventory, requests, saveRequests, sellers, saveSellers, listings, saveListings, users, saveUsers, toast }) {
  const [tab,setTab]   = useState("requests");
  const [nw,setNw]     = useState({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:"",tags:"",available:true});
  const [sel,setSel]   = useState({});
  const [note,setNote] = useState({});
  const uNw=(k,v)=>setNw(p=>({...p,[k]:v}));
  const STATUSES=["Received","Awaiting Photos","Searching","Match Found","Dispatched","Completed","Not Found"];

  const updateStatus = rid => {
    if(!sel[rid])return;
    saveRequests(requests.map(r=>r.id!==rid?r:{...r,status:sel[rid],updates:[...(r.updates||[]),{date:new Date().toISOString(),note:note[rid]||`Status: ${sel[rid]}`}]}));
    setSel(p=>({...p,[rid]:""})); setNote(p=>({...p,[rid]:""})); toast("Updated.");
  };

  const TABS=[["requests","Requests"],["inventory","Inventory"],["sellers","Sellers"],["listings","Listings"],["users","Users"],["add","Add Watch"]];

  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20}}>
        <div><span className="sl">Admin Panel</span><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:32,fontWeight:900,letterSpacing:"-0.02em"}}>The Horological Catalog</h2></div>
        <div style={{display:"flex",gap:8}}>
          <span className="tag">{requests.length} req</span>
          <span className="tag tag-grn">{inventory.filter(w=>w.available).length} stock</span>
          <span className="tag tag-gold">{sellers.filter(s=>s.verified).length} verified</span>
          <span className="tag tag-blu">{users.length} users</span>
        </div>
      </div>

      <div style={{display:"flex",borderBottom:"1.5px solid var(--bd)",marginBottom:22,flexWrap:"wrap"}}>
        {TABS.map(([t,l])=>(
          <button key={t} className={`stab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l.toUpperCase()}</button>
        ))}
      </div>

      {tab==="requests" && (
        <div>
          {requests.length===0 && <div style={{textAlign:"center",padding:48,fontFamily:"'DM Mono',monospace",fontSize:12,color:"#8A7E74"}}>No requests.</div>}
          {[...requests].reverse().map(r=>(
            <div key={r.id} className="card" style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74",letterSpacing:"0.12em",marginBottom:4}}>{r.id} · {r.type==="auth"?"AUTH":"SOURCING"} · ₹{r.amount}{r.txnId?` · UTR:${r.txnId}`:""}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{r.watch}</div>
                  <div style={{fontSize:12,color:"#4A423A"}}>{r.name} · {r.email}{r.phone?" · "+r.phone:""}</div>
                </div>
                <span className="tag tag-gold">{r.status}</span>
              </div>
              {r.notes && <div style={{fontSize:12,color:"#8A7E74",fontStyle:"italic",marginBottom:10}}>"{r.notes}"</div>}
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <select value={sel[r.id]||""} onChange={e=>setSel(p=>({...p,[r.id]:e.target.value}))} style={{flex:"0 0 160px",fontSize:12}}>
                  <option value="">Update status…</option>{STATUSES.map(s=><option key={s}>{s}</option>)}
                </select>
                <input value={note[r.id]||""} onChange={e=>setNote(p=>({...p,[r.id]:e.target.value}))} placeholder="Note" style={{flex:1,minWidth:120,fontSize:12}}/>
                <button className="btn-ink" style={{padding:"8px 16px",fontSize:12}} onClick={()=>updateStatus(r.id)}>Save</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="inventory" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:12}}>
          {inventory.map(w=>(
            <div key={w.id} className="card">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700}}>{w.brand} {w.model}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>{w.reference} · {w.decade}</div></div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#B8860B",fontWeight:700}}>₹{w.price?.toLocaleString("en-IN")}</div>
              </div>
              <p style={{fontSize:12,color:"#4A423A",lineHeight:1.6,marginBottom:12}}>{w.description}</p>
              <div style={{display:"flex",gap:8}}>
                <button className="btn-ghost" style={{fontSize:11,padding:"6px 12px",color:w.available?"var(--grn)":"var(--red)",borderColor:w.available?"var(--gnbd)":"var(--rbd)"}} onClick={()=>saveInventory(inventory.map(i=>i.id===w.id?{...i,available:!i.available}:i))}>{w.available?"Mark sold":"Mark available"}</button>
                <button className="btn-ghost" style={{fontSize:11,padding:"6px 12px",color:"var(--red)",borderColor:"var(--rbd)"}} onClick={()=>saveInventory(inventory.filter(i=>i.id!==w.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="sellers" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
          {sellers.map(s=>(
            <div key={s.id} className="card">
              <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
                <div className="avatar">{s.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700}}>{s.name}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>{s.handle} · {s.city}</div></div>
                    {s.verified && <span className="vbadge">✦</span>}
                  </div>
                </div>
              </div>
              <div style={{fontSize:12,color:"#4A423A",marginBottom:12}}>★ {s.rating||"—"} · {s.reviewCount} reviews · {s.sales} sales</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>saveSellers(sellers.map(x=>x.id!==s.id?x:{...x,verified:!x.verified,verifiedDate:!x.verified?new Date().toISOString().slice(0,7):null,badge:!x.verified?"Verified":null}))} className={s.verified?"btn-ghost":"btn-gold"} style={{fontSize:11,padding:"7px 12px",flex:1,color:s.verified?"var(--red)":"",borderColor:s.verified?"var(--rbd)":""}}>
                  {s.verified?"Revoke":"Grant Verified ✦"}
                </button>
                {!s.verified && <button className="btn-gold" style={{fontSize:11,padding:"7px 12px"}} onClick={()=>saveSellers(sellers.map(x=>x.id!==s.id?x:{...x,verified:true,badge:"Top Seller"}))}>Top Seller</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="listings" && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
          {listings.map(l=>{
            const s=sellers.find(x=>x.id===l.sellerId);
            return (
              <div key={l.id} className="card">
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700}}>{l.brand} {l.model}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>{l.decade} · by {s?.name||"unknown"}</div></div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"#B8860B",fontWeight:700}}>₹{l.price?.toLocaleString("en-IN")}</div>
                </div>
                <p style={{fontSize:12,color:"#4A423A",lineHeight:1.6,marginBottom:12}}>{l.description}</p>
                <button onClick={()=>saveListings(listings.map(x=>x.id!==l.id?x:{...x,verified:!x.verified}))} className={l.verified?"btn-ghost":"btn-gold"} style={{fontSize:11,padding:"7px 12px",width:"100%",color:l.verified?"var(--red)":"",borderColor:l.verified?"var(--rbd)":""}}>
                  {l.verified?"Remove Verification":"Verify Listing ✦"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab==="users" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
            {users.map(u=>(
              <div key={u.id} className="card">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700}}>{u.name}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74",marginTop:2}}>{u.email}</div>
                    {u.phone && <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#8A7E74"}}>{u.phone}</div>}
                  </div>
                  <span className="role-pill" style={{background:u.role==="admin"?"var(--rbg)":u.role==="seller"?"var(--gnbg)":"var(--bbg)",color:u.role==="admin"?"var(--red)":u.role==="seller"?"var(--grn)":"var(--blu)"}}>{u.role}</span>
                </div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#8A7E74"}}>Joined {new Date(u.createdAt).toLocaleDateString("en-IN")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="add" && (
        <div style={{maxWidth:540}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <div><label className="fl">Brand *</label><select value={nw.brand} onChange={e=>uNw("brand",e.target.value)}><option value="">Select</option><option>HMT</option><option>Allwyn</option><option>Ricoh</option></select></div>
            <div><label className="fl">Model *</label><input value={nw.model} onChange={e=>uNw("model",e.target.value)} placeholder="Pilot…"/></div>
            <div><label className="fl">Reference</label><input value={nw.reference} onChange={e=>uNw("reference",e.target.value)}/></div>
            <div><label className="fl">Decade</label><select value={nw.decade} onChange={e=>uNw("decade",e.target.value)}><option value="">Select</option>{["1960s","1970s","1980s","1990s"].map(d=><option key={d}>{d}</option>)}</select></div>
            <div><label className="fl">Condition</label><select value={nw.condition} onChange={e=>uNw("condition",e.target.value)}><option value="">Select</option>{["Mint","Excellent","Good","Fair"].map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="fl">Price ₹ *</label><input value={nw.price} onChange={e=>uNw("price",e.target.value)} placeholder="2500"/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">Description</label><textarea value={nw.description} onChange={e=>uNw("description",e.target.value)} rows={3} placeholder="Honest condition report."/></div>
            <div style={{gridColumn:"1/-1"}}><label className="fl">Tags (comma-separated)</label><input value={nw.tags} onChange={e=>uNw("tags",e.target.value)} placeholder="hand-wound, black dial…"/></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" checked={nw.available} onChange={e=>uNw("available",e.target.checked)} style={{width:"auto",accentColor:"#1A1612"}}/><label className="fl" style={{marginBottom:0}}>Available for sale</label></div>
          </div>
          <button className="btn-ink" onClick={()=>{
            if(!nw.brand||!nw.model||!nw.price){toast("Brand, model, price required.");return;}
            saveInventory([...inventory,{...nw,id:"w"+Date.now(),price:parseInt(nw.price),tags:nw.tags.split(",").map(t=>t.trim()).filter(Boolean)}]);
            setNw({brand:"",model:"",reference:"",decade:"",condition:"",price:"",description:"",tags:"",available:true});
            toast("Added."); setTab("inventory");
          }}>Add to inventory →</button>
        </div>
      )}
    </div>
  );
}
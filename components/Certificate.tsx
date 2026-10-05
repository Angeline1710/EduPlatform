type CertificateProps = {
  holderName: string;
  title: string;
  type: "Course" | "Internship";
  internRole: string; // e.g. "Frontend Engineering"
  credentialId: string;
  issuedAt: Date;
};

/** Format: "October 5, 2026" */
const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ---------------------------------------------------------------------------
// Gold wax seal (pure SVG — no framer-motion so html2canvas export is safe)
// ---------------------------------------------------------------------------
function WaxSeal() {
  return (
    <svg
      viewBox="0 0 120 120"
      width={120}
      height={120}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sealGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e8c96a" />
          <stop offset="55%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a6914" />
        </radialGradient>
      </defs>
      {/* Outer dashed ring */}
      <circle
        cx="60" cy="60" r="56"
        fill="none" stroke="#b8933f" strokeWidth="1.5" strokeDasharray="4 3"
      />
      {/* Gold disc */}
      <circle cx="60" cy="60" r="50" fill="url(#sealGrad)" />
      {/* Inner ring */}
      <circle
        cx="60" cy="60" r="44"
        fill="none" stroke="#e8c96a" strokeWidth="1" opacity="0.6"
      />
      {/* Crown */}
      <g transform="translate(60,60)" fill="#3d2a00">
        <rect x="-14" y="8" width="28" height="5" rx="1.5" />
        <polygon points="-14,8 -14,-10 -6,0 0,-14 6,0 14,-10 14,8" />
        <circle cx="-14" cy="-10" r="2.5" />
        <circle cx="0" cy="-14" r="2.5" />
        <circle cx="14" cy="-10" r="2.5" />
      </g>
      {/* Text arc top: EDUPLATFORM */}
      <path id="topArc" d="M 10,60 A 50,50 0 0,1 110,60" fill="none" />
      <text fontSize="7.5" fontFamily="serif" letterSpacing="3" fill="#3d2a00">
        <textPath href="#topArc" startOffset="50%" textAnchor="middle">
          EDUPLATFORM
        </textPath>
      </text>
      {/* Text arc bottom: ACADEMY OF KNOWLEDGE */}
      <path id="botArc" d="M 10,60 A 50,50 0 0,0 110,60" fill="none" />
      <text fontSize="6.5" fontFamily="serif" letterSpacing="2" fill="#3d2a00">
        <textPath href="#botArc" startOffset="50%" textAnchor="middle">
          ACADEMY OF KNOWLEDGE
        </textPath>
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Leaf watermark (SVG)
// ---------------------------------------------------------------------------
function LeafWatermark() {
  return (
    <svg
      viewBox="0 0 120 200"
      width={160}
      height={260}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.07 }}
    >
      <path d="M60 200 Q58 140 60 60" stroke="#7a6030" strokeWidth="2" fill="none" />
      <path d="M60 160 Q30 130 40 100 Q70 120 60 160" fill="#5a4a20" />
      <path d="M60 130 Q90 100 80 70 Q50 90 60 130" fill="#5a4a20" />
      <path d="M60 100 Q25 70 38 40 Q68 60 60 100" fill="#5a4a20" />
      <path d="M60 75 Q92 45 82 15 Q52 35 60 75" fill="#5a4a20" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Handwritten-style SVG signature
// ---------------------------------------------------------------------------
function Signature() {
  return (
    <svg
      viewBox="0 0 140 50"
      width={140}
      height={50}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 38 C20 10, 35 8, 45 28 C52 42, 58 12, 70 22 C78 30, 85 18, 98 26 C108 32, 115 20, 130 28"
        stroke="#1a1a1a"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 42 C40 40, 60 41, 80 40"
        stroke="#1a1a1a"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Small crown icon for header badge
// ---------------------------------------------------------------------------
function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M2 19h20v2H2v-2zm2-3l3-8 5 5 5-5 3 8H4z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Certificate
// ---------------------------------------------------------------------------
export default function Certificate({
  holderName,
  title,
  type,
  internRole,
  credentialId,
  issuedAt,
}: CertificateProps) {
  const isInternship = type === "Internship";

  const endDate = new Date(issuedAt);
  const startDate = new Date(endDate);
  startDate.setMonth(startDate.getMonth() - 1);

  return (
    <div
      id="certificate"
      style={{
        width: "1056px",
        height: "748px",
        fontFamily: '"Georgia", "Times New Roman", Times, serif',
        backgroundColor: "#f5f0e8",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}
    >


      {/* ── Double gold border frame ── */}
      <div aria-hidden="true" style={{ position:"absolute", inset:"16px", border:"1.5px solid rgba(180,140,40,0.45)", pointerEvents:"none", zIndex:5 }} />
      <div aria-hidden="true" style={{ position:"absolute", inset:"20px", border:"0.5px solid rgba(180,140,40,0.25)", pointerEvents:"none", zIndex:5 }} />

      {/* ── Leaf watermark (right side) ── */}
      <div aria-hidden="true" style={{ position:"absolute", right:48, top:"50%", transform:"translateY(-50%)", zIndex:1 }}>
        <LeafWatermark />
      </div>

      {/* ── Content ── */}
      <div style={{ position:"relative", zIndex:6, flex:1, display:"flex", flexDirection:"column", padding:"44px 80px 38px" }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{
              width:52, height:52, borderRadius:"50%",
              background:"linear-gradient(135deg,#e8c96a,#c9a227)",
              display:"flex", alignItems:"center", justifyContent:"center",
              border:"2px solid #1a1a1a",
              boxShadow:"0 2px 8px rgba(0,0,0,0.25)", color:"#1a1a1a",
            }}>
              <CrownIcon />
            </div>
            <div style={{ width:"1.5px", height:"40px", background:"#1a1a1a", opacity:0.3 }} />
            <div>
              <div style={{ fontSize:"20px", fontWeight:700, color:"#1a1a1a", letterSpacing:"0.03em" }}>
                EduPlatform
              </div>
              <div style={{ fontSize:"9px", fontWeight:600, color:"#b8933f", letterSpacing:"0.18em",
                textTransform:"uppercase", fontFamily:'"Arial",sans-serif', marginTop:"1px" }}>
                Academy of Knowledge
              </div>
            </div>
          </div>

          {/* Type label */}
          <div style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase",
            color:"#b8933f", fontFamily:'"Arial",sans-serif', display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ display:"inline-block", width:30, height:"1px", background:"#b8933f" }} />
            {isInternship ? "Internship Certificate" : "Course Certificate"}
          </div>
        </div>

        {/* BODY */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", textAlign:"center" }}>

          {/* CERTIFICATE heading */}
          <div style={{ fontSize:"60px", fontWeight:900, color:"#1a1a1a", letterSpacing:"0.12em",
            textTransform:"uppercase", lineHeight:1 }}>
            Certificate
          </div>

          {/* OF INTERNSHIP / OF COMPLETION */}
          <div style={{ marginTop:"6px", display:"flex", alignItems:"center", gap:"12px" }}>
            <div style={{ height:"1px", background:"#c9a227", width:60 }} />
            <div style={{ fontSize:"13px", fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase",
              color:"#c9a227", fontFamily:'"Arial",sans-serif' }}>
              {isInternship ? "of Internship" : "of Completion"}
            </div>
            <div style={{ height:"1px", background:"#c9a227", width:60 }} />
          </div>

          {/* This is to certify that */}
          <div style={{ marginTop:"26px", fontSize:"11px", letterSpacing:"0.22em",
            textTransform:"uppercase", color:"#555", fontFamily:'"Arial",sans-serif' }}>
            This is to certify that
          </div>

          {/* Holder name */}
          <div style={{ marginTop:"10px", fontSize:"44px", fontWeight:700, color:"#1a1a1a", letterSpacing:"0.01em" }}>
            Mr/Mrs/Ms. {holderName}
          </div>

          {/* Gold divider with diamond */}
          <div style={{ marginTop:"12px", display:"flex", alignItems:"center", gap:"8px", width:"340px" }}>
            <div style={{ flex:1, height:"1px", background:"#c9a227" }} />
            <div style={{ width:"6px", height:"6px", background:"#c9a227", transform:"rotate(45deg)" }} />
            <div style={{ flex:1, height:"1px", background:"#c9a227" }} />
          </div>

          {/* Description */}
          <div style={{ marginTop:"18px", fontSize:"15px", lineHeight:1.7, color:"#333", maxWidth:"600px" }}>
            {isInternship ? (
              <>
                has successfully completed their internship as{" "}
                <strong>{internRole} Intern</strong>
                <br />
                for the duration of <strong>1 month</strong> from{" "}
                <strong>{fmt(startDate)}</strong> to <strong>{fmt(endDate)}</strong>.
              </>
            ) : (
              <>
                has successfully completed the course <strong>{title}</strong>
                <br />
                demonstrating dedication and commitment to learning. Issued on{" "}
                <strong>{fmt(endDate)}</strong>.
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
          borderTop:"1px solid rgba(180,140,40,0.30)", paddingTop:"20px" }}>

          {/* Left: Issued On + Credential ID */}
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <div>
              <div style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase",
                color:"#8a6914", fontFamily:'"Arial",sans-serif' }}>
                Issued On
              </div>
              <div style={{ marginTop:"3px", fontSize:"15px", fontWeight:700, color:"#1a1a1a" }}>
                {fmt(endDate)}
              </div>
            </div>
            <div>
              <div style={{ fontSize:"9px", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase",
                color:"#8a6914", fontFamily:'"Arial",sans-serif' }}>
                Credential ID
              </div>
              <div style={{ marginTop:"3px", fontSize:"15px", fontWeight:700, color:"#1a1a1a", letterSpacing:"0.05em" }}>
                {credentialId}
              </div>
            </div>
          </div>

          {/* Center: Wax seal */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
            <WaxSeal />
          </div>

          {/* Right: Signature */}
          <div style={{ textAlign:"center" }}>
            <Signature />
            <div style={{ marginTop:"6px", fontSize:"13px", fontWeight:700, color:"#1a1a1a",
              fontFamily:'"Arial",sans-serif' }}>
              Authorized Signatory
            </div>
            <div style={{ fontSize:"11px", color:"#555", fontFamily:'"Arial",sans-serif' }}>
              EduPlatform Academy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

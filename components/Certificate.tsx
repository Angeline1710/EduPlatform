type CertificateProps = {
  holderName: string;
  title: string;
  type: "Course" | "Internship";
  credentialId: string;
  issuedAt: Date;
  periodStartDate?: Date | null;
  periodEndDate?: Date | null;
}

const fmt = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);

function OfficialStamp() {
  return (
    <svg
      width="144"
      height="144"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <path id="certificate-stamp-top" d="M 28,126 A 76,76 0 1,1 172,126" />
        <path id="certificate-stamp-bottom" d="M 46,126 A 76,76 0 0,0 154,126" />
      </defs>
      <g fill="none" stroke="#1E3A8A" strokeWidth="2.2">
        <circle cx="100" cy="100" r="92" />
        <circle cx="100" cy="100" r="61" />
      </g>
      <text fontSize="9.5" fontWeight="700" letterSpacing="1.8" fill="#1E3A8A" fontFamily="Arial, sans-serif">
        <textPath href="#certificate-stamp-top" startOffset="50%" textAnchor="middle">
          EDUPLATFORM ACADEMY OF KNOWLEDGE
        </textPath>
      </text>
      <g transform="translate(39,134) scale(0.65)" fill="#1E3A8A">
        <polygon points="10,1 12.8,7 19.5,7.6 14.4,12 16,18.5 10,15 4,18.5 5.6,12 0.5,7.6 7.2,7" />
      </g>
      <text fontSize="10" fontWeight="800" letterSpacing="3.2" fill="#1E3A8A" fontFamily="Arial, sans-serif">
        <textPath href="#certificate-stamp-bottom" startOffset="50%" textAnchor="middle">
          CERTIFIED
        </textPath>
      </text>
      <g transform="translate(148,134) scale(0.65)" fill="#1E3A8A">
        <polygon points="10,1 12.8,7 19.5,7.6 14.4,12 16,18.5 10,15 4,18.5 5.6,12 0.5,7.6 7.2,7" />
      </g>
      <g transform="translate(100,100)" fill="none" stroke="#1E3A8A" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M -22,17 L -25,-2 L -14,5 L 0,-8 L 14,5 L 25,-2 L 22,17 Z" />
        <line x1="-22" y1="21" x2="22" y2="21" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

function AuthorizedSignature() {
  return (
    <svg
      viewBox="0 0 240 70"
      width="208"
      height="56"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 30,52 C 34,44 46,18 52,12 C 54,10 56,12 53,20 C 49,32 46,48 48,54 C 50,58 54,55 58,45 C 62,35 66,34 70,42 C 74,48 78,48 82,38 C 86,28 92,34 96,44 C 100,50 108,46 116,42 C 134,34 165,26 210,18"
        fill="none"
        stroke="#111827"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 50,16 C 52,12 54,11 55,13" fill="none" stroke="#111827" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function CrownMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#F5D77F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

export default function Certificate({
  holderName,
  title,
  type,
  credentialId,
  issuedAt,
  periodStartDate,
  periodEndDate,
}: CertificateProps) {
  const isInternship = type === "Internship";
  const hasCompletionPeriod = Boolean(periodStartDate && periodEndDate);
  const endDate = periodEndDate ? new Date(periodEndDate) : null;
  const startDate = periodStartDate ? new Date(periodStartDate) : null;

  const gold = "#B89047";
  const labelStyle = {
    display: "block",
    color: "#A88237",
    fontFamily: "Arial, sans-serif",
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
  };

  return (
    <div
      id="certificate"
      style={{
        width: "1050px",
        height: "742px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(circle at 50% 45%, #FBF9F2 0%, #F5F1E5 70%, #EFE9D7 100%)",
        color: "#171717",
        fontFamily: '"Georgia", "Times New Roman", serif',
        boxShadow: "0 20px 60px rgba(0,0,0,0.24)",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: 176, height: 176, zIndex: 2 }}>
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <polygon points="0,0 160,0 0,160" fill="#141414" />
          <line x1="0" y1="160" x2="160" y2="0" stroke="#C5A059" strokeWidth="3.5" />
          <line x1="0" y1="172" x2="172" y2="0" stroke="#B89047" strokeWidth="1.5" />
        </svg>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", bottom: 0, right: 0, width: 176, height: 176, zIndex: 2, transform: "rotate(180deg)" }}>
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <polygon points="0,0 160,0 0,160" fill="#141414" />
          <line x1="0" y1="160" x2="160" y2="0" stroke="#C5A059" strokeWidth="3.5" />
          <line x1="0" y1="172" x2="172" y2="0" stroke="#B89047" strokeWidth="1.5" />
        </svg>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", inset: 20, zIndex: 1, pointerEvents: "none" }}>
        <svg viewBox="0 0 1010 702" width="100%" height="100%" preserveAspectRatio="none">
          <path
            d="M 150,8 L 995,8 L 995,550 M 860,694 L 30,694 A 22,22 0 0,1 8,672 L 8,150"
            fill="none"
            stroke="#C5A059"
            strokeWidth="1.5"
            strokeOpacity="0.8"
          />
          <path d="M 28,674 A 20,20 0 0,0 8,694" fill="none" stroke="#B89047" strokeWidth="1.2" />
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "46px 64px 32px" }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 76 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, paddingLeft: 52 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", padding: 2, boxSizing: "border-box", background: "linear-gradient(135deg,#9B752F,#DFB76C,#C5A059)", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1e1e1e", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #FFEA9F", boxSizing: "border-box" }}>
                <CrownMark />
              </div>
            </div>
            <div style={{ width: 1.5, height: 42, background: "#C5A059", opacity: 0.8 }} />
            <div>
              <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.1 }}>EduPlatform</div>
              <div style={{ marginTop: 6, color: "#A88237", fontFamily: "Arial, sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.24em" }}>
                ACADEMY OF KNOWLEDGE
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 14, color: "#555", fontFamily: "Arial, sans-serif", fontSize: 10, letterSpacing: "0.22em", whiteSpace: "nowrap" }}>
            <span style={{ width: 36, height: 1, background: gold }} />
            {isInternship ? "INTERNSHIP CERTIFICATE" : "COURSE CERTIFICATE"}
            <span style={{ width: 36, height: 1, background: gold }} />
          </div>
        </header>

        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "16px 40px 20px" }}>
          <h1 style={{ margin: 0, fontSize: 54, fontWeight: 700, letterSpacing: "0.14em", lineHeight: 1.15 }}>
            CERTIFICATE
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%", maxWidth: 500, marginTop: 8 }}>
            <span style={{ flex: 1, height: 1.5, background: gold }} />
            <span style={{ color: "#A88237", fontSize: 14, fontWeight: 700, letterSpacing: "0.28em", whiteSpace: "nowrap" }}>
              {isInternship ? "OF INTERNSHIP" : "OF COURSE COMPLETION"}
            </span>
            <span style={{ flex: 1, height: 1.5, background: gold }} />
          </div>
          <p style={{ margin: "20px 0 8px", color: "#555", fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.32em" }}>
            THIS IS TO CERTIFY THAT
          </p>
          <h2 style={{ maxWidth: 820, overflowWrap: "anywhere", margin: "2px 0 8px", fontSize: 48, fontWeight: 600, lineHeight: 1.2 }}>
            {holderName}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", maxWidth: 400, margin: "2px 0 8px" }}>
            <span style={{ flex: 1, height: 1, background: "#C5A059" }} />
            <span style={{ width: 9, height: 9, background: gold, transform: "rotate(45deg)" }} />
            <span style={{ flex: 1, height: 1, background: "#C5A059" }} />
          </div>
          <p style={{ maxWidth: 700, margin: "10px 0 0", color: "#333", fontSize: 19, lineHeight: 1.65 }}>
            {isInternship ? (
              <>
                has successfully completed the internship program{" "}
                <strong style={{ color: "#171717", fontFamily: "Arial, sans-serif", fontSize: 17 }}>{title}</strong>
              </>
            ) : (
              <>
                has successfully completed the course{" "}
                <strong style={{ color: "#171717", fontFamily: "Arial, sans-serif", fontSize: 17 }}>{title}</strong>
              </>
            )}
            <br />
            {hasCompletionPeriod && startDate && endDate ? (
              <>
                from <strong style={{ color: "#171717", fontFamily: "Arial, sans-serif", fontSize: 17 }}>{fmt(startDate)}</strong>{" "}
                to <strong style={{ color: "#171717", fontFamily: "Arial, sans-serif", fontSize: 17 }}>{fmt(endDate)}</strong>.
              </>
            ) : (
              <>and demonstrated dedication and commitment to learning.</>
            )}
          </p>
        </main>

        <footer style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "end", padding: "18px 16px 8px", borderTop: "1px solid rgba(184,144,71,0.35)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 4 }}>
            <div>
              <span style={labelStyle}>ISSUED ON</span>
              <span style={{ display: "block", marginTop: 4, fontSize: 15, fontWeight: 600 }}>{fmt(new Date(issuedAt))}</span>
            </div>
            <div style={{ width: 176, height: 1, background: "#C5A059" }} />
            <div>
              <span style={labelStyle}>CREDENTIAL ID</span>
              <span style={{ display: "block", marginTop: 4, fontFamily: "monospace", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>
                {credentialId}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <OfficialStamp />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingRight: 18 }}>
            <AuthorizedSignature />
            <span style={{ width: 208, height: 1.5, background: gold }} />
            <span style={{ marginTop: 7, fontSize: 14, fontWeight: 600 }}>Authorized Signatory</span>
            <span style={{ marginTop: 2, color: "#555", fontFamily: "Arial, sans-serif", fontSize: 10 }}>EduPlatform Academy</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

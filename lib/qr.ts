import QRCode from "qrcode";

/**
 * Renders a QR as an inline SVG string. Generated on the server and embedded
 * directly in the page, so nothing is fetched from an external image service.
 */
export async function qrSvg(text: string, size = 160) {
  return QRCode.toString(text, {
    type: "svg",
    margin: 1,
    width: size,
    errorCorrectionLevel: "M",
    color: { dark: "#17143a", light: "#ffffff" },
  });
}

/** Absolute URL a credential's QR should point at. */
export function verificationUrl(code: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/verify/${code}`;
}

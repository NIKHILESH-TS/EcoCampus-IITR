import QRCode from 'qrcode';

export async function generateBinQRCode(binId) {
  const url = `https://ecocampus.iitr.ac.in/bin/${binId}`;
  try {
    return await QRCode.toDataURL(url, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0e382f',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code generation error', err);
    return null;
  }
}

export async function generateBinQRSvg(binId) {
  const url = `https://ecocampus.iitr.ac.in/bin/${binId}`;
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      width: 160,
      margin: 1,
      color: {
        dark: '#0e382f',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('QR code SVG generation error', err);
    return null;
  }
}

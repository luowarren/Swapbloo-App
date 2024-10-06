const QRCode = require('qrcode');
const fs = require('fs');
require('dotenv').config();

const uploadURL = `${process.env.BASE_URL}/upload`; // Make sure to set BASE_URL in your .env

QRCode.toFile('uploadQRCode.png', uploadURL, {
    color: {
        dark: '#000',  // Dark color
        light: '#FFF'  // Light color
    }
}, (err) => {
    if (err) throw err;
    console.log('QR code generated: uploadQRCode.png');
});

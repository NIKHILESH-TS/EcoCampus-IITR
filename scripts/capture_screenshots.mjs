import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('presentation/screenshots');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Starting Vite preview server...');
  const server = spawn('npx', ['vite', 'preview', '--port', '4173', '--host'], {
    shell: true,
    stdio: 'pipe'
  });

  await sleep(3000);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    await sleep(800);

    // 1. Student Overview
    await page.screenshot({ path: path.join(OUT_DIR, '01_student_overview.png') });
    console.log('Captured 01_student_overview.png');

    // 2. AI Waste Scanner
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const scanBtn = btns.find(b => b.textContent.includes('AI Waste Scanner'));
      if (scanBtn) scanBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '02_ai_waste_scanner.png') });
    console.log('Captured 02_ai_waste_scanner.png');

    // 3. Canteen Rewards Pass
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const passBtn = btns.find(b => b.textContent.includes('Canteen Pass'));
      if (passBtn) passBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '03_canteen_rewards.png') });
    console.log('Captured 03_canteen_rewards.png');

    // 4. Field Crew Portal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const crewBtn = btns.find(b => b.textContent.includes('Field Crew'));
      if (crewBtn) crewBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '04_field_crew_portal.png') });
    console.log('Captured 04_field_crew_portal.png');

    // 5. Admin Portal (IoT Hardware Simulator & B2B Tenders)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const adminBtn = btns.find(b => b.textContent.includes('Admin'));
      if (adminBtn) adminBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '05_admin_command.png') });
    console.log('Captured 05_admin_command.png');

    // Switch to IoT Simulator tab inside Admin
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const iotBtn = btns.find(b => b.textContent.includes('IoT Hardware Simulator'));
      if (iotBtn) iotBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '06_iot_sensor_simulator.png') });
    console.log('Captured 06_iot_sensor_simulator.png');

    // 6. B2B Recycler Bidding Portal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const recBtn = btns.find(b => b.textContent.includes('Recycler'));
      if (recBtn) recBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '07_recycler_bidding.png') });
    console.log('Captured 07_recycler_bidding.png');

    // 7. 4-Persona Sign-In & Demo Gateway Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      const authBtn = btns[btns.length - 1];
      if (authBtn) authBtn.click();
    });
    await sleep(700);
    await page.screenshot({ path: path.join(OUT_DIR, '08_auth_gateway.png') });
    console.log('Captured 08_auth_gateway.png');

  } finally {
    await browser.close();
    server.kill();
    process.exit(0);
  }
}

run();

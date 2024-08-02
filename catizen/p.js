const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const queryFilePath = path.join(__dirname, 'iframe.txt');
    const queries = fs.readFileSync(queryFilePath, 'utf-8').trim().split('\n');

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const page = await browser.newPage();
      await page.goto(`${query.trim()}`);
      await page.evaluate(async (tabIndex) => {
        try {
          console.log(`Tab ${tabIndex + 1}: Mulai eksekusi script`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          const unixTime = Date.now(); 
          const url = 'https://raw.githubusercontent.com/RGB-Outl4w/AutoFarmCatizen/rel/release_OAFC_v5.1_telegramwebviewscript.js' + '?' + unixTime; 
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const script = await response.text();
          const scriptElement = document.createElement('script');
          scriptElement.textContent = script;
          document.body.appendChild(scriptElement);
          console.log(`Tab ${tabIndex + 1}: Script berhasil dijalankan`);
        } catch (error) {
          console.error(`Tab ${tabIndex + 1}: Error dalam eksekusi script:`, error);
        }
      }, i);
      const decodedQuery = decodeURIComponent(query);
      const userDataMatch = decodedQuery.match(/%7B(.+?)%7D/);
      let firstName = '';
      let lastName = '';
      
      if (userDataMatch) {
        const userData = JSON.parse(decodeURIComponent(userDataMatch[0]));
        firstName = userData.first_name || '';
        lastName = userData.last_name || '';
      }

      const fullName = `${firstName}${lastName ? ' ' + lastName : ''}`;
      console.log(`Akun ${i + 1} : ${fullName} berhasil`);
    }

    console.log('Semua akun sedang berjalan, jangan ditabrak! maksa run ulang');

  } catch (error) {
    console.error('Error:', error);
  }
})();

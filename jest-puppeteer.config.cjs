// jest-puppeteer.config.js
module.exports = {
  launch: {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  },
  browserContext: 'default'
};
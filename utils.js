const nodeFetch = require('node-fetch')

module.exports = { fetch, headers }

/**
 * Fetch using Puppeteer cookies.
 *
 * @param page {import("puppeteer/lib/Page").Page} Puppeteer page instance.
 * @param url {string}
 * @param options {{}}
 * @returns {Promise<*|Promise>}
 */
async function fetch (page, url, options = {}) {
  options.headers = Object.assign(await headers(page), options.headers || {})
  return nodeFetch(url, options)
}

/**
 * Generate headers similar to Puppeteer.
 *
 * @param page {import("puppeteer/lib/Page").Page} Puppeteer page instance.
 * @returns {Promise<{}>}
 */
async function headers(page) {
  const cookies = (await page.cookies())
    .filter(({ session }) => session)
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ')

  const [userAgent, host] = await page.evaluate(() => [navigator.userAgent, location.host])

  return {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
    'Connection': 'keep-alive',
    'Cookie': cookies,
    'Host': host,
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': userAgent
  }
}
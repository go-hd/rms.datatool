const iconv = require('iconv-lite')
const csvParse = require('csv-parse/lib/sync')
const { fetch } = require('../../utils.js')

module.exports = { search }

const urls = {
  page: 'https://datatool.rms.rakuten.co.jp/access/item',
  api: 'https://datatool.rms.rakuten.co.jp/access/api/item'
}

/**
 *
 * @param page {import("puppeteer/lib/Page").Page} Puppeteer page instance.
 * @param params {{}}
 */
async function search (page, params ) {
  await page.goto(urls.page, { waitUntil: 'networkidle2' })

  params = Object.assign(await page.evaluate(() => PARAMS), params)
  const downloadURL = urls.api + '?' + Object.entries(params).map(param => param.join('=')).join('&')

  const response = await fetch(page, downloadURL)
  return response.json()
}
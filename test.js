const puppeteer = require('puppeteer')
const dateformat = require('dateformat')

const { describe, before, after, it } = require('mocha')
const { expect } = require('chai')
require('dotenv').config()

const { login } = require('rms.login')
const { search } = require('./access/item/index.js')

describe('Accesses per item', function () {
  this.timeout(0)

  before(async function () {
    global.browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process',
      ],
    })

    global.page = await global.browser.newPage()
    await global.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36')

    await login(
      global.page,
      process.env.RMS_SHOP_ID,
      process.env.RMS_SHOP_PASSWORD,
      process.env.RMS_USER_ID,
      process.env.RMS_USER_PASSWORD,
    )
  })

  after(async function () {
    await global.browser.close()
  })

  it('Get report', async function () {

    const params = {
      action: 'item_list',
      csv_item_checked: '1', // csvで列指定をしているかどうか？
      csv_item_option: '0', // csvで落としてくる列の指定？
      date_type: 'is_quick', // is_quick, is_datepicker
      datepicker_type: 'month', // day, month
      deveice_type: '1', // 1:全て, 2:PC, 3:SP, 4:アプリ
      display_date_type: 2,　// 2:１週間, 3:直近３１日間, 5:１日, 6:月（月初から月末 or 最新日まで）
      limit: '150', // 50 or 100 or 150
      page: '1', // 検索結果をlimitで区切った場合の取得するページ
      quick: '1d', // 1d:１日, 1w:１週間, 31m:直近３１日間, 1m:当月
      search_date: '', // date_type=is_datepickerの時は対象日もしくは対象月の初日を指定
      search_word: '',
      search_word_type: '1', // 1:すべて, 2:商品名, 3:商品管理番号, 4:ジャンル名, 5:カタログID
      sort: '11',
    }



    search(global.page, params)
  })
})

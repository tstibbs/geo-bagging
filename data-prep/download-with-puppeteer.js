import puppeteer from 'puppeteer'
import {writeFile} from 'fs/promises'
import {_downloadMultiple} from './downloader.js'

const USER_AGENT = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36`

let browser = null
let page = null

async function launchBrowser() {
	if (!browser) {
		browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']})
		page = await browser.newPage()
		await page.setUserAgent(USER_AGENT)
		await page.setJavaScriptEnabled(false)
	}
}

async function closeBrowser() {
	if (browser) {
		await browser.close()
		browser = null
		page = null
	}
}

export async function fetchHtml(sourceUrl, destination) {
	await launchBrowser()

	const responsePromise = new Promise(resolve => {
		const onResponse = async response => {
			if (response.url() === sourceUrl && response.request().resourceType() === 'document') {
				let initialHtml = await response.text()
				page.off('response', onResponse)
				resolve(initialHtml)
			}
		}
		page.on('response', onResponse)
	})

	await page.goto(sourceUrl, {waitUntil: 'domcontentloaded'})
	const html = await responsePromise
	await writeFile(destination, html)
}

export async function download(bundleName, urls) {
	const result = await _downloadMultiple(bundleName, urls, fetchHtml)
	await closeBrowser()
	return result
}

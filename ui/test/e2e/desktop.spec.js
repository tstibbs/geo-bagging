import {setTimeout} from 'node:timers/promises'

import {test, expect} from '@playwright/test'

const startUrl = '?startPosition=52.926310,-0.572129&startZoom=12'
const maxMapPixelsDiff = 1000 // number of pixels that are allowed to be different when viewing the map, to account for OSM render changes. Ignored when masking the map. Screenshots not including the map tiles must be pixel identical.

test.use({
	viewport: {
		height: 600,
		width: 1024
	}
})

test('sidebar', async ({page}) => {
	await start(page)
	await page.getByRole('tab', {name: 'Layers'}).click()
	await expectMaskedScreenshot(page, 'layers-open.png')
	await page.getByRole('tab', {name: 'Settings'}).click()
	await expectMaskedScreenshot(page, 'settings-open.png')
	await page.getByRole('tab', {name: 'Constraints'}).click()
	await expectMaskedScreenshot(page, 'constraints-open.png')
	await page.getByRole('tab', {name: 'Visits'}).click()
	await expectMaskedScreenshot(page, 'visits-open.png')
	await page.getByRole('tab', {name: 'External Files'}).click()
	await expectMaskedScreenshot(page, 'external-files-open.png')
	await page.getByRole('tab', {name: 'Attribution'}).click()
	await expectMaskedScreenshot(page, 'attribution-open.png')
	//clicking again should close it
	await page.getByRole('tab', {name: 'Attribution'}).click()
	await expectMaskedScreenshot(page, 'start.png')
})

test('search', async ({page}) => {
	await start(page)
	await page.getByRole('link', {name: 'Enter address'}).click()
	await page.getByRole('combobox', {name: 'Enter address'}).fill('bath')
	await page.getByRole('combobox', {name: 'Enter address'}).press('Enter')
	await expectMaskedScreenshot(page, 'bath-search.png')
	await expectUnmaskedScreenshot(page, 'bath-search.unmasked.png')
	//first click hides the marker
	await page.getByRole('button', {name: 'Clear search'}).click()
	//second click clears the input box
	await page.getByRole('button', {name: 'Clear search'}).click()
	await expectMaskedScreenshot(page, 'bath-no-search.png')
	await expectUnmaskedScreenshot(page, 'bath-no-search.unmasked.png')
})

test('zoom', async ({page}) => {
	await start(page)
	await page.getByRole('button', {name: 'Zoom in'}).click()
	await expectUnmaskedScreenshot(page, 'zoom-in-1-unmasked.png')
	await page.getByRole('button', {name: 'Zoom in'}).click()
	await expectUnmaskedScreenshot(page, 'zoom-in-2-unmasked.png')
	await page.getByRole('button', {name: 'Zoom out'}).click()
	await expectUnmaskedScreenshot(page, 'zoom-in-1-unmasked.png')
	await page.getByRole('button', {name: 'Zoom out'}).click()
	await expectUnmaskedScreenshot(page, 'start-unmasked.png')
})

async function start(page) {
	await page.goto(startUrl)
	await waitForLeafletSettled(page)
	await expectMaskedScreenshot(page, 'start.png')
}

let mouseX = 200
let mouseY = 200

async function expectMaskedScreenshot(page, name, options = {}) {
	mouseX += 10
	mouseY += 10
	await page.mouse.move(mouseX, mouseY)
	await waitForLeafletSettled(page)
	const styleTag = await page.addStyleTag({
		//hiding mouseposition until we can fix the flakyness
		content: '.leaflet-control-mouseposition, .leaflet-tile { visibility: hidden !important; }'
	})

	try {
		await expect(page).toHaveScreenshot(name, options)
	} finally {
		await styleTag.evaluate(el => el.remove())
	}
}

async function expectUnmaskedScreenshot(page, name, options = {}) {
	const styleTag = await page.addStyleTag({
		//hiding mouseposition until we can fix the flakyness
		content: '.leaflet-control-mouseposition { visibility: hidden !important; }'
	})

	try {
		await waitForLeafletSettled(page)
		await expect(page).toHaveScreenshot(name, {
			maxDiffPixels: maxMapPixelsDiff,
			...options
		})
	} finally {
		await styleTag.evaluate(el => el.remove())
	}
}

async function waitForLeafletSettled(page) {
	await setTimeout(1000)
	await page.waitForFunction(() => {
		const container = document.querySelector('.leaflet-container')
		const pane = document.querySelector('.leaflet-map-pane')
		if (!container || !pane) return false

		const isAnimating = container.classList.contains('leaflet-zoom-anim') || pane.classList.contains('leaflet-pan-anim')

		if (isAnimating) return false

		const tiles = Array.from(document.querySelectorAll('.leaflet-tile'))
		return tiles.every(tile => tile.classList.contains('leaflet-tile-loaded'))
	})
}

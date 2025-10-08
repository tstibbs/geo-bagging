import {jest} from '@jest/globals'
import mobile from '../src/js/mobile.js'

describe('mobile', () => {
	//NOTE: some of these user agents might be munged slightly due to the author's paranoia.

	test('mobile device', () => {
		// chrome on android
		runTest(
			'Mozilla/5.0 (Linux; Android 5.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Mobile Safari/537.36',
			true
		)
		// firefox on android
		runTest('Mozilla/5.0 (Android 5.0.1; Mobile; rv:48.0) Gecko/48.0 Firefox/48.0', true)
		// android browser
		runTest(
			'Mozilla/5.0 (Linux; Android 5.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Mobile Safari/537.36',
			true
		)
		// safari on ios
		runTest(
			'Mozilla/5.0 (iPhone; CPU iPhone OS 6_2_1 like Mac OS X) AppleWebKit/000.0.00 (KHTML, like Gecko) Version/9.0 Mobile/12h64 Safari/600.0',
			true
		)
	})

	test('mobile pretending to be a desktop', () => {
		// chrome on android
		runTest(
			'Mozilla/5.0 (X11; Linux x86_64) AppletWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36',
			false
		)
		// firefox on android
		runTest('Mozilla/5.0 (X11; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0', false)
		// android browser
		runTest(
			'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36',
			false
		)
	})

	test('desktop', () => {
		// chrome on a desktop
		runTest(
			'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0000.00 Safari/537.36',
			false
		)
		// firefox on a desktop
		runTest('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:47.0) Gecko/20100101 Firefox/47.0', false)
		// IE on a desktop
		runTest('Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko', false)
	})
})

function runTest(userAgent, expected) {
	jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(userAgent)
	expect(mobile.isMobile()).toBe(expected)
}

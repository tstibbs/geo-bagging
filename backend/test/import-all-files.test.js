import {importAll} from '@tstibbs/cloud-core-utils/src/tools/compile-all.js'

test('all files compile', async () => {
	await importAll(import.meta, '../src')
	await importAll(import.meta, '../lib')
	await importAll(import.meta, '../tools')
})

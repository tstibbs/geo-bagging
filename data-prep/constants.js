export const tmpInputDir = 'tmp-input'
export const referenceDataDir = `${tmpInputDir}/old-data`
export const outputDir = '../ui/src/js/bundles'
const defaultUserAgent = `geo-bagging (https://github.com/tstibbs/geo-bagging)`
export const wikipediaOptions = {
	'User-Agent': `${defaultUserAgent} wtf_wikipedia/latest)`,
	lang: 'en'
}
export const wikidataHeaders = {
	'user-agent': defaultUserAgent
}

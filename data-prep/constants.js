const dataProcessingDir = 'tmp-data-processing'
export const referenceDataDir = `${dataProcessingDir}/old-data`
export const inputDataDir = `${dataProcessingDir}/input-data`
export const comparisonsDir = `${dataProcessingDir}/comparisons`
export const outputDir = '../ui/src/js/bundles'
const defaultUserAgent = `geo-bagging (https://github.com/tstibbs/geo-bagging)`
export const wikipediaOptions = {
	'Api-User-Agent': `${defaultUserAgent} wtf_wikipedia/latest)`,
	lang: 'en'
}
export const wikidataHeaders = {
	'user-agent': defaultUserAgent
}

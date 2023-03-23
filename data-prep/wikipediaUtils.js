import util from 'util'
import _ from 'underscore'
import wtf from 'wtf_wikipedia'
import {wikipediaOptions} from './constants.js'

const wtfFetch = util.promisify(wtf.fetch)

async function fetchCategories(category, exclusions) {
	let categories = []
	let pages = []
	let result = await wtf.category(category, wikipediaOptions)
	if (result.pages != null && result.pages.length > 0) {
		categories = [category]
		pages = result.pages.map(page => page.title)
	}
	let subCats = result.categories
	if (exclusions) {
		subCats = subCats.filter(category => !exclusions.includes(category.title))
	}
	let promises = subCats.map(category => fetchCategories(category.title, exclusions))
	const results = await Promise.all(promises)
	categories = categories.concat(...results.map(result => result.categories))
	pages = pages.concat(...results.map(result => result.pageNames))
	return {
		categories: categories,
		pageNames: pages
	}
}

async function fetchPages(pageNames) {
	if (pageNames.length > 0) {
		pageNames = [...new Set(pageNames)] //use the set to de-dupe
		let chunkedPageNames = _.chunk(pageNames, 50)
		let promises = chunkedPageNames.map(chunk => wtfFetch(chunk, wikipediaOptions))
		let responses = await Promise.all(promises)
		return [].concat([], ...responses).map(doc => doc.json())
	} else {
		return []
	}
}

/* Some pages might be redirects to pages that aren't actually part of one of the categories that we're interested in, so filter those out*/
function filterPages(data) {
	let categories = data.categories.map(category => category.replace(/^Category:/, '').replace(/_/g, ' '))
	return data.pages.filter(doc => doc.categories.some(category => categories.includes(category)))
}

export {fetchCategories, fetchPages, filterPages}

import assert from 'assert/strict'
import util from 'util'
import _ from 'underscore'
import wtf from 'wtf_wikipedia'
import wtfPluginApi from 'wtf-plugin-api'
import {wikipediaOptions} from './constants.js'

wtf.extend(wtfPluginApi)
const wtfFetch = wtf.fetch

async function fetchCategories(category, exclusions) {
	let result = await wtf.getCategoryPages(category, {
		...wikipediaOptions,
		recursive: true,
		categoryExclusions: exclusions
	})
	let resultCategories = result.filter(entry => entry.type == 'subcat')
	let resultPages = result.filter(entry => entry.type == 'page')
	assert.equal(resultCategories.length + resultPages.length, result.length)
	return {
		categories: [category, ...resultCategories.map(category => category.title)],
		pageNames: resultPages.map(page => page.title)
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

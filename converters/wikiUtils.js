const wtf = require('wtf_wikipedia');
const constants = require('./constants');

function fetchCategories(category, exclusions) {
	let categories = [];
	let pages = [];
	return wtf.category(category, 'en', constants.wikipediaOptions).then(result => {
		//console.log(result.pages);
		if (result.pages != null && result.pages.length > 0) {
			categories = [category];
			pages = result.pages.map(page => page.title);
		}
		let subCats = result.categories;
		if (exclusions) {
			subCats = subCats.filter(category => 
				!exclusions.includes(category.title)
			)
		}
		let promises = subCats.map(category => {
			return fetchCategories(category.title, exclusions)
		})
		return Promise.all(promises).then(results => {
			categories = categories.concat(...results.map(result => result.categories));
			//console.log(results.map(result => result.pageNames));
			pages = pages.concat(...results.map(result => result.pageNames));
			return {
				categories: categories,
				pageNames: pages
			};
		});
	});
}

async function fetchPages(pageNames) {
	if (pageNames.length > 0) {
		pageNames = [...new Set(pageNames)];//use the set to de-dupe
		return await wtf.fetch(pageNames, 'en', constants.wikipediaOptions);
	} else {
		return []
	}
}

function filterPages(data) {
	/* Some pages might be redirects to pages that aren't actually part of one of the categories that we're interested in, so filter those out*/
	//console.log(data);
	let categories = data.categories.map(category => 
		category.replace(/^Category:/, '').replace(/_/g, ' ')
	);
	return data.pages.filter(doc => 
		doc.categories.some(category => 
			categories.includes(category)
		)
	)
}

module.exports = {
	fetchCategories,
	fetchPages,
	filterPages
};

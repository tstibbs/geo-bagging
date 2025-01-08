//adapted from https://www.hills-database.co.uk/database_notes.html#classification

const classifications = {
	Ma: 'Marilyn',
	Hu: 'Hump',
	Sim: 'Simm',
	5: 'Dodd',
	M: 'Munro',
	MT: 'Munro Top',
	F: 'Furth',
	C: 'Corbett',
	G: 'Graham',
	D: 'Donald',
	DT: 'Donald Top',
	Hew: 'Hewitt',
	N: 'Nuttall',
	Dew: 'Dewey',
	DDew: 'Donald Dewey',
	HF: 'Highland Five',
	4: 'Tump (400-499m)',
	3: 'Tump (300-399m)',
	2: 'Tump (200-299m)',
	1: 'Tump (100-199m)',
	0: 'Tump (0-99m)',
	W: 'Wainwright',
	WO: 'Wainwright Outlying Fell',
	B: 'Birkett',
	Sy: 'Synge',
	Fel: 'Fellranger',
	E: 'Ethel',
	CoH: 'County Top – Historic',
	CoA: 'County Top – Administrative',
	CoU: 'County Top – Current',
	CoL: 'County Top – London Borough',
	SIB: 'Significant Island of Britain',
	Dil: 'Dillon',
	A: 'Arderin',
	VL: 'Vandeleur-Lynam',
	O: 'Other',
	Un: 'Unclassified',
	Tu: 'Tump',
	Mur: 'Murdo',
	CT: 'Corbett Top',
	GT: 'Graham Top',
	'B&L': 'Buxton & Lewis',
	Bg: 'Bridge',
	T100: 'Trail 100',
	Y: 'Yeaman',
	Cm: 'Clem',
	Ca: 'Carn',
	Bin: 'Binnion',
	HHB: 'High Hills of Britain'
}

const urlPaths = {
	Ma: 'https://www.hill-bagging.co.uk/hill-list/the-marilyns',
	Hu: 'https://www.hill-bagging.co.uk/hill-list/the-humps',
	Sim: 'https://www.hill-bagging.co.uk/hill-list/the-simms',
	5: 'https://www.hill-bagging.co.uk/hill-list/the-dodds',
	M: 'https://www.hill-bagging.co.uk/hill-list/the-munros',
	MT: 'https://www.hill-bagging.co.uk/hill-list/the-munro-tops',
	F: 'https://www.hill-bagging.co.uk/hill-list/the-furths',
	C: 'https://www.hill-bagging.co.uk/hill-list/the-corbetts',
	G: 'https://www.hill-bagging.co.uk/hill-list/the-grahams',
	D: 'https://www.hill-bagging.co.uk/hill-list/the-donalds',
	DT: 'https://www.hill-bagging.co.uk/hill-list/the-donald-tops',
	Hew: 'https://www.hill-bagging.co.uk/hill-list/the-hewitts',
	N: 'https://www.hill-bagging.co.uk/hill-list/the-nuttalls',
	Dew: 'https://www.hill-bagging.co.uk/hill-list/the-deweys',
	//"DDew"  //no dedicated page exists
	HF: 'https://www.hill-bagging.co.uk/hill-list/the-highland-fives',
	4: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	3: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	2: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	1: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	0: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	W: 'https://www.hill-bagging.co.uk/hill-list/the-wainwrights',
	WO: 'https://www.hill-bagging.co.uk/hill-list/the-wainwright-outlying-fells',
	B: 'https://www.hill-bagging.co.uk/hill-list/the-birketts',
	Sy: 'https://www.hill-bagging.co.uk/hill-list/the-synges',
	Fel: 'https://www.hill-bagging.co.uk/hill-list/the-fellrangers',
	E: 'https://www.hill-bagging.co.uk/hill-list/the-ethels',
	CoH: 'https://www.hill-bagging.co.uk/hill-list/the-historic-county-tops',
	CoA: 'https://www.hill-bagging.co.uk/hill-list/the-administrative-county-tops',
	CoU: 'https://www.hill-bagging.co.uk/hill-list/the-current-county-and-unitary-authority-tops',
	CoL: 'https://www.hill-bagging.co.uk/hill-list/the-london-borough-tops',
	SIB: 'https://www.hill-bagging.co.uk/hill-list/the-sibs',
	Dil: 'https://www.hill-bagging.co.uk/hill-list/the-dillons',
	A: 'https://www.hill-bagging.co.uk/hill-list/the-arderins',
	VL: 'https://www.hill-bagging.co.uk/hill-list/the-vandeleur-lynams',
	// "O"  //no dedicated page exists
	// "Un"  //no dedicated page exists
	Tu: 'https://www.hill-bagging.co.uk/hill-list/the-tumps',
	// 'Mur'  //no dedicated page exists
	// 'CT'  //no dedicated page exists
	// 'GT'  //no dedicated page exists
	// 'B&L'  //no dedicated page exists
	// 'Bg'  //no dedicated page exists
	T100: 'https://www.hill-bagging.co.uk/hill-list/the-trail-100s',
	Y: 'https://www.hill-bagging.co.uk/hill-list/the-yeamans',
	Cm: 'https://www.hill-bagging.co.uk/hill-list/the-clems',
	Ca: 'https://www.hill-bagging.co.uk/hill-list/the-carns',
	Bin: 'https://www.hill-bagging.co.uk/hill-list/the-binnions',
	HHB: 'https://www.hill-bagging.co.uk/hill-list/the-high-hills-of-britain'
}

const prefixes = {
	s: 'sub',
	x: 'deleted'
}

function applyPrefixes(dataset, prefix, qualifier) {
	return Object.fromEntries(
		Object.entries(dataset).map(([classKey, classLabel]) => {
			const key = `${prefix}${classKey}`
			const label = `${classLabel} [${qualifier}]`
			return [key, label]
		})
	)
}

const prefixedClassifications = Object.assign(
	{},
	...Object.entries(prefixes).map(([prefix, qualifier]) => applyPrefixes(classifications, prefix, qualifier))
)
export const labels = {...classifications, ...prefixedClassifications}

const prefixedUrlPaths = Object.assign(
	{},
	...Object.entries(prefixes).map(([prefix, qualifier]) => applyPrefixes(urlPaths, prefix, qualifier))
)
export const links = {...urlPaths, ...prefixedUrlPaths}

const baseBackendUrl = 'https://d1548rv5kyvrdp.cloudfront.net'

export default {
	mapTilerKey: '77JoMiPunwbv4PUOWDp6',
	osOpenDataKey: 'vWnckqIMRUgvAqfaN8jece3GEG3EGWZD',
	dataSources: [
		'follies',
		'hills',
		'milestones',
		'defence',
		'trails',
		'rnli',
		'nationalparks',
		'coastallandmarks',
		'counties'
	],
	legacyApiBackendBaseUrl: 'https://not_deployed.execute-api.eu-west-2.amazonaws.com/prod/',
	dataBackendBaseUrl: `${baseBackendUrl}/data/`,
	integrationBackendBaseUrl: `${baseBackendUrl}/integration/`
}

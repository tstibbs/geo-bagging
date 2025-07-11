const baseBackendUrl = 'https://d1548rv5kyvrdp.cloudfront.net'

export default {
	bingKey: 'redacted pending further investigation',
	mapTilerKey: '77JoMiPunwbv4PUOWDp6',
	dataSources: ['follies', 'hills', 'milestones', 'defence', 'trails', 'rnli', 'nationalparks', 'coastallandmarks'],
	legacyApiBackendBaseUrl: 'https://not_deployed.execute-api.eu-west-2.amazonaws.com/prod/',
	dataBackendBaseUrl: `${baseBackendUrl}/data/`,
	integrationBackendBaseUrl: `${baseBackendUrl}/integration/`
}

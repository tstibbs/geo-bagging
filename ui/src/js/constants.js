const baseBackendUrl = 'https://d1548rv5kyvrdp.cloudfront.net'

export default {
	bingKey: 'AgYJwt3nv3bZyK31EDXorMaO8aIix-5kAa32O5TTwFAhdVYtZdIKhw3ttntsmgqy',
	dataSources: ['follies', 'hills', 'milestones', 'defence', 'trails', 'rnli', 'nationalparks', 'coastallandmarks'],
	legacyApiBackendBaseUrl: 'https://not_deployed.execute-api.eu-west-2.amazonaws.com/prod/',
	dataBackendBaseUrl: `${baseBackendUrl}/data/`,
	integrationBackendBaseUrl: `${baseBackendUrl}/integration/`
}

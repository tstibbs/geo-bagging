import {google as googleapi} from 'googleapis'

const drive = googleapi.drive({version: 'v3'})

const visitsPrefix = 'visits'
const baseFolder = 'appDataFolder'

function recordVisit(client, source, name) {
	let fileMetadata = {
		name: `${visitsPrefix}-${source}-${name}`,
		parents: [baseFolder]
	}
	return drive.files.create({
		auth: client,
		resource: fileMetadata
	})
}

async function removeVisit(client, source, name) {
	let filename = `${visitsPrefix}-${source}-${name}`
	let res = await drive.files.list({
		spaces: baseFolder,
		auth: client,
		pageSize: 10,
		q: `name = '${filename}'`,
		fields: 'files(id)'
	})
	const files = res.data.files
	if (files.length) {
		let deletePromises = files.map(file =>
			drive.files.delete({
				auth: client,
				fileId: file.id
			})
		)
		return await Promise.all(deletePromises)
	} else {
		return null
	}
}

async function listVisits(client, source, nextPageToken) {
	let res = await drive.files.list({
		pageToken: nextPageToken,
		spaces: baseFolder,
		auth: client,
		pageSize: 10,
		q: `name contains '${visitsPrefix}-${source}'`,
		fields: 'nextPageToken, files(name)'
	})
	const files = res.data.files
	let fileNames
	if (files.length) {
		fileNames = [...new Set(files.map(file => file.name))]
	} else {
		fileNames = []
	}
	if (res.data.nextPageToken != null) {
		let fileNames2 = await listVisits(client, source, res.data.nextPageToken)
		return fileNames.concat(fileNames2)
	} else {
		return fileNames
	}
}

export {recordVisit, removeVisit, listVisits}

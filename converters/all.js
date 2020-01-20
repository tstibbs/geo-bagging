//automated download and processing
const coastallandmarksDownload = require('./coastallandmarks_download');
const coastallandmarksProcessing = require('./coastallandmarks');
const hillsDownload = require('./hills_download');
const hillsProcessing = require('./hills');
const milestonesDownload = require('./milestones_download');
const milestonesProcessing = require('./milestones');
const trailsDownload = require('./trails_download');
const trailsProcessing = require('./trails');
const defenceDownload = require('./defence_download');
const defenceProcessing = require('./defence');
const folliesDownload = require('./follies_download');
const folliesProcessing = require('./follies');
const rnliDownload = require('./rnli_download');
const rnliProcessing = require('./rnli');
const nationalparksDownload = require('./nationalparks_download');
const nationalparksProcessing = require('./nationalparks');
//don't require seperate download
const ntProcessing = require('./nt');
//require manual download
const trigsProcessing = require('./trigs');


let allDownloads = [
	defenceDownload(),
	hillsDownload(),
	milestonesDownload(),
	trailsDownload(),
	folliesDownload(),
	rnliDownload(),
	nationalparksDownload(),
	coastallandmarksDownload()
];
Promise.all(allDownloads).then(() => {
	console.log("");
	console.log("Initial download finished.");
	console.log("");
}).then(async () => {
	//processing downloaded stuff
	let processors = [
		'defence',
		'hills',
		'milestones',
		'trails',
		'follies',
		'rnli',
		'nationalparks',
		'coastallandmarks',
		//downloading and processing together
		'nt',
		//processing manually downloaded stuff
		'trigs'
	];
	for (const processorName of processors) {
		console.log(`Starting processing ${processorName}.`);
		let processor = eval(`${processorName}Processing`);
		try {
			await processor();
			console.log(`Processing ${processorName} completed.`);
		} catch (err) {
			console.log(`Processing ${processorName} errored.`);
			console.log(err);
		}
	}
});

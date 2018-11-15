//automated download and processing
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
	rnliDownload()
];
Promise.all(allDownloads).then(() => {
	console.log("");
	console.log("Initial download finished.");
	console.log("");
}).then(() => {
	//processing downloaded stuff
	defenceProcessing();
	hillsProcessing();
	milestonesProcessing();
	trailsProcessing();
	folliesProcessing();
	rnliProcessing();
	//downloading and processing together
	ntProcessing();
	//processing manually downloaded stuff
	//trigsProcessing();
});

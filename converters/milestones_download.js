const fs = require('fs');
const download = require('./downloader').download;

const allFiles = [
	'MSS_Summary_Sheet_Milestones_East.xls',
	'MSS_Summary_Sheet_Milestones_Wales.xls',
	'MSS_Summary_Sheet_Milestones_South_West_(Inner).xls',
	'MSS_Summary_Sheet_Milestones_Yorkshire.xls',
	'MSS_Summary_Sheet_Milestones_North_East.xls',
	'MSS_Summary_Sheet_Milestones_North_West.xls',
	'MSS_Summary_Sheet_Milestones_Scotland.xls',
	'MSS_Summary_Sheet_Milestones_South_East.xls',
	'MSS_Summary_Sheet_Milestones_South_West_(Outer).xls',
	'MSS_Summary_Sheet_Milestones_East_Midlands.xls',
	'MSS_Summary_Sheet_Milestones_West_Midlands.xls',
	'MSS_Summary_Sheet_Boundary_Markers.xls',
	'MSS_Summary_Sheet_AA_Signs.xls',
	'MSS_Summary_Sheet_Canal_Milemarkers.xls',
	'MSS_Summary_Sheet_Crosses.xls',
	'MSS_Summary_Sheet_Fingerposts.xls',
	'MSS_Summary_Sheet_Milestones_Missing.xls',
	'MSS_Summary_Sheet_Milestones_New.xls',
	'MSS_Summary_Sheet_Milestones_Out_of_Place.xls',
	'MSS_Summary_Sheet_Tollhouses.xls'
];

const outputDir = 'milestones-input';

let promises = allFiles.map(fileName => 
	download(`http://www.msocrepository.co.uk/Excel%20Spreadsheets/${fileName}`, outputDir, fileName)
);
Promise.all(promises).then(values => { 
	console.log("finished downloading all");
}).catch(reason => { 
	console.log("something went wrong downloading files: " + reason)
});

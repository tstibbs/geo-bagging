import {ifCmd} from './utils.js'
import {download as downloadFiles} from './downloader.js'

//TODO these files have moved, and appear to have a date in their url
//we'll probably have to scrape https://www.msocrepository.co.uk/excel-spreadsheet-files/ and extract the links from that
//or is it all just on geograph now? If so, what about the ones that didn't have photos?
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
]

function download() {
	let urls = allFiles.reduce((urls, fileName) => {
		urls[
			`http://www.msocrepository.co.uk/Excel%20Spreadsheets/${fileName}`
		] = fileName
		return urls
	}, {})
	return downloadFiles('milestones', urls)
}

ifCmd(import.meta, download)

export default download

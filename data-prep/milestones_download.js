import {ifCmd} from '@tstibbs/cloud-core-utils'
import {download as downloadFiles} from './downloader.js'

/* NOTE
 * The milestones database closed to updates and was effectively 'frozen' in 2018.
 * We therefore already have the latest version, so downloading from that database is pointless.
 * The database was replicated into historic England's database, and it seems unlikely to get updated any further in that location.
 * The entries with photographs were replicated in to geograph (i.e. missing the 30% of the database that were without photos). It remains to be seen whether this attracts more updates and whether these maintain the same level of quality.
 * Pausing updates of this source until it appears valuable to pull from one of the alternative sources.
 */
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
		urls[`http://www.msocrepository.co.uk/Excel%20Spreadsheets/${fileName}`] = fileName
		return urls
	}, {})
	return downloadFiles('milestones', urls)
}

ifCmd(import.meta, download)

export default download

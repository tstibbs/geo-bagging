import proj4 from 'proj4'
import {coordEach} from '@turf/turf'

const LEAFLET_DEFAULT_CRS = 'WGS84'

export function reprojectGeometry(fromCrs, geometry) {
	//clone
	const reprojected = JSON.parse(JSON.stringify(geometry))

	coordEach(reprojected, currentCoord => {
		const newCoord = proj4(fromCrs, LEAFLET_DEFAULT_CRS, currentCoord)

		currentCoord[0] = newCoord[0]
		currentCoord[1] = newCoord[1]
	})

	// Remove the CRS property, as the data is now in the default CRS (WGS84).
	delete reprojected.crs

	return reprojected
}

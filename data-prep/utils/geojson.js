import {simplify as turfSimplify, truncate} from '@turf/turf'

// 6 decimal places gives you around 10cm resolution for the whole of the British Isles
const coordDecimalPrecision = 6

/** WILL MUTATE INPUT. truncates coord lengths; removes unnecessary coords; removes unnecessary amounts of detail */
export function simplify(geojson, simplificationTolerance) {
	geojson = truncate(geojson, {
		precision: coordDecimalPrecision,
		mutate: true
	})
	geojson = turfSimplify(geojson, {
		tolerance: simplificationTolerance,
		highQuality: true,
		mutate: true
	})
	return geojson
}

import {Canvas} from 'skia-canvas'
import {geoMercator, geoPath} from 'd3-geo'

import {gbBoundsAsGeoJson} from './utils/bounds.js'

export async function geojsonToPng(geojson, outputFile) {
	const width = 1000
	const height = 1000
	const canvas = new Canvas(width, height)
	const ctx = canvas.getContext('2d')
	ctx.fillStyle = '#ffffff'
	ctx.fillRect(0, 0, width, height)

	//set bounds to bounds of the UK so that changes in bounds between the old and new data doesn't affect the scaling of the image (which could otherwise cause false positive differences)
	const projection = geoMercator().fitSize([width, height], {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'MultiPolygon',
					coordinates: [[gbBoundsAsGeoJson]]
				}
			}
		]
	})

	const projectedGeoPath = geoPath().projection(projection).context(ctx)
	geojson.features.forEach(feature => {
		ctx.beginPath()
		projectedGeoPath(feature)
		ctx.strokeStyle = '#000000'
		ctx.lineWidth = 1
		ctx.stroke()
	})

	await canvas.toFile(outputFile)
}

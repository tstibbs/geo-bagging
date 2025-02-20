import RBush from 'rbush'
import {bbox, intersect, union, featureCollection} from '@turf/turf'

export function mergePolygons(features) {
	//load tree
	const tree = new RBush()
	const featuresWithBounds = features.map(feature => {
		const [minX, minY, maxX, maxY] = bbox(feature)
		return {
			minX,
			minY,
			maxX,
			maxY,
			feature
		}
	})
	tree.load(featuresWithBounds)

	//iterate polygons and merge
	let mergedPolygons = []
	const processedFeatures = new Set()

	let aMergeHappened = false
	features.forEach(feature => {
		//skip features that were processed due to merging with a previous feature
		if (!processedFeatures.has(feature)) {
			let currentPolygon = feature
			const featuresToMerge = []

			//Find features who's bounds overlap (but the polygons might not)
			const [minX, minY, maxX, maxY] = bbox(feature)
			const potentialOverlaps = tree.search({
				minX,
				minY,
				maxX,
				maxY
			})

			potentialOverlaps.forEach(potentialOverlap => {
				const poFeature = potentialOverlap.feature
				//skip this feature and any already processed
				if (feature !== poFeature && !processedFeatures.has(poFeature)) {
					const intersection = intersect(featureCollection([currentPolygon, poFeature]))
					if (intersection) {
						// Check if they _actually_ intersect
						featuresToMerge.push(poFeature)
						processedFeatures.add(poFeature)
						aMergeHappened = true
					}
				}
			})

			//merge all actual overlaps
			featuresToMerge.forEach(poFeature => {
				currentPolygon = union(featureCollection([currentPolygon, poFeature]))
			})

			mergedPolygons.push(currentPolygon)
			processedFeatures.add(feature)
		}
	})
	//if a merge happened, recur down until no more merges happen (because the
	// resulting polygons might overlap even though their initial members didn't)
	if (aMergeHappened) {
		mergedPolygons = mergePolygons(mergedPolygons)
	}
	return mergedPolygons
}

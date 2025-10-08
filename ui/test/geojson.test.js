import {calcGeoJsonBounds} from '../src/js/utils/geojson.js'
import largeExampleInput from './utils/geojson_test-input.json'
import largeExampleExpectedBounds from './utils/geojson_test-expected.json'

const POINT_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'Point',
		coordinates: [102.0, 0.5]
	},
	properties: {}
}
const POINT_FEATURE_BOUNDS = boundsOf([
	[102.0 - 0.01, 0.5 + 0.005],
	[102.0 + 0.01, 0.5 + 0.005],
	[102.0 + 0.01, 0.5 - 0.005],
	[102.0 - 0.01, 0.5 - 0.005],
	[102.0 - 0.01, 0.5 + 0.005]
])
const LINE_STRING_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'LineString',
		coordinates: [
			[102.0, 0.0],
			[103.0, 1.0],
			[104.0, 0.0],
			[105.0, 1.0]
		]
	},
	properties: {}
}
const LINE_STRING_FEATURE_BOUNDS = boundsOf([
	[102.0 - 0.01, 1.0 + 0.005],
	[105.0 + 0.01, 1.0 + 0.005],
	[105.0 + 0.01, 0.0 - 0.005],
	[102.0 - 0.01, 0.0 - 0.005],
	[102.0 - 0.01, 1.0 + 0.005]
])
const POLYGON_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'Polygon',
		coordinates: [
			[
				[100.0, 0.0],
				[101.0, 0.0],
				[101.0, 1.0],
				[100.0, 1.0],
				[100.0, 0.0]
			]
		]
	},
	properties: {}
}
const POLYGON_FEATURE_BOUNDS = boundsOf([
	[100.0 - 0.01, 1.0 + 0.005],
	[101.0 + 0.01, 1.0 + 0.005],
	[101.0 + 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 1.0 + 0.005]
])
const MULTI_POINT_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'MultiPoint',
		coordinates: [
			[100.0, 0.0],
			[101.0, 1.0]
		]
	},
	properties: {}
}
const MULTI_POINT_FEATURE_BOUNDS = boundsOf([
	[100.0 - 0.01, 1.0 + 0.005],
	[101.0 + 0.01, 1.0 + 0.005],
	[101.0 + 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 1.0 + 0.005]
])
const MULTI_LINE_STRING_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'MultiLineString',
		coordinates: [
			[
				[100.0, 0.0],
				[101.0, 1.0]
			],
			[
				[102.0, 2.0],
				[103.0, 3.0]
			]
		]
	},
	properties: {}
}
const MULTI_LINE_STRING_FEATURE_BOUNDS = boundsOf([
	[100.0 - 0.01, 3.0 + 0.005],
	[103.0 + 0.01, 3.0 + 0.005],
	[103.0 + 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 0.0 - 0.005],
	[100.0 - 0.01, 3.0 + 0.005]
])
const MULTI_POLYGON_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'MultiPolygon',
		coordinates: [
			[
				[
					[102.0, 2.0],
					[103.0, 2.0],
					[103.0, 3.0],
					[102.0, 3.0],
					[102.0, 2.0]
				]
			],
			[
				[
					[100.0, 0.0],
					[101.0, 0.0],
					[101.0, 1.0],
					[100.0, 1.0],
					[100.0, 0.0]
				],
				[
					[100.2, -0.2],
					[100.2, 0.8],
					[106.8, 0.8],
					[106.8, -0.2],
					[100.2, -0.2]
				]
			]
		]
	},
	properties: {}
}
const MULTI_POLYGON_FEATURE_BOUNDS = boundsOf([
	[100.0 - 0.01, 3.0 + 0.005],
	[106.8 + 0.01, 3.0 + 0.005],
	[106.8 + 0.01, -0.2 - 0.005],
	[100.0 - 0.01, -0.2 - 0.005],
	[100.0 - 0.01, 3.0 + 0.005]
])
const GEOM_COLLECTION_FEATURE = {
	type: 'Feature',
	geometry: {
		type: 'GeometryCollection',
		geometries: [
			{
				type: 'Point',
				coordinates: [100.0, -4.0]
			},
			{
				type: 'LineString',
				coordinates: [
					[101.0, 0.0],
					[102.0, 1.0]
				]
			}
		]
	},
	properties: {}
}
const GEOM_COLLECTION_FEATURE_BOUNDS = boundsOf([
	[100.0 - 0.01, 1.0 + 0.005],
	[102.0 + 0.01, 1.0 + 0.005],
	[102.0 + 0.01, -4.0 - 0.005],
	[100.0 - 0.01, -4.0 - 0.005],
	[100.0 - 0.01, 1.0 + 0.005]
])

function boundsOf(bounds) {
	return {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [bounds]
		}
	}
}

function featureCollectionOf(...features) {
	return {
		type: 'FeatureCollection',
		features: features
	}
}

describe('calcGeoJsonBounds', () => {
	test('handle collection of Point features', () => {
		const geoJsonFeatures = featureCollectionOf(POINT_FEATURE)
		const expectedBounds = [POINT_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of LineString features', () => {
		const geoJsonFeatures = featureCollectionOf(LINE_STRING_FEATURE)
		const expectedBounds = [LINE_STRING_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of Polygon features', () => {
		const geoJsonFeatures = featureCollectionOf(POLYGON_FEATURE)
		const expectedBounds = [POLYGON_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of MultiPoint features', () => {
		const geoJsonFeatures = featureCollectionOf(MULTI_POINT_FEATURE)
		const expectedBounds = [MULTI_POINT_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of MultiLineString features', () => {
		const geoJsonFeatures = featureCollectionOf(MULTI_LINE_STRING_FEATURE)
		const expectedBounds = [MULTI_LINE_STRING_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of MultiPolygon features', () => {
		const geoJsonFeatures = featureCollectionOf(MULTI_POLYGON_FEATURE)
		const expectedBounds = [MULTI_POLYGON_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle collection of GeometryCollection features', () => {
		const geoJsonFeatures = featureCollectionOf(GEOM_COLLECTION_FEATURE)
		const expectedBounds = [GEOM_COLLECTION_FEATURE_BOUNDS]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handle multiple features in a collection', () => {
		const geoJsonFeatures = featureCollectionOf(
			POINT_FEATURE,
			LINE_STRING_FEATURE,
			POLYGON_FEATURE,
			MULTI_POINT_FEATURE,
			MULTI_LINE_STRING_FEATURE,
			MULTI_POLYGON_FEATURE,
			GEOM_COLLECTION_FEATURE
		)
		const expectedBounds = [
			POINT_FEATURE_BOUNDS,
			LINE_STRING_FEATURE_BOUNDS,
			POLYGON_FEATURE_BOUNDS,
			MULTI_POINT_FEATURE_BOUNDS,
			MULTI_LINE_STRING_FEATURE_BOUNDS,
			MULTI_POLYGON_FEATURE_BOUNDS,
			GEOM_COLLECTION_FEATURE_BOUNDS
		]
		const result = calcGeoJsonBounds(geoJsonFeatures)
		expect(result).toEqual(expectedBounds)
	})

	test('handles large inputs', () => {
		const result = calcGeoJsonBounds(largeExampleInput)
		expect(result).toEqual(largeExampleExpectedBounds)
	}, 5000)

	describe('handles things other than a collection', () => {
		test('point', () => {
			const result = calcGeoJsonBounds(POINT_FEATURE)
			expect(result).toEqual([POINT_FEATURE_BOUNDS])
		})
		test('line string', () => {
			const result = calcGeoJsonBounds(LINE_STRING_FEATURE)
			expect(result).toEqual([LINE_STRING_FEATURE_BOUNDS])
		})
		test('polygon', () => {
			const result = calcGeoJsonBounds(POLYGON_FEATURE)
			expect(result).toEqual([POLYGON_FEATURE_BOUNDS])
		})
		test('multipoint', () => {
			const result = calcGeoJsonBounds(MULTI_POINT_FEATURE)
			expect(result).toEqual([MULTI_POINT_FEATURE_BOUNDS])
		})
		test('multi line string', () => {
			const result = calcGeoJsonBounds(MULTI_LINE_STRING_FEATURE)
			expect(result).toEqual([MULTI_LINE_STRING_FEATURE_BOUNDS])
		})
		test('multi polygon', () => {
			const result = calcGeoJsonBounds(MULTI_POLYGON_FEATURE)
			expect(result).toEqual([MULTI_POLYGON_FEATURE_BOUNDS])
		})
		test('geom', () => {
			const result = calcGeoJsonBounds(GEOM_COLLECTION_FEATURE)
			expect(result).toEqual([GEOM_COLLECTION_FEATURE_BOUNDS])
		})
	})
})

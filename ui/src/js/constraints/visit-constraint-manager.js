const DIMENSION_NAME = 'Visited'
const DIMENSION_LABEL = 'Visited?'

export const VisitConstraintManager = class {
	#hasVisitLimits = false
	#visitConstraints = {}

	translateAspect(aspectOptions, bundleName) {
		if (this.#hasVisitsForSource(bundleName)) {
			aspectOptions.dimensionNames = [DIMENSION_NAME, ...aspectOptions.dimensionNames]
			aspectOptions.dimensionLabels = {
				[DIMENSION_NAME]: DIMENSION_LABEL,
				...(aspectOptions.dimensionLabels ?? {})
			}
		}
		return aspectOptions
	}

	translateDimensionString(id, bundleName) {
		let dimensionValues = id
		if (this.#hasVisitsForSource(bundleName)) {
			dimensionValues = this.translateDimensionValues([id], id, bundleName).join('/')
		}
		return dimensionValues
	}

	translateDimensionValues(dimensionValues, id, bundleName) {
		if (this.#hasVisitsForSource(bundleName)) {
			let visited = this.#visitConstraints[bundleName]?.includes(id)
			let value = visited ? 'Visited' : 'Not Visited'
			dimensionValues = [value, ...dimensionValues]
		}
		return dimensionValues
	}

	#hasVisitsForSource(bundleName) {
		return this.#hasVisitLimits && this.#visitConstraints[bundleName] != null
	}

	setVisitConstraints(visitConstraints) {
		this.#hasVisitLimits = true
		this.#visitConstraints = visitConstraints
	}

	reset() {
		this.#hasVisitLimits = false
		this.#visitConstraints = {}
	}
}

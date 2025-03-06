export const VisitConstraintManager = class {
	#hasVisitLimits = false
	#visitConstraints = {}

	translateAspect(aspectOptions) {
		if (this.#hasVisitLimits) {
			if (aspectOptions.dimensionNames != null) {
				aspectOptions.dimensionNames = ['Visited', ...aspectOptions.dimensionNames]
			}
			if (aspectOptions.dimensionLabels != null) {
				aspectOptions.dimensionLabels = ['Visited?', ...aspectOptions.dimensionLabels]
			}
		}
		return aspectOptions
	}

	translateDimensionString(id, bundleName) {
		let dimensionValues = id
		if (this.#hasVisitLimits) {
			dimensionValues = this.translateDimensionValues([id], id, bundleName).join('/')
		}
		return dimensionValues
	}

	translateDimensionValues(dimensionValues, id, bundleName) {
		if (this.#hasVisitLimits) {
			let visited = this.#visitConstraints[bundleName]?.includes(id)
			let value = visited ? 'Visited' : 'Not Visited'
			dimensionValues = [value, ...dimensionValues]
		}
		return dimensionValues
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

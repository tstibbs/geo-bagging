const coordRoundingFactor = Math.pow(10, 5) //i.e. round to 5 decimal places

export function floatToSensiblePrecision(val) {
	return Math.round(val * coordRoundingFactor) / coordRoundingFactor
}

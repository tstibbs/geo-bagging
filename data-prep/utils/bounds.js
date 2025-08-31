let north = 61.0613 //North of Out Stack, Shetland
let south = 48.8712 //South of the southernmost of Jersey's islands
let east = 2.0922 //East of Lowestoft Ness, Suffolk, England
let west = -14.0151 //West of Rockall

export const gbBoundsAsGeoJson = [
	[west, south],
	[west, north],
	[east, north],
	[east, south],
	[west, south]
]

export function pointIsInGb(lat, lng) {
	return lat > south && lat < north && lng > west && lng < east
}

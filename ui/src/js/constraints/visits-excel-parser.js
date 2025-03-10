import ExcelJS from 'exceljs'

const ID_FIELD_NAME = 'ID'
const SOURCE_FIELD_NAME = 'Source ID'

export async function fileToSources(file) {
	const workbook = new ExcelJS.Workbook()
	const arrayBuffer = await file.arrayBuffer()
	await workbook.xlsx.load(arrayBuffer)
	const worksheet = workbook.getWorksheet(1)

	const rawData = []
	worksheet.eachRow({includeEmpty: true}, row => {
		const rowData = []
		row.eachCell({includeEmpty: true}, cell => {
			rowData.push(cell.value)
		})
		rawData.push(rowData)
	})
	const headerRow = rawData[0]
	const dataRows = rawData.slice(1)
	const idIdx = headerRow.indexOf(ID_FIELD_NAME)
	const sourceIdx = headerRow.indexOf(SOURCE_FIELD_NAME)
	if (idIdx == -1 || sourceIdx == -1) {
		throw new Error(`Malformed excel, must contains columns named '${ID_FIELD_NAME}' and '${SOURCE_FIELD_NAME}'.`)
	}
	const data = dataRows
		.map(row => ({
			id: row.at(idIdx),
			source: row.at(sourceIdx)
		}))
		.filter(({id, source}) => id != null && source != null)
		.map(({id, source}) => ({
			id: stringify(id),
			source: stringify(source)
		}))
		.filter(({id, source}) => !empty(id) && !empty(source))
	const dataBySource = Object.groupBy(data, row => row.source)
	const idsBySource = Object.fromEntries(
		Object.entries(dataBySource).map(([source, entries]) => {
			const ids = entries.map(({id}) => id)
			return [source, ids]
		})
	)
	return idsBySource
}

function empty(str) {
	return str == null || str.trim().length == 0
}

function stringify(val) {
	return typeof val === 'string' ? val : `${val}`
}

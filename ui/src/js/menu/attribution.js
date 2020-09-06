import $ from 'jquery'
import leaflet from 'VendorWrappers/leaflet'

var AttributionView = leaflet.Class.extend({
	initialize: function (container) {
		this._container = container
		let copyright = $(
			`<div class="attribution-entry"></div>
	<span class="attribution-source">Geo-bagging</span>
	<span>
		The code on this site is copyright 
		<a href="https://github.com/tstibbs">tstibbs</a>/stripycoder, 
		licenced under AGPL, 
		source code available at 
		<a href="https://github.com/tstibbs/geo-bagging">here</a>.
	</span>
	<br />
	<span>
		Many open source libraries help make this project, see a full list in <a href="licenses.txt">licenses.txt</a>.
	</span>
</div>`
		)
		this._container.append(copyright)
	},

	addAttribution: function (dataSourceName, text) {
		let attribution = $(
			`<div class="attribution-entry">
	<span class="attribution-source">${dataSourceName} data</span>
	<span>${text}</span>
</div>`
		)
		this._container.append(attribution)
	}
})

export default AttributionView

import $ from 'jquery'
import conversion from '../../conversion.js'
import CustomDefaultIcon from '../../custom_default_icon.js'
import trigpointingBase from './config_base.js'
import TrigsPointsBuilder from './points_builder.js'
import redIcon from '../../../img/hill.png'

export default function build(config) {
	return $.extend(true, {}, trigpointingBase(config), {
		icons: {
			searchResult: new CustomDefaultIcon(config, redIcon, {
				iconUrl: redIcon
			})
		},
		parser: TrigsPointsBuilder.extend({
			initialize: function (manager, bundleConfig, bundleName, urlPrefix) {
				TrigsPointsBuilder.prototype.initialize.call(this, manager, bundleConfig, bundleName, urlPrefix)
				var generalPoints = this._config.pointsToLoad.generalPoints
				for (var i = 0; i < generalPoints.length; i++) {
					var point = generalPoints[i]
					var lngLat = conversion.osgbToLngLat(point.eastings, point.northings)
					this.addWithoutDimensions(lngLat, point.url, point.name)
				}
				var significantPoint = this._config.pointsToLoad.significantPoint
				if (significantPoint != null) {
					var lngLat = conversion.osgbToLngLat(significantPoint.eastings, significantPoint.northings)
					var iconName = 'searchResult'
					this.addWithoutDimensions(lngLat, significantPoint.url, significantPoint.name, iconName)
				}
			},

			fetchData: function () {
				//not relevant, ignore
				return $.Deferred().resolve().promise()
			},

			fetchMeta: function () {
				//not relevant, ignore
				return $.Deferred().resolve().promise()
			}
		})
	})
}

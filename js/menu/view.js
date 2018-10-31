define([
	'jquery',
	'leaflet',
	'leaflet_sidebar',
	'mobile'
],
    function(
		$,
		leaflet,
		Leaflet_Sidebar,
		mobile
	) {
        var MenuView = leaflet.Class.extend({
			_buildView: function() {
				var view = '';
				
				var classes = ['sidebar', 'collapsed', 'leaflet-container']
				if (mobile.isMobile()) {
					classes.push('mobile');
				}
				
				//top of the navigation bar
				view += '<div id="sidebar" class="' + classes.join(' ') + '">';
				view += '    <div class="sidebar-tabs">';
				view += '        <ul role="tablist">';
				view += '            <li><a href="#sidebar-layers" role="tab"><i class="fa fa-bars"></i></a></li>';
				// view += '            <li><a href="#profile" role="tab"><i class="fa fa-user"></i></a></li>';
				// view += '            <li><a href="#sidebar-layers" role="tab"><i class="fa fa-map"></i></a></li>';
				// view += '            <li><a href="#export" role="tab"><i class="fa fa-cloud-download"></i></a></li>';
				view += '        </ul>';

				//bottom of the navigation bar
				// view += '        <ul role="tablist">';
				// view += '            <li><a href="#settings" role="tab"><i class="fa fa-gear"></i></a></li>';
				// view += '        </ul>';
				view += '    </div>';

				//tab contents
				view += '    <div class="sidebar-content">';
				view += '        <div id="sidebar-layers" class="sidebar-pane">';
				view += '            <h1 class="sidebar-header">Layers<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>';
				view += '        </div>';
				view += '    </div>';
				view += '</div>';
				
				this._view = $(view);
				$('body').append(this._view);
			},
			
			_buildControl: function() {
				this._control = new Leaflet_Sidebar('sidebar');
			},
			
			initialize: function() {
				this._buildView();
				this._buildControl();
			},
			
			addTo: function(map) {
				this._control.addTo(map);
			},

			getContainer: function() {
				return this._view[0];//get raw dom element from jquery
			},
			
			addLayers: function(matrixLayerControl) {
				$('#sidebar-layers', this._view).append(matrixLayerControl.getContainer());
			}
		});
		return MenuView;
    }
);

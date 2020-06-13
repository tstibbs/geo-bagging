import $ from 'jquery';
import leaflet from 'leaflet';
import Leaflet_Sidebar from 'leaflet_sidebar';
import AttributionView from './attribution';
import UserView from './user';
import ConstraintsView from './constraints/view';
import params from '../params';
        var MenuView = leaflet.Class.extend({
			initialize: function(manager) {
				this._manager = manager;
				this._buildView();
				this._buildControl();
			},

			_buildView: function() {
				var view = '';
				
				var classes = ['sidebar', 'collapsed', 'leaflet-container'];
				
				var showUserSettings = (params.test('testing') == 'true');
				
				//top of the navigation bar
				view += '<div id="sidebar" class="' + classes.join(' ') + '">';
				view += '    <div class="sidebar-tabs">';
				view += '        <ul role="tablist">';
				view += '            <li><a href="#sidebar-layers" role="tab"><i class="fa fa-bars"></i></a></li>';
				view += '            <li><a href="#sidebar-constraints" role="tab"><i class="fa fa-map-o"></i></a></li>';
				view += '        </ul>';

				//bottom of the navigation bar
				view += '        <ul role="tablist">';
				if (showUserSettings) {
					view += '            <li><a href="#sidebar-user" role="tab"><i class="fa fa-user"></i></a></li>';
				}
				view += '            <li><a href="#sidebar-attribution" role="tab"><i class="fa fa-copyright"></i></a></li>';
				view += '        </ul>';
				view += '    </div>';

				//tab contents
				view += '    <div class="sidebar-content">';
				view += '        <div id="sidebar-layers" class="sidebar-pane">';
				view += '            <h1 class="sidebar-header">Layers<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>';
				view += '        </div>';
				view += '        <div id="sidebar-constraints" class="sidebar-pane">';
				view += '            <h1 class="sidebar-header">Data Limits<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>';
				view += '        </div>';
				view += '        <div id="sidebar-attribution" class="sidebar-pane">';
				view += '            <h1 class="sidebar-header">Attribution<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>';
				view += '        </div>';
				if (showUserSettings) {
					view += '        <div id="sidebar-user" class="sidebar-pane">';
					view += '            <h1 class="sidebar-header">User Settings<span class="sidebar-close"><i class="fa fa-caret-left"></i></span></h1>';
					view += '        </div>';
				}
				view += '    </div>';
				view += '</div>';
				
				this._view = $(view);
				this._manager.getConfig().map_outer_container_element.append(this._view);
				
				var attributionContainer = $('<div></div>');
				$('#sidebar-attribution', this._view).append(attributionContainer);
				this._attributionView = new AttributionView(attributionContainer);
				
				if (showUserSettings) {
					var userView = new UserView(this._manager);
					$('#sidebar-user', this._view).append(userView.getView());
				}
				
				var constraintsView = new ConstraintsView(this._manager);
				$('#sidebar-constraints', this._view).append(constraintsView.getView())
			},
			
			_buildControl: function() {
				this._control = new Leaflet_Sidebar('sidebar');
			},
			
			addTo: function(map) {
				this._control.addTo(map);
			},

			getContainer: function() {
				return this._view[0];//get raw dom element from jquery
			},
			
			addLayers: function(matrixLayerControl) {
				$('#sidebar-layers', this._view).append(matrixLayerControl.getContainer());
			},
			
			addAttribution: function(dataSourceName, text) {
				this._attributionView.addAttribution(dataSourceName, text);
			}
		});
		export default MenuView;
    

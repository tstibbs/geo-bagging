//Have to import all css files up front to force the ordering
//note these should be repeated as dependencies of the thing that actually uses them

//third party
import 'leaflet/dist/leaflet.css'
import 'Leaflet.MapCenterCoord/src/L.Control.MapCenterCoord.css'
import 'leaflet-mouse-position/src/L.Control.MousePosition.css'
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet-geosearch/src/css/l.geosearch.css'
import 'sidebar-v2/css/leaflet-sidebar.css'

//my modules that are external to this project
import 'leaflet-matrix-layers-control/src/matrixControl.css'
import 'leaflet-box-selector/src/selector.css'
import 'leaflet-control-hider/src/hider.css'

//this project's styles
import '../../style/main.scss'

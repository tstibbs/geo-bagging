import leaflet from 'leaflet';

import "leaflet/dist/leaflet.css";

delete leaflet.Icon.Default.prototype._getIconUrl;
// workaround for https://github.com/Leaflet/Leaflet/issues/4968
let iconUrl = require('leaflet/dist/images/marker-icon.png').default
let retinaUrl = require('leaflet/dist/images/marker-icon-2x.png').default
let shadowUrl = require('leaflet/dist/images/marker-shadow.png').default

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: window.os_map_base + retinaUrl,
  iconUrl: window.os_map_base + iconUrl,
  shadowUrl: window.os_map_base + shadowUrl,
});

export default leaflet

import leaflet from 'leaflet';

import "leaflet/dist/leaflet.css";

delete leaflet.Icon.Default.prototype._getIconUrl;
// workaround for https://github.com/Leaflet/Leaflet/issues/4968
let iconUrl = require('leaflet/dist/images/marker-icon.png').default
let retinaUrl = require('leaflet/dist/images/marker-icon-2x.png').default
let shadowUrl = require('leaflet/dist/images/marker-shadow.png').default


leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: retinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

export default leaflet

//has to run before anything else
if (window.os_map_base == null) {
    window.os_map_base = ''
}

import '../style/main.scss'
import mapLoader from './map_loader'
mapLoader.loadMap({})

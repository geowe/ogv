import 'ol/ol.css';
import { Map, View } from 'ol';
import { defaults as defaultControls, ScaleLine } from 'ol/control';
import { transform } from 'ol/proj.js';

const DEFAULT_PROJECTION = 'EPSG:3857';

class MapInitializer {
  constructor () {
    this._map = new Map({
      controls: defaultControls({
        zoom: false,
        attribution: true,
        attributionOptions: {
          collapsible: false
        }
      }).extend(
        [new ScaleLine()]
      ),
      target: 'map',
      layers: [],
      view: new View({
        projection: DEFAULT_PROJECTION,
        center: transform([-4.7, 39.02], 'EPSG:4326', DEFAULT_PROJECTION),
        zoom: 6
      })
    });
  }

  getMap () {
    return this._map;
  }
}

export default new MapInitializer();

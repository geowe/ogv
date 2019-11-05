import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import Stamen from 'ol/source/Stamen';
import { BingMaps } from 'ol/source';

const NO_ATTRIBUTION_MESSAGE = 'No attributions provided';
class BasemapBuilder {
  getOSM () {
    return new TileLayer({
      source: new OSM()
    });
  }

  getOSMGreyColor () {
    var grayOsmLayer = new TileLayer({
      source: new OSM()
    });

    grayOsmLayer.on('postrender', (event) => {
      this.greyscale(event.context);
    });

    return grayOsmLayer;
  }

  greyscale (context) {
    var canvas = context.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      // CIE luminance for the RGB
      var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // Show white color instead of black color while loading new tiles:
      if (v === 0.0) { v = 255.0; }
      data[i + 0] = v; // Red
      data[i + 1] = v; // Green
      data[i + 2] = v; // Blue
      data[i + 3] = 255; // Alpha
    }
    context.putImageData(imageData, 0, 0);
  }

  getOSMStamen (stamen) {
    const i = stamen.indexOf('-');
    const name = stamen.slice(i + 1);

    return new TileLayer({
      source: new Stamen({
        layer: name
      })
    });
  }

  getOSMTiles (url) {
    return new TileLayer({
      source: new OSM({
        url: url
      })
    });
  }

  getBingMap (key) {
    return new TileLayer({
      visible: false,
      preload: Infinity,
      source: new BingMaps({
        key: key,
        imagerySet: 'Aerial'
      })
    });
  }

  getWMSLayer (layerSettings) {
    return new TileLayer({
      title: layerSettings.title,
      source: new TileWMS({
        attributions: layerSettings.attributions !== undefined ? layerSettings.attributions : NO_ATTRIBUTION_MESSAGE,
        url: layerSettings.url,
        params: {
          LAYERS: layerSettings.layers,
          SRS: layerSettings.srs !== undefined ? layerSettings.srs : 'EPSG:3857',
          FORMAT: layerSettings.format !== undefined ? layerSettings.format : 'image/png'
        }
      }),
      visible: layerSettings.visible !== undefined ? layerSettings.visible : true
    });
  }

  getXYZLayer (layerSettings) {
    return new TileLayer({
      source: new XYZ({
        attributions: layerSettings.attributions !== undefined ? layerSettings.attributions : NO_ATTRIBUTION_MESSAGE,
        url: layerSettings.url
      })
    });
  }
}

export default new BasemapBuilder();

import urlParser from '../UrlParser';
import Parameter from '../Parameter';
import LayerTypeName from './LayerTypeName';

export class LayerSetting {
  constructor () {
    this._setting = {};
    this.registerHeatLayer();
    this.registerSimpleLayer();
    this.registerThematicLayer();
    this.registerClusterLayer();
    this.registerSLDLayer();
  }

  registerHeatLayer () {
    if (urlParser.has(Parameter.HEATMAP)) {
      this._setting[LayerTypeName.HEAT_LAYER] = {
        attribute: urlParser.get(Parameter.HEATMAP),
        isPaletteDefault: (urlParser.get(Parameter.COLOR1) === null),
        blur: urlParser.get(Parameter.HEATMAP_BLUR),
        radius: urlParser.get(Parameter.HEATMAP_RADIUS)
      };
    }
  }

  registerThematicLayer () {
    if (urlParser.has(Parameter.THEMATIC)) {
      this._setting[LayerTypeName.THEMATIC_LAYER] = {
        attribute: urlParser.get(Parameter.THEMATIC)
      };

      if (urlParser.has(Parameter.THEMATIC_LABEL)) {
        const value = urlParser.get(Parameter.THEMATIC_LABEL);
        this._setting[LayerTypeName.THEMATIC_LAYER].label = (value === '') ? urlParser.get(Parameter.THEMATIC) : value;
      }
    }
  }

  registerSimpleLayer () {
    if (urlParser.has(Parameter.GEOJSON_FILE_URL)) {
      const url = urlParser.get(Parameter.GEOJSON_FILE_URL);
      const files = (url === null) ? [] : url.split(',');

      this._setting.geojson = {
        files: files
      };

      if (urlParser.has(Parameter.THEMATIC_LABEL)) {
        this._setting.geojson.label = urlParser.get(Parameter.THEMATIC_LABEL);
      }
    }
  }

  registerClusterLayer () {
    if (urlParser.has(Parameter.CLUSTER)) {
      this._setting[LayerTypeName.CLUSTER_LAYER] = {
        distance: urlParser.get(Parameter.DISTANCE)
      };
    }
  }

  registerSLDLayer () {
    if (urlParser.has(Parameter.SLD_FILE_URL)) {
      this._setting[LayerTypeName.SLD_LAYER] = {
        sldFileUrl: urlParser.get(Parameter.SLD_FILE_URL),
        sldLayerName: urlParser.get(Parameter.SLD_LAYER_NAME)
      };
    }
  }

  getSetting () {
    return this._setting;
  }
}

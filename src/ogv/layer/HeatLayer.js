import { Heatmap as HeatmapLayer } from 'ol/layer.js';
import Point from 'ol/geom/Point';
import { BaseLayer } from './BaseLayer';
import LayerTypeName from './LayerTypeName';
import { LayerStyle } from '../style/LayerStyle';
import { HeatLayerLegend } from '../legend/HeatLayerLegend';

const DEFAULT_GRADIENT = ['#0Df', '#0Af', '#4f0', '#3f0', '#f50'];
const DEFAULT_BLUR = 15;
const DEFAULT_RADIUS = 35;
export const TOTAL_COLOR_PALETTE = 5;

export class HeatLayer extends BaseLayer {
  constructor () {
    super([], LayerTypeName.HEAT_LAYER);
    this._style = new LayerStyle();
  }

  setSetting (layerSetting) {
    this._map = layerSetting.map;
    const heatLayerSetting = layerSetting[LayerTypeName.HEAT_LAYER];
    this._attribute = heatLayerSetting.attribute;
    this._isDefaultColors = heatLayerSetting.isPaletteDefault;
    this._blur = heatLayerSetting.blur;
    this._radius = heatLayerSetting.radius;
  }

  setFeatures (features) {
    super.setFeatures(features);
    this.convertToSimpleFeatures();
    this.prepareFeatures();
    this.setLayerLegend(new HeatLayerLegend({
      legendValues: this._legendValues,
      parent: this._map.getOverlayContainerStopEvent()
    }));
  }

  prepareFeatures () {
    const values = this.getMaxMinAttributeValue();
    this._legendValues = { low: values.minValue, high: values.maxValue };

    this._features.forEach((feature) => {
      const attributeValue = feature.get(this._attribute);
      const magnitude = attributeValue / values.maxValue;
      const geom = feature.getGeometry();

      feature.set('weight', magnitude);

      if (geom.getType() === 'Polygon') {
        feature.setGeometry(geom.getInteriorPoint());
      } else if (geom.getType() === 'LineString') { feature.setGeometry(new Point(geom.getFirstCoordinate())); }
    });
  }

  /**
     * @returns {{maxValue: number, minValue: number}}
     */
  getMaxMinAttributeValue () {
    let max = 0;
    let min = this._features[0].get(this._attribute);
    if (min === undefined || min === null || min === '') { min = 0; }

    this._features.forEach((feature) => {
      var value = parseFloat(feature.get(this._attribute));

      if (value > max) { max = value; }
      if (value < min) { min = value; }
    });

    return { maxValue: max, minValue: min };
  }

  getEmptyLayer (layerName) {
    this._layer = this.createLayer([], this._isDefaultColors, this._blur, this._radius);
    this._layer.set('name', layerName);
    return this.getLayer();
  }

  getLayerFromFeatures (layerName) {
    this._layer = this.createLayer(this.getFeatures(), this._isDefaultColors, this._blur, this._radius);
    this._layer.set('name', layerName);
    return this.getLayer();
  }

  createLayer (features, isDefaultColors, blur, radius) {
    blur = (blur === undefined || blur === null) ? DEFAULT_BLUR : parseInt(blur, 10);
    radius = (radius === undefined || radius === null) ? DEFAULT_RADIUS : parseInt(radius, 10);

    let gradient = [];
    if (isDefaultColors) {
      gradient = DEFAULT_GRADIENT;
      this._style.setColorPalette(gradient);
    } else {
      this._style.setTotalColorPalette(TOTAL_COLOR_PALETTE);
      for (var i = 0; i < TOTAL_COLOR_PALETTE; i++) { gradient.push(this._style.getHexNextColor()); }
    }

    var vector = new HeatmapLayer({
      source: this.getVectorSource(features),
      gradient: gradient,
      blur: blur,
      radius: radius
    });

    return vector;
  }
}

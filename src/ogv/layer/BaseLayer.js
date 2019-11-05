import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';

/**
 * @classdesc
 *
 * @abstract
 */
export class BaseLayer {
  /**
     * @param {Array<Feature>} features
     */
  constructor (features) {
    /**
         * @type {Array<Feature>}
         */

    this._features = features;

    /**
         * @type {import("ol/layer/Layer").default}
         */
    this._layer = undefined;
  }

  /**
     * @returns {Array<Feature>}
     */
  getFeatures () {
    return this._features;
  }

  /**
     * @param {Array<Feature>} features
     */
  setFeatures (features) {
    this._features = features;
  }

  /**
     * @returns {VectorSource}
     */
  getVectorSource (features) {
    return new VectorSource({
      features: features
    });
  }

  /**
     * @returns {void}
     */
  convertToSimpleFeatures () {
    this._features = this.toSimpleFeatures(this.getFeatures(), undefined);
  }

  /**
     * @param {Feature} featureTemplate
     * @param {Array<Feature>|undefined} features
     * @returns {Array<Feature>}
     */

  toSimpleFeatures (features, featureTemplate) {
    var simpleFeatures = [];

    features.forEach((feature) => {
      var geom;
      if (!(feature instanceof Feature)) {
        geom = feature;
        feature = featureTemplate.clone();
        feature.setGeometry(geom);
      }

      geom = feature.getGeometry();

      if (geom.getType() === 'GeometryCollection') { simpleFeatures = simpleFeatures.concat(this.toSimpleFeatures(geom.getGeometries(), feature)); } else if (geom.getType() === 'MultiPolygon') { simpleFeatures = simpleFeatures.concat(this.toSimpleFeatures(geom.getPolygons(), feature)); } else if (geom.getType() === 'MultiPoint') { simpleFeatures = simpleFeatures.concat(this.toSimpleFeatures(geom.getPoints(), feature)); } else { simpleFeatures.push(feature); }
    });

    return simpleFeatures;
  }

  getEmptyLayer (layerName) {
    this.prepareLayer(layerName);
    return this.getLayer();
  }

  getLayerFromFeatures (layerName) {
    this.prepareLayer(layerName);
    this._layer.getSource().addFeatures(this.getFeatures());
    return this.getLayer();
  }

  prepareLayer (layerName) {
    this._layer = new Vector({
      source: this.getVectorSource([])
    });
    this._layer.set('name', layerName);
  }

  setLayerLegend (layerLegend) {
    this._layerLegend = layerLegend;
  }

  getLayerLegend () {
    this._layerLegend.prepareColor();
    return this._layerLegend;
  }

  prepareLegend (mapSetting) {
    if (mapSetting.legend !== undefined) {
      const layerName = this._layer.get('name').split('.')[0];
      const layerLegend = this.getLayerLegend();
      layerLegend.prepareLegendInfo(mapSetting);
      mapSetting.legend.layerTotalFeatures = this.getFeatures().length;
      mapSetting.legend.layers[layerName] = this._layer;
      layerLegend.show(mapSetting, layerName);
    }
  }

  getLayer () {
    return this._layer;
  }
}

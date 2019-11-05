import Vector from 'ol/layer/Vector';
import { Cluster } from 'ol/source.js';
import { BaseLayer } from './BaseLayer';
import { ClusterLayerStyle } from '../style/ClusterLayerStyle';
import LayerTypeName from './LayerTypeName';

const DEFAULT_DISTANCE = 20;
export class ClusterLayer extends BaseLayer {
  constructor (features) {
    super(features);
    this._style = new ClusterLayerStyle();
  }

  setSetting (layerSetting) {
    const distanceValue = layerSetting[LayerTypeName.CLUSTER_LAYER].distance;
    if (distanceValue !== undefined && distanceValue !== '') { this._distance = distanceValue; }
  }

  setFeatures (features) {
    super.setFeatures(features);
    this.convertToSimpleFeatures();
  }

  getEmptyLayer () {
    this._layer = this.createLayer([], this._distance);
    return this.getLayer();
  }

  getLayerFromFeatures () {
    this._layer = this.createLayer(this.getFeatures(), this._distance);
    return this.getLayer();
  }

  createLayer (features, distance) {
    distance = (distance === undefined) ? DEFAULT_DISTANCE : distance;

    var clusterSource = new Cluster({
      distance: distance,
      source: this.getVectorSource(features),
      geometryFunction: function (feature) {
        var geom = feature.getGeometry();
        if (geom.getType() === 'Point' || geom.getType() === 'MultiPoint') { return geom; } else { return geom.getInteriorPoint(); }
      }
    });

    this._style.nextLayerColor();

    return new Vector({
      source: clusterSource,
      style: this._style.getStyle.bind(this._style)
    });
  }
}

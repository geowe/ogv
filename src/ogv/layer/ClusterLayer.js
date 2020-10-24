import Vector from 'ol/layer/Vector';
import { Cluster } from 'ol/source.js';
import { BaseLayer } from './BaseLayer';
import { ClusterLayerStyle } from '../style/ClusterLayerStyle';
import LayerTypeName from './LayerTypeName';
import simpleLayerLegend from '../legend/SimpleLayerLegend';

const DEFAULT_DISTANCE = 20;
export class ClusterLayer extends BaseLayer {
    constructor(features) {
        super(features, LayerTypeName.CLUSTER_LAYER);
        this._style = new ClusterLayerStyle();

        this.setLayerLegend(simpleLayerLegend);
    }

    setSetting(layerSetting) {
        const distanceValue = layerSetting[LayerTypeName.CLUSTER_LAYER].distance;
        if (distanceValue !== undefined && distanceValue !== '') {
            this._distance = distanceValue;
        }
    }

    setFeatures(features) {
        super.setFeatures(features);
        this.convertToSimpleFeatures();
    }

    getEmptyLayer(layerName) {
        this._layer = this.createLayer([], this._distance, layerName);
        return this.getLayer();
    }

    getLayerFromFeatures(layerName) {
        this._layer = this.createLayer(this.getFeatures(), this._distance, layerName);
        return this.getLayer();
    }

    createLayer(features, distance, layerName) {
        distance = distance === undefined ? DEFAULT_DISTANCE : distance;

        var clusterSource = new Cluster({
            distance: distance,
            source: this.getVectorSource(features),
            geometryFunction: function(feature) {
                var geom = feature.getGeometry();
                if (geom.getType() === 'Point' || geom.getType() === 'MultiPoint') {
                    return geom;
                } else {
                    return geom.getInteriorPoint();
                }
            },
        });

        this._style.nextLayerColor();

        const vector = new Vector({
            source: clusterSource,
            style: this._style.getStyle.bind(this._style),
        });

        vector.set('name', layerName);
        return vector;
    }
}
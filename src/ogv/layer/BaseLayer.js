import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import LayerTypeName from './LayerTypeName';
import VectorImageLayer from 'ol/layer/VectorImage';

/**
 * @classdesc
 *
 * @abstract
 */
export class BaseLayer {
    /**
     * @param {Array<Feature>} features
     */
    constructor(features, layerTypeName) {
        this._layerTypeName = layerTypeName;
        /**
         * @type {Array<Feature>}
         */

        this._features = features;

        /**
         * @type {import("ol/layer/Layer").default}
         */
        this._layer = undefined;
    }

    getLayerTypeName() {
        return this._layerTypeName;
    }

    /**
     * @returns {Array<Feature>}
     */
    getFeatures() {
        return this._features;
    }

    /**
     * @param {Array<Feature>} features
     */
    setFeatures(features) {
        this._features = features;
    }

    /**
     * @returns {VectorSource}
     */
    getVectorSource(features) {
        return new VectorSource({
            features: features,
        });
    }

    /**
     * @returns {void}
     */
    convertToSimpleFeatures() {
        this._features = this.toSimpleFeatures(this.getFeatures(), undefined);
    }

    /**
     * @param {Feature} featureTemplate
     * @param {Array<Feature>|undefined} features
     * @returns {Array<Feature>}
     */

    toSimpleFeatures(features, featureTemplate) {
        var simpleFeatures = [];

        features.forEach((feature) => {
            var geom;
            if (!(feature instanceof Feature)) {
                geom = feature;
                feature = featureTemplate.clone();
                feature.setGeometry(geom);
            }

            geom = feature.getGeometry();

            if (geom.getType() === 'GeometryCollection') {
                simpleFeatures = simpleFeatures.concat(
                    this.toSimpleFeatures(geom.getGeometries(), feature)
                );
            } else if (geom.getType() === 'MultiPolygon') {
                simpleFeatures = simpleFeatures.concat(
                    this.toSimpleFeatures(geom.getPolygons(), feature)
                );
            } else if (geom.getType() === 'MultiPoint') {
                simpleFeatures = simpleFeatures.concat(
                    this.toSimpleFeatures(geom.getPoints(), feature)
                );
            } else {
                simpleFeatures.push(feature);
            }
        });

        return simpleFeatures;
    }

    getEmptyLayer(layerName) {
        this.prepareLayer(layerName);
        return this.getLayer();
    }

    getLayerFromFeatures(layerName) {
        this.prepareLayer(layerName);
        this._layer.getSource().addFeatures(this.getFeatures());
        return this.getLayer();
    }

    prepareLayer(layerName, declutter = true) {
        /* this._layer = new Vector({
                                    source: this.getVectorSource([])
                                }); */

        this._layer = new VectorImageLayer({
            imageRatio: 2,
            source: new VectorSource({}),
            declutter: declutter,
        });

        this._layer.set('name', layerName);
    }

    setLayerLegend(layerLegend) {
        this._layerLegend = layerLegend;
    }

    getLayerLegend() {
        return this._layerLegend;
    }

    prepareLegend(mapSetting) {
        if (mapSetting.legend === undefined) {
            return;
        }

        this._mapSetting = mapSetting;
        this._layerName = this._layer.get('name').split('.')[0];

        if (this.getLayerTypeName() !== LayerTypeName.SLD_LAYER) {
            this._layerLegend.prepareColor();
            this.onLayerLegend();
        }
    }

    onLayerLegend() {
        this._layerLegend.prepareLegendInfo(this._mapSetting);
        this._mapSetting.legend.layerTotalFeatures = this.getFeatures().length;
        this._mapSetting.legend.layers[this._layerName] = this._layer;
        this._layerLegend.show(this._mapSetting, this._layerName);
    }

    getLayer() {
        return this._layer;
    }

    /**
     * Divide una cadena en varias líneas
     * http://stackoverflow.com/questions/14484787/wrap-text-in-javascript
     * @param {*} str cadena a dividir
     * @param {*} width ancho de carateres
     * @param {*} spaceReplacer cadena que reemplaza
     */
    wrapText(str, width, spaceReplacer) {
        if (str.length > width) {
            var p = width;
            while (p > 0 && str[p] != ' ' && str[p] != '-') {
                p--;
            }
            if (p > 0) {
                var left;
                if (str.substring(p, p + 1) == '-') {
                    left = str.substring(0, p + 1);
                } else {
                    left = str.substring(0, p);
                }
                var right = str.substring(p + 1);
                return left + spaceReplacer + this.wrapText(right, width, spaceReplacer);
            }
        }
        return str;
    }

    getFontSize(map, resolution) {
        var zoom = map.getView().getZoom();
        var dsize = (80 / resolution) * zoom;
        var size = Math.round(dsize);
        if (size > 12) size = 12;
        return size;
    }
}
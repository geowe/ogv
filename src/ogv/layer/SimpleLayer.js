import { BaseLayer } from './BaseLayer';
import simpleLayerLegend from '../legend/SimpleLayerLegend';
import { IMAGE_FIELD_NAME, SimpleLayerStyle } from '../style/SimpleLayerStyle';
import LayerTypeName from './LayerTypeName';

export class SimpleLayer extends BaseLayer {
    constructor(features) {
        super(features, LayerTypeName.SIMPLE_LAYER);
        this._style = new SimpleLayerStyle();
        this.setLayerLegend(simpleLayerLegend);
        this._declutter = true;
    }

    setFeatures(features) {
        super.setFeatures(features);
        if (features[0].getGeometry().getType() === 'Point') {
            this._declutter = false;
        }
    }

    setSetting(layerSetting) {
        this._layerSetting = layerSetting;
        const labelValue = layerSetting.geojson.label;
        this._strokeColorValue = layerSetting.geojson.strokeColor;
        this._strokeWidthValue = layerSetting.geojson.strokeWidth;

        if (labelValue !== undefined && labelValue !== '') {
            this._label = labelValue;
        }
    }

    checkStyle() {
        var style = this._layer.getStyle();
        this._layer.setStyle((feature, resolution) => {
            if (this._label !== undefined) {
                // const size = this.getFontSize(this._layerSetting.map, resolution);
                // style.getText().setFont(size + 'px Calibri,sans-serif');
                style.getText().setText(this.wrapText('' + feature.get(this._label), 16, '\n'));
            }

            if (this._strokeColorValue !== undefined) {
                style.getStroke().setColor('#' + this._strokeColorValue);
            }
            if (this._strokeWidthValue !== undefined) {
                style.getStroke().setWidth(this._strokeWidthValue);
            }

            return [style];
        });
    }

    getLayer() {
        if (this.isImageLayer()) {
            this._style.setSelectTool(this._layerSetting.featureSelect);
            this._layer.setStyle(this._style.getFeatureStyle.bind(this._style));
        } else {
            this._layer.setStyle(this._style.getNextStyle());
            this.checkStyle();
        }
        return this._layer;
    }

    isImageLayer() {
        let enc = false;

        this._features.forEach((feature) => {
            if (feature.get(IMAGE_FIELD_NAME) !== undefined) {
                enc = true;
            }
        });

        return enc;
    }

    prepareLayer(layerName) {
        super.prepareLayer(layerName, this._declutter);
    }
}
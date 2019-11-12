import { BaseLayer } from './BaseLayer';
import LayerTypeName from './LayerTypeName';
import { SLDLayerStyle } from '../style/SLDLayerStyle';
import { SLDLayerLegend } from '../legend/SLDLayerLegend';

export class SLDLayer extends BaseLayer {
    constructor(features) {
        super(features);
    }

    setFeatures(features) {
        super.setFeatures(features);
    }

    setSetting(layerSetting) {
        this._map = layerSetting.map;
        const sldLayerSetting = layerSetting[LayerTypeName.SLD_LAYER];
        const sldFileUrlValue = sldLayerSetting.sldFileUrl;
        if (sldFileUrlValue !== undefined && sldFileUrlValue !== '') { this._sldFileUrl = sldFileUrlValue; }

        const sldLayerNameValue = sldLayerSetting.sldLayerName;
        if (sldLayerNameValue !== undefined && sldLayerNameValue !== '') { this._sldLayerName = sldLayerNameValue; }
        this._style = new SLDLayerStyle(this._sldFileUrl, this._sldLayerName, this.onLoadSLDLayer.bind(this));
    }

    onLoadSLDLayer() {
        this.setLayerLegend(new SLDLayerLegend({
            categories: this._style.getRule(),
            parent: this._map.getOverlayContainerStopEvent()
        }));
    }

    getLayer() {
        this._layer = super.getLayer();
        //this._style.setSLDFileUrl(this._sldFileUrl, this._sldLayerName, this._layer);

        return this._layer;
    }
}
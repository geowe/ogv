import { BaseLayer } from './BaseLayer';
import LayerTypeName from './LayerTypeName';
import { SLDLayerStyle } from '../style/SLDLayerStyle';

export class SLDLayer extends BaseLayer {
  constructor (features) {
    super(features);
    this._style = new SLDLayerStyle();
  }

  setSetting (layerSetting) {
    const sldLayerSetting = layerSetting[LayerTypeName.SLD_LAYER];
    const sldFileUrlValue = sldLayerSetting.sldFileUrl;
    if (sldFileUrlValue !== undefined && sldFileUrlValue !== '') { this._sldFileUrl = sldFileUrlValue; }

    const sldLayerNameValue = sldLayerSetting.sldLayerName;
    if (sldLayerNameValue !== undefined && sldLayerNameValue !== '') { this._sldLayerName = sldLayerNameValue; }
  }

  getLayer () {
    this._layer = super.getLayer();
    this._style.setSLDFileUrl(this._sldFileUrl, this._sldLayerName, this._layer);
    return this._layer;
  }
}

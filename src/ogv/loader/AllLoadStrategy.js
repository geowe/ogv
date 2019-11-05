export class AllLoadStrategy {
  constructor (args) {
    this._monitorPanel = args.monitorPanel;
    this._map = args.map;
    this._layerName = args.layerName;
    this._zIndex = args.zIndex;
    this._onFinish = args.onFinish;
  }

  load (baseLayer) {
    const vectorLayer = baseLayer.getLayerFromFeatures(this._layerName);
    vectorLayer.setZIndex(this._zIndex);
    this._map.addLayer(vectorLayer);
    this._onFinish();
  }
}

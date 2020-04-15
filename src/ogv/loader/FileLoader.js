import { extend } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import Vector from 'ol/layer/Vector';
import layerFactory from '../layer/LayerFactory';
import colorPaletteGenerator from '../style/ColorPaletteGenerator';
import { IncrementalLoadStrategy } from './IncrementalLoadStrategy';
import { AllLoadStrategy } from './AllLoadStrategy';

export class FileLoader {
  constructor (mapSetting) {
    this._geojsonFormat = new GeoJSON();
    this._totalFiles = 0;
    this._totalFileLoaded = 0;

    this._mapConfig = mapSetting;
    this._mapSetting = mapSetting.getSetting();

    this._map = this._mapSetting.map;
    this._loadMonitorPanel = this._mapSetting.monitorPanel;
  }

  getFeatureCollection (geojson) {
    var fc = this._geojsonFormat.readFeatures(geojson, { featureProjection: 'EPSG:3857' });
    return fc;
  }

  beforeLoad () {
    if (this._totalFiles > 0) {
      this._loadMonitorPanel.show('Inicializando proceso de carga...');
      this.loadProcessId = setInterval(() => {
        if (this._totalFiles === this._totalFileLoaded) { this.finishLoad(); }
      }, 1000);
    }
  }

  load () {
    this.beforeLoad();
  }

  finishLoad () {
    clearInterval(this.loadProcessId);
    this._loadMonitorPanel.hide();
    this._map.updateSize();
  }

  addToMap (fc, layerName) {
    fc = this.removeEmptyFeatures(fc);
    this.zoomToExtent(fc);
    this.setMapZoom(this._mapSetting.zoom);

    const baseLayer = layerFactory.getLayer(this._mapConfig, fc);
    let loadStrategy;
    const zIndex = this.getCountVectorLayerLoaded() + 1;

    this._loadingStrategy = this._mapSetting.loader;
    if (this._loadingStrategy.isAllTypeLoad) {
      loadStrategy = new AllLoadStrategy({
        monitorPanel: this._loadMonitorPanel,
        map: this._map,
        layerName: layerName,
        zIndex: zIndex,
        onFinish: this.endLoadingFile.bind(this)
      });
    } else {
      loadStrategy = new IncrementalLoadStrategy({
        incrementalValue: this._loadingStrategy.incrementalCount,
        monitorPanel: this._loadMonitorPanel,
        map: this._map,
        layerName: layerName,
        zIndex: zIndex,
        onFinish: this.endLoadingFile.bind(this)
      });
    }

    loadStrategy.load(baseLayer);
    baseLayer.prepareLegend(this._mapSetting);
  }

  removeEmptyFeatures (fc) {
    const elements = [];
    let removedFeatures = 0;
    fc.forEach((feature) => {
      const geom = feature.getGeometry();
      if (geom !== undefined && geom !== null && this.isEmptyGeometry(geom)) {
        elements.push(feature);
      } else { removedFeatures++; }
    });

    if (removedFeatures !== 0) { alert('Se han detectado ' + removedFeatures + ' elementos sin geometría.'); }

    return elements;
  }

  isEmptyGeometry (geometry) {
    return geometry.getCoordinates().length !== 0;
  }

  calculateExtent (fc) {
    this._extent = this._extent === undefined ? fc[0].getGeometry().getExtent() : this._extent;

    for (var i = 0; i < fc.length; i++) { extend(this._extent, fc[i].getGeometry().getExtent()); }
  }

  zoomToExtent (fc) {
    this.calculateExtent(fc);
    this._map.getView().fit(this._extent, { size: this._map.getSize() });
  }

  setMapZoom (zoomSetting) {
    if (zoomSetting.value !== null) { this._map.getView().setZoom(zoomSetting.value); }
  }

  configureColorPalette (colorPaletteSetting) {
    if (colorPaletteSetting.color1 === null) { colorPaletteGenerator.setIncFactor(10); }

    colorPaletteGenerator.setAlpha(colorPaletteSetting.alpha);
    colorPaletteGenerator.setColors(colorPaletteSetting.color1, colorPaletteSetting.color2, colorPaletteSetting.colorTotal + 1, colorPaletteSetting.keepIndex);
  }

  getCountVectorLayerLoaded () {
    let count = 0;
    this._map.getLayers().forEach((layer) => {
      if (layer instanceof Vector) { count++; }
    });

    return count;
  }

  endLoadingFile () {
    this._totalFileLoaded++;
  }

  setMapTitle(title){
    let mapTitle = this._mapSetting.title;    
    let modifiedTitle = mapTitle.value.replace("json.title", title);
    let mapTitleFromJson = document.getElementById('mapTitle');
    mapTitleFromJson.innerHTML = modifiedTitle;
  }
}

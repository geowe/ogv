import { LayerLegend, COLOR_WIDTH_DEFAULT, PIXEL_WIDTH_VALUE, HORIZONTAL_CSS_NAME, VERTICAL_CSS_NAME, LEGEND_ITEM_COUNT } from './LayerLegend';
import MapInitializer from '../map/MapInitializer';
import zoomToLayerButton from '../../ui/html/legendZoomToLayerButton.html';
import layerVisibilitySlider from '../../ui/html/legendLayerVisibilitySlider.html';
import '../../ui/html/legendLayerVisibilitySlider.css';

class SimpleLayerLegend extends LayerLegend {
  constructor () {
    super({ id: 'simpleLayerLegend', parent: MapInitializer.getMap().getOverlayContainerStopEvent() });
    this._showed = false;
    this._maxWidth = 0;
  }

  show (mapSetting, layerName) {
    if (!this._showed) {
      this._showed = true;
      this._itemCount = mapSetting.legend.itemCount;
      this._layerZoom = mapSetting.legend.layerZoom;
      this._layerVisibility = mapSetting.legend.layerVisibility;
      this._layers = mapSetting.legend.layers;
      this._map = mapSetting.map;
      super.show(mapSetting, layerName);
    } else {
      this.calculateLayerInfo(mapSetting.legend);
      this.addLegendContent(mapSetting.legend, layerName);
    }
  }

  prepareLegendInfo (mapSetting) {}

  addHorizontalLegend (colorWidth, layerName) {
    const item = this.getItemLegend(layerName, this._totalLayer, HORIZONTAL_CSS_NAME, colorWidth);
    this.addItem(item, layerName);
    this._legendContent.appendChild(document.createTextNode('\u00A0'));
    this._legendContent.appendChild(document.createTextNode('\u00A0'));
    this._totalLayer++;
  }

  getLayerTotalFeaturesLabel () {
    const layerTotalFeatureslabel = document.createElement('span');
    layerTotalFeatureslabel.innerHTML = ` <b style='font-size: .6rem;'>[${this._layerTotalFeatures}]</b>`; // ` <b>[${this._layerTotalFeatures}]</b>`;
    layerTotalFeatureslabel.title = 'Total de features de capa';
    return layerTotalFeatureslabel;
  }

  addVerticalLegend (colorWidth, layerName) {
    const item = this.getItemLegend(layerName, this._totalLayer, VERTICAL_CSS_NAME, colorWidth);
    this.addItem(item, layerName);
    this._legendContent.appendChild(item.boxContainer);
    this._totalLayer++;

    this.updateLegendWidth(colorWidth, layerName);
  }

  updateLegendWidth (colorWidth, layerName) {
    if (layerName.length > this._maxWidth) {
      this._maxWidth = layerName.length + LEGEND_ITEM_COUNT;

      colorWidth = colorWidth === null ? COLOR_WIDTH_DEFAULT : parseInt(colorWidth);
      var width = colorWidth + (this._maxWidth * PIXEL_WIDTH_VALUE);
      this.setLegendContentWidth(width);
    }
  }

  addItem (item, layerName) {
    if (this._layerZoom !== null) {
      this._legendContent.appendChild(this.getLayerZoomTool(layerName));
      this._legendContent.appendChild(document.createTextNode('\u00A0'));
    }
    if (this._layerVisibility !== null) {
      this._legendContent.appendChild(this.getLayerCheckVisibilityTool(layerName));
      this._legendContent.appendChild(document.createTextNode('\u00A0'));
    }
    this._legendContent.appendChild(item.box);
    this._legendContent.appendChild(item.label);
    if (this._itemCount !== null) { this._legendContent.appendChild(this.getLayerTotalFeaturesLabel()); }

    this._legendContent.appendChild(document.createTextNode('\u00A0'));
  }

  getLayerCheckVisibilityTool (layerName) {
    const container = document.createElement('div');
    container.innerHTML = layerVisibilitySlider.trim();

    const layerVisibilitySliderElement = container.firstChild;
    layerVisibilitySliderElement.setAttribute('id', layerName + 'Slider');
    layerVisibilitySliderElement.title = 'Visibilidad de la capa ' + layerName;

    layerVisibilitySliderElement.onchange = () => {
      const layer = this._layers[layerName];
      layer.setVisible(!layer.getVisible());
    };
    return layerVisibilitySliderElement;
  }

  getLayerZoomTool (layerName) {
    const container = document.createElement('div');
    container.innerHTML = zoomToLayerButton.trim();
    const zoomToLayerElement = container.firstChild;
    zoomToLayerElement.setAttribute('id', layerName + 'ZoomTool');
    zoomToLayerElement.title = 'Zoom a la capa ' + layerName;
    zoomToLayerElement.onclick = () => {
      this._map.getView().fit(this._layers[layerName].getSource().getExtent(), { size: this._map.getSize() });
    };
    return zoomToLayerElement;
  }
}

export default new SimpleLayerLegend();

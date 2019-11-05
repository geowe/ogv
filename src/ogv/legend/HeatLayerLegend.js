import { COLOR_WIDTH_DEFAULT, PIXEL_WIDTH_VALUE, LEGEND_HEIGHT, LEGEND_INFO_ATTRIBUTE_NAME, LEGEND_INFO_MIN_VALUE, LEGEND_INFO_MAX_VALUE, HORIZONTAL_CSS_NAME, VERTICAL_CSS_NAME, LayerLegend } from './LayerLegend';
import LayerTypeName from '../layer/LayerTypeName';
import { TOTAL_COLOR_PALETTE } from '../layer/HeatLayer';

export class HeatLayerLegend extends LayerLegend {
  constructor (arg) {
    super({ id: 'heatLayerLegend', parent: arg.parent });
    this._lowValueLabel = arg.legendValues.low;
    this._highValueLabel = arg.legendValues.high;
  }

  prepareLegendInfo (mapSetting) {
    if (mapSetting.legend !== undefined) {
      mapSetting.legend.legendInfo[LEGEND_INFO_ATTRIBUTE_NAME] = mapSetting.layerSetting[LayerTypeName.HEAT_LAYER].attribute;
      mapSetting.legend.legendInfo[LEGEND_INFO_MIN_VALUE] = this._lowValueLabel;
      mapSetting.legend.legendInfo[LEGEND_INFO_MAX_VALUE] = this._highValueLabel;
    }
  }

  addHorizontalLegend (colorWidth) {
    this.addValue(this._lowValueLabel);

    for (let index = 0; index < TOTAL_COLOR_PALETTE; index++) {
      var item = this.getItemLegend('', index, HORIZONTAL_CSS_NAME, colorWidth);
      this._legendContent.appendChild(item.box);
    }

    this.addValue(this._highValueLabel);
  }

  addVerticalLegend (colorWidth) {
    this._legendContent.style.height = LEGEND_HEIGHT;
    this.addValue(this._lowValueLabel);

    for (let index = 0; index < TOTAL_COLOR_PALETTE; index++) {
      var item = this.getItemLegend('', index, VERTICAL_CSS_NAME, colorWidth);
      item.boxContainer.appendChild(item.box);
      this._legendContent.appendChild(item.boxContainer);
    }

    this.addValue(this._highValueLabel);
    let maxWidth = this._highValueLabel.length;
    colorWidth = colorWidth === null ? COLOR_WIDTH_DEFAULT : parseInt(colorWidth);

    maxWidth = (maxWidth * PIXEL_WIDTH_VALUE);
    if (colorWidth > maxWidth) { maxWidth = colorWidth; }

    this._legendContent.style.width = maxWidth + 'px';
  }
}

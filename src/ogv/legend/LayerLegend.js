import colorPaletteGenerator from '../style/ColorPaletteGenerator';
import { LegendPanel } from '../../ui/LegendPanel';
import { LegendInfoPanel } from '../../ui/legendInfoPanel';
import legendInfoButton from '../../ui/html/legendInfoButton.html';
import urlParser from '../UrlParser';
import Parameter from '../Parameter';

export const LEGEND_INFO_ATTRIBUTE_NAME = 'Nombre de atributo';
export const LEGEND_INFO_MAX_VALUE = 'Valor máximo';
export const LEGEND_INFO_MIN_VALUE = 'Valor mínimo';
export const COLOR_WIDTH_DEFAULT = 10; // px unit
export const PIXEL_WIDTH_VALUE = 11; // px unit
export const LEGEND_ITEM_COUNT = 5;
export const VERTICAL_LEGEND_MAX_HEIGHT = 20; // vh unit
export const LEGEND_HEIGHT = '129px';
export const HORIZONTAL_CSS_NAME = 'horizontalBox';
export const VERTICAL_CSS_NAME = 'verticalBox';

const LEGEND_INFO_BUTTON_ID = 'legendInfoButton';
export class LayerLegend {
  constructor (arg) {
    this._legendPanel = new LegendPanel({
      id: arg.id,
      parent: arg.parent
    });

    this._infoButton = legendInfoButton;

    this._legendInfoPanel = new LegendInfoPanel({
      id: arg.id,
      parent: this._legendPanel._element
    });

    this._legendContent = this._legendPanel._legendContent;
    this._legendHeader = this._legendPanel._legendHeader;
    this._legendFooter = this._legendPanel._legendFooter;
    this._totalLayer = 0;
    this._totalFeatures = 0;
    this._id = arg.id;
  }

  show (mapSetting, layerName) {
    const legendSetting = mapSetting.legend;

    this.calculateLayerInfo(legendSetting);
    this.addLegendContent(legendSetting, layerName);
    this.calculateLegendMaxWidth(legendSetting);
    this.setInfoLayer(legendSetting);
    this.registerInfoButtonEventClick(legendSetting);
    this._legendPanel.show();
  }

  addLegendContent (legendSetting, layerName) {
    if (legendSetting.isVertical) {
      this.addVerticalLegend(legendSetting.colorWidth, layerName);
    } else {
      this.addHorizontalLegend(legendSetting.colorWidth, layerName);
    }
  }

  setLegendContentWidth (width) {
    this._contentWidth = parseInt(width);
  }

  calculateLayerInfo (legendSetting) {
    this._layerTotalFeatures = parseInt(legendSetting.layerTotalFeatures);
    this._totalFeatures = this._totalFeatures + this._layerTotalFeatures;
    legendSetting.totalFeatures = this._totalFeatures;
    legendSetting.totalLayer = this._totalLayer + 1;
  }

  setInfoLayer (legendSetting) {
    this._legendPanel.showSection(legendSetting.header, this._legendHeader, (legendSetting.header !== null) && (legendSetting.header !== ''));

    const footerInfo = (legendSetting.footer === null || legendSetting.footer === '' || legendSetting.footer === null) ? '&nbsp;' : legendSetting.footer;
    legendSetting.footer = `<span class="w3-margin-left">${footerInfo}</span>  ${this._infoButton}`;
    this._legendPanel.showSection(legendSetting.footer, this._legendFooter, (legendSetting.footer !== null));
  }

  registerInfoButtonEventClick (legendSetting) {
    const legendInfoButton = document.getElementById(LEGEND_INFO_BUTTON_ID);
    legendInfoButton.onclick = () => {
      this._legendInfoPanel.show(legendSetting);
    };
  }

  prepareColor () {
    this._colors = colorPaletteGenerator.getColorPalette();
  }

  addValue (value) {
    var valueLabel = document.createElement('SPAN');
    valueLabel.innerHTML = value + ' ';
    this._legendContent.appendChild(valueLabel);
  }

  getItemLegend (itemName, colorIndex, className, colorWidth) {
    colorWidth = this.getCalculatedColorWidth(colorWidth, itemName);

    var label = document.createElement('span');
    label.innerHTML = ' ' + itemName;

    var box = document.createElement('div');
    box.className = className;
    box.style.backgroundColor = this._colors[colorIndex];
    box.title = itemName;

    if (colorWidth !== undefined) { box.style.width = colorWidth + 'px'; }

    return {
      boxContainer: document.createElement('div'),
      label: label,
      box: box
    };
  }

  getCalculatedColorWidth (colorWidth, itemName) {
    if (urlParser.has(Parameter.LEGEND_COLORWIDTH_RATE) &&
      !isNaN(itemName)) {
      const rateValue = urlParser.get(Parameter.LEGEND_COLORWIDTH_RATE);
      colorWidth = parseInt(itemName) / rateValue;
    } else {
      colorWidth = colorWidth === null ? COLOR_WIDTH_DEFAULT : parseInt(colorWidth);
    }
    return colorWidth;
  }

  calculateLegendMaxWidth (legendSetting) {
    const headerWidth = this.getSectionWidth(legendSetting.header);
    const footerWidth = this.getSectionWidth(legendSetting.footer);
    let width = this._contentWidth;

    if (headerWidth > width) { width = headerWidth; }
    if (footerWidth > width) { width = footerWidth; }

    this._legendContent.style.width = width + 'px';
  }

  getSectionWidth (section) {
    let width = 0;
    if (section !== null && section !== undefined) {
      width = parseInt(section.length) * PIXEL_WIDTH_VALUE;
    }

    return width;
  }

  addVerticalLegend (colorWidth, layerName) {}
  addHorizontalLegend (colorWidth, layerName) {}
}

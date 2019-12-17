import { BaseLayer } from './BaseLayer';
import LayerTypeName from './LayerTypeName';
import { LayerStyle } from '../style/LayerStyle';
import { ThematicLayerLegend } from '../legend/ThematicLayerLegend';

export class ThematicLayer extends BaseLayer {
  constructor () {
    super([], LayerTypeName.THEMATIC_LAYER);
    this._style = new LayerStyle();
  }

  setSetting (layerSetting) {
    this._map = layerSetting.map;
    this._attribute = layerSetting[LayerTypeName.THEMATIC_LAYER].attribute;
    this._label = layerSetting[LayerTypeName.THEMATIC_LAYER].label;
    this._rate = layerSetting[LayerTypeName.THEMATIC_LAYER].rate;
  }

  setFeatures (features) {
    super.setFeatures(features);
    this.createCategories();
    this.setLayerLegend(new ThematicLayerLegend({
      categories: this._rule,
      parent: this._map.getOverlayContainerStopEvent()
    }));
  }

  createCategories () {
    this._rule = this.createThematicRule();
    const keys = Object.keys(this._rule);
    this._style.setTotalColorPalette(keys.length);
    const numberKeys = this.convertToNumber(keys);
    this._rule = this.getOrderlyRule(numberKeys);
  }

  getLayer () {
    super.getLayer();
    this._layer.setStyle((feature) => {
      const category = this._rule[feature.get(this._attribute)];

      if (category === undefined) {
        return null;
      }

      const style = category.style;
      if (style !== undefined) {
        if (this._label !== undefined) {
          style.getText().setText(this.wrapText('' + feature.get(this._label), 16, '\n'));
        }

        if (this._rate !== undefined && this._rate !== '') { style.getImage().setRadius(7 + parseInt(feature.get(this._attribute)) / this._rate); }
      }

      return style;
    });

    return this._layer;
  }

  createThematicRule () {
    const rule = {};

    this._features.forEach((feature) => {
      const value = feature.get(this._attribute);

      if (value !== null && !(value in rule)) {
        rule[value] = {
          count: 1
        };
      } else if (value !== null && (value in rule)) {
        let count = parseInt(rule[value].count);
        count = count + 1;
        rule[value].count = count;
      }
    });

    return rule;
  }

  convertToNumber (keys) {
    var isNumeric = keys.every(function (e) {
      return !isNaN(e);
    });

    if (isNumeric) {
      return keys.map(Number);
    } else {
      return keys;
    }
  }

  getOrderlyRule (keys) {
    const orderlyRule = {};
    const orderedKeys = keys.sort(function (a, b) {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }

      return 0;
    });

    orderedKeys.forEach((key) => {
      const ruleValue = this._rule[key];
      if (ruleValue !== undefined) {
        orderlyRule['' + key] = {
          count: ruleValue.count,
          style: this._style.getNextStyle()
        };
      }
    });

    orderlyRule.orderedKeys = orderedKeys;
    return orderlyRule;
  }
}

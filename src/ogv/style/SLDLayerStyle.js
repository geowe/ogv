import { Reader, createOlStyleFunction } from '@nieuwlandgeo/sldreader/src/index';
import { getLayer as getSLDLayer, getStyle as getSLDStyle } from '@nieuwlandgeo/sldreader/src/Utils';

export class SLDLayerStyle {
  constructor (sldFileUrl, sldLayerName, onFinishRule) {
    this._sldFileUrl = sldFileUrl;
    this._sldLayerName = sldLayerName;
    this._featureTypeStyle = undefined;

    fetch(sldFileUrl).then((response) => {
      return response.text();
    })
      .then((text) => {
        const sldObject = new Reader(text);
        const sldLayer = getSLDLayer(sldObject, sldLayerName);
        const style = getSLDStyle(sldLayer, sldLayerName);
        this._featureTypeStyle = style.featuretypestyles[0];

        this._rule = {};
        this._featureTypeStyle.rules.forEach((rule) => {
          this.setPolygonSimbolizerFillRule(rule);
          if (rule.pointsymbolizer !== undefined) { this._rule[rule.name] = rule.pointsymbolizer.graphic.mark.fill.styling.fill; }
        });

        onFinishRule();
      });
  }

  setPolygonSimbolizerFillRule (rule) {
    if (rule.polygonsymbolizer !== undefined && rule.polygonsymbolizer.fill !== undefined) {
      this._rule[rule.name] = rule.polygonsymbolizer.fill.styling.fill;
    }
  }

  getRule () {
    return this._rule;
  }

  apply (layer) {
    layer.setStyle(createOlStyleFunction(this._featureTypeStyle));
  }
}

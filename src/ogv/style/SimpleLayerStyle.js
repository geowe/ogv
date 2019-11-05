import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { LayerStyle } from './LayerStyle';
import { SelectToolStyle } from './SelectToolStyle';

export const IMAGE_VIEWER_FIELD = 'img:';
export const IMAGE_FIELD_NAME = 'url-img';
export class SimpleLayerStyle extends LayerStyle {
  constructor () {
    super();
    this._cache = {};
    this._selectStyle = new SelectToolStyle();
  }

  scaleImageStyle (feature, scale) {
    var url = feature.get(IMAGE_FIELD_NAME);

    if (url === undefined || url === null || url.substring(0, 4) === IMAGE_VIEWER_FIELD) {
      return this._appliedStyle;
    }

    var key = scale + url;
    if (!this._cache[key]) {
      this._cache[key] = new Style({
        image: new Icon({
          scale: scale,
          src: url
        })
      });
    }

    return this._cache[key];
  }

  getFeatureStyle (feature) {
    return [this.scaleImageStyle(feature, 0.10)];
  }

  setSelectTool (featureSelect) {
    this.featureSelect = featureSelect;
    this.featureSelect.style_ = this.imageSelectedStyle.bind(this);
    this._appliedStyle = this.getNextStyle();
  }

  imageSelectedStyle (feature) {
    const url = feature.get(IMAGE_FIELD_NAME);

    if (url === undefined || url === null || url.substring(0, 4) === IMAGE_VIEWER_FIELD) {
      return [this._selectStyle.getStyle(), this._selectStyle.getShadowStyle(), this._selectStyle.getShadowStyle()];
    }

    return [this.scaleImageStyle(feature, 0.50)];
  }
}

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Circle from 'ol/style/Circle';
import { LayerStyle } from './LayerStyle';

export class ClusterLayerStyle extends LayerStyle {
  constructor () {
    super();
    this._styleCache = {};
  }

  nextLayerColor () {
    this._color = this.getNextColor();
  }

  getStyle (feature) {
    const pointSizeLabel = feature.get('features').length;
    let style = this._styleCache[pointSizeLabel];
    if (!style) {
      var distance = (((pointSizeLabel * 50) / 1000) + 10) + (0.1 * pointSizeLabel);
      if (distance > 60) { distance = 60; }

      style = new Style({

        image: new Circle({
          radius: distance,
          stroke: new Stroke({
            color: '#fff'
          }),
          fill: new Fill({
            color: this._color
          })
        }),
        text: new Text({
          text: pointSizeLabel.toString(),
          fill: new Fill({
            color: '#fff'
          })
        })
      });
      this._styleCache[pointSizeLabel] = style;
    }
    return style;
  }
}

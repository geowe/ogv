import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Circle from 'ol/style/Circle';

import colorPaletteGenerator from './ColorPaletteGenerator';

const DEFAULT_RADIUS = 7;

export class LayerStyle {
  getNextStyle () {
    const color = colorPaletteGenerator.getNextColor();
    return this.getStyle(color, color, color);
  }

  getStyle (fillColor, strokeColor, pointFillColor) {
    const style = new Style({
      fill: new Fill({
        color: fillColor
      }),
      stroke: new Stroke({
        color: strokeColor,
        width: 3
      }),
      text: this.createTextStyle(),
      image: new Circle({
        radius: (this._radius === undefined || this._radius === '') ? DEFAULT_RADIUS : this._radius,
        fill: new Fill({
          color: pointFillColor
        }),
        stroke: new Stroke({
          color: strokeColor,
          width: 3
        })
      })
    });
    return style;
  }

  getHexNextColor () {
    var rgb = colorPaletteGenerator.getNextColor();
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? '#' +
            ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
  }

  getNextColor () {
    return colorPaletteGenerator.getNextColor();
  }

  setColorPalette (colors) {
    colorPaletteGenerator.setColorPalette(colors);
  }

  setTotalColorPalette (total) {
    colorPaletteGenerator.setColors(undefined, undefined, total);
  }

  setRadius (radius) {
    this._radius = radius;
  }

  createTextStyle () {
    return new Text({
      font: '12px Arial',
      overflow: true,
      scale: 1.5,
      fill: new Fill({
        color: '#000'
      }),
      stroke: new Stroke({
        color: '#fff',
        width: 3
      })
    });
  }
}

import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Text from 'ol/style/Text';
import Circle from 'ol/style/Circle';

import colorPaletteGenerator from './ColorPaletteGenerator';

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
      text: new Text({
        // font: font,
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3
        })
      }),
      image: new Circle({
        radius: 7,
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
}

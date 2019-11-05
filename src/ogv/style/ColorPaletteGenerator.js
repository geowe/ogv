class ColorPaletteGenerator {
  constructor () {
    this.col1 = '00ff11';
    this.col2 = '000000';
    this.total = 5;
    this.incFactor = 0;
    this.alpha = 0.5;
    this.colorPaletteIndex = -1;
  }

  setIncFactor (inc) {
    this.incFactor = inc;
  }

  setAlpha (alpha) {
    this.alpha = (alpha === undefined || alpha === null) ? 0.5 : alpha;
  }

  setColors (col1, col2, totalPalette, keepIndex) {
    this.col1 = (col1 === undefined || col1 === null) ? this.col1 : '#' + col1;
    this.col2 = (col2 === undefined || col2 === null) ? this.col2 : '#' + col2;
    this.total = (totalPalette === undefined || totalPalette === null) ? this.total : totalPalette;

    this.colors = this.lerpColors(this.col1, this.col2, this.total);
    if (keepIndex === undefined) { this.colorPaletteIndex = -1; }
  }

  getNextColor () {
    this.colorPaletteIndex = this.colorPaletteIndex + 1;
    return this.colors[this.colorPaletteIndex];
  }

  getColorPalette () {
    return this.colors;
  }

  setColorPalette (colors) {
    this.colors = colors;
  }

  lerpColor (color1, color2, factor) {
    var result = color1.slice();
    for (var i = 0; i < 3; i++) {
      result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }

    result = this.rgbToHex(result[0], result[1], result[2]);
    result = this.hexToRGB(result, this.alpha);
    return result;
  }

  lerpColors (color1, color2, steps) {
    color1 = this.hexToRGB(color1);
    color2 = this.hexToRGB(color2);

    var stepFactor = 1 / (steps - 1) + this.incFactor;
    var interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (var i = 0; i < steps; i++) {
      interpolatedColorArray.push(this.lerpColor(color1, color2, stepFactor * i));
    }

    return interpolatedColorArray;
  }

  hexToRGB (hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

  rgbToHex (r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

export default new ColorPaletteGenerator();

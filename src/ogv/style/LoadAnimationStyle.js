import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';

export class LoadAnimationStyle {
  static getStyle (opacity, radius) {
    return new Style({
      fill: new Fill({
        color: 'rgba(226, 233, 135, ' + opacity + ')'
      }),
      stroke: new Stroke({
        // color: 'rgba(255, 0, 0, ' + opacity + ')',
        color: 'rgba( 231, 130, 10)',
        width: 0.25 + opacity
      }),
      image: new Circle({
        radius: radius,
        stroke: new Stroke({
          color: 'rgba(255, 0, 0, ' + opacity + ')',
          width: 0.25 + opacity
        })
      })
    });
  }
}

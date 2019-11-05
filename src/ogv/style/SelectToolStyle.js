import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Circle from 'ol/style/Circle';

export class SelectToolStyle {
  getStyle () {
    return new Style({
      fill: new Fill({
        color: [249, 231, 159, 0.7]
      }),
      stroke: new Stroke({
        width: 6,
        color: [237, 212, 0, 0.8]
      }),
      image: new Circle({
        radius: 7,
        fill: new Fill({
          color: [237, 212, 0, 0.8]
          // color: [249, 231, 159, 0.7]
        }),
        stroke: new Stroke({
          width: 6,
          color: [237, 212, 0, 0.8]
        })
      })
    });
  }

  getShadowStyle () {
    return new Style({
      stroke: new Stroke({
        color: [0, 0, 127, 0.15], // 0.15
        width: 12
      }),
      image: new Circle({
        radius: 10,
        fill: new Fill({
          color: [0, 0, 127, 0.15]
        })
      })

    });
  }
}

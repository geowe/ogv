import { Reader, createOlStyleFunction } from '@nieuwlandgeo/sldreader/src/index';
import { getLayer as getSLDLayer, getStyle as getSLDStyle } from '@nieuwlandgeo/sldreader/src/Utils';

export class SLDLayerStyle {
  setSLDFileUrl (url, sldLayerName, vectorLayer) {
    fetch(url).then((response) => {
      return response.text();
    })
      .then((text) => {
        const sldObject = new Reader(text);
        const sldLayer = getSLDLayer(sldObject, sldLayerName);
        const style = getSLDStyle(sldLayer, sldLayerName);
        const featureTypeStyle = style.featuretypestyles[0];
        vectorLayer.setStyle(createOlStyleFunction(featureTypeStyle));
      });
  }
}

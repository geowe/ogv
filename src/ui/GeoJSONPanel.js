import GeoJSON from 'ol/format/GeoJSON';
import html from './html/geojsonPanel.html';
import { VisualElement } from './VisualElement';

export class GeoJSONPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    document.getElementById('featureGeojsonCloseButton').onclick = this.hide.bind(this);
    document.getElementById('featureGeojsonDownloadButton').onclick = this.geojsonDownload.bind(this);
    this._geojsonFormat = new GeoJSON();
  }

  show (feature) {
    super.show();
    this._geojson = this._geojsonFormat.writeFeature(feature, { featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326' });
    document.getElementById('geojsonText').innerHTML = this._geojson;
  }

  geojsonDownload () {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this._geojson));
    element.setAttribute('download', 'geojson-element.geojson');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
}

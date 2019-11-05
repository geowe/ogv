import WKT from 'ol/format/WKT';
import html from './html/wktPanel.html';
import { VisualElement } from './VisualElement';

export class WKTPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    document.getElementById('wktCloseButton').onclick = this.hide.bind(this);
    document.getElementById('wktDownloadButton').onclick = this.wktDownload.bind(this);
    this._wktFormat = new WKT();
  }

  show (feature) {
    super.show();
    this._wkt = this._wktFormat.writeGeometry(feature.getGeometry(), { featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326' });
    document.getElementById('wktText').innerHTML = this._wkt;
  }

  wktDownload () {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this._wkt));
    element.setAttribute('download', 'wkt-element.wkt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }
}

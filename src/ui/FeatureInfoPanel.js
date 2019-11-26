import Feature from 'ol/Feature';
import { getArea, getLength } from 'ol/sphere.js';
import { toStringHDMS } from 'ol/coordinate';
import { IMAGE_FIELD_NAME, IMAGE_VIEWER_FIELD } from '../ogv/style/SimpleLayerStyle';
import html from './html/featureInfoPanel.html';
import { WKTPanel } from './WKTPanel';
import { GeoJSONPanel } from './GeoJSONPanel';
import { VisualElement } from './VisualElement';

export class FeatureInfoPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);

    this._content = document.getElementById('content');
    this._spatialContent = document.getElementById('spatialContent');
    this._wktButton = document.getElementById('wktButton');
    this._featureButton = document.getElementById('featureButton');
    const closeButton = document.getElementById('closeContentButton');

    closeButton.onclick = () => {
      this.hide();
    };

    this.wktPanel = new WKTPanel({
      parent: this._element
    });

    this.geojsonPanel = new GeoJSONPanel({
      parent: this._element
    });
  }

  show (feature) {
    this._content.innerHTML = '';
    this.setAlphanumericInfo(feature);
    this.spatialInfo(feature);
    super.show();
  }

  hide () {
    super.hide();
    if (this.wktPanel !== undefined && this.geojsonPanel !== undefined) { this.wktPanel.hide(); }
  }

  setAlphanumericInfo (feature) {
    var originalFeature = feature.get('features');

    if (originalFeature !== undefined) {
      if (originalFeature.length > 1) {
        var featureGroup = new Feature({
          ELEMENTO: 'Grupo',
          'Nº ELEMENTOS': originalFeature.length
        });

        feature = featureGroup;
      } else {
        feature = originalFeature[0];
      }
    }

    const objeto = feature.getProperties();

    let imageUrl = feature.get(IMAGE_FIELD_NAME);
    if (imageUrl !== undefined && imageUrl !== null) {
      if (imageUrl.substring(0, 4) === IMAGE_VIEWER_FIELD) {
        imageUrl = imageUrl.substring(4);
      }

      this._content.innerHTML = `<a target="_blank" href="${imageUrl}"><img class="w3-card-4" src="${imageUrl}" width="100%" height="100%" > </a><br /><br/>`;
    }

    for (const propiedades in objeto) {
      if (propiedades !== 'geometry' && propiedades !== IMAGE_FIELD_NAME) {
        this._content.innerHTML += `<label><b>${propiedades}</b></label> <br/>${objeto[propiedades]}<br><div style="width: 100%;                
                display: block;margin-top: 0.1em;margin-bottom: 0.1em;margin-left: auto;margin-right: auto;border-style: solid;border-width: 1px;border-color:#e8ebe9;">`;
      }
    }
  }

  spatialInfo (feature) {
    this._wktButton.onclick = () => {
      this.geojsonPanel.hide();
      this.wktPanel.show(feature);
    };

    this._featureButton.onclick = () => {
      this.wktPanel.hide();
      this.geojsonPanel.show(feature);
    };

    const geometry = feature.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
    this._spatialContent.innerHTML = '<b>Tipo</b> <br/>' + geometry.getType() + '<br />';
    const coordinates = geometry.getCoordinates();

    if (geometry.getType() === 'Point') {
      this._spatialContent.innerHTML += `<b>X</b> <br/>${coordinates[0]}<br />`;
      this._spatialContent.innerHTML += `<b>Y</b> <br/>${coordinates[1]}<br />`;
      this._spatialContent.innerHTML += `<b>HDMS</b> <br/>${toStringHDMS(coordinates, 1)}<br />`;
    } else if (geometry.getType() === 'Polygon' || geometry.getType() === 'MultiPolygon') {
      this._spatialContent.innerHTML += `<b>Área(m<sup>2</sup>)</b> <br/>${getArea(geometry, { projection: 'EPSG:4326' }).toFixed(2)}<br />`;
      this._spatialContent.innerHTML += `<b>Vértices</b> <br/>${coordinates[0].length}<br />`;
    } else if (geometry.getType() === 'LineString') {
      this._spatialContent.innerHTML += `<b>Longitud(m<sup>2</sup>)</b> <br/>${getLength(geometry, { projection: 'EPSG:4326' }).toFixed(2)}<br />`;
      this._spatialContent.innerHTML += `<b>Vértices</b> <br/>${coordinates[0].length}<br />`;
    }

    this._spatialContent.innerHTML += '<br />';
  }
}

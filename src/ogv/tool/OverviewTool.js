import { OverviewMap } from 'ol/control';
import basemapCatalog from '../catalog/BasemapCatalog';
import Parameter from '../Parameter';
import { AddBasemapTool } from './AddBasemapTool';

export class OverviewTool {
  constructor (setting) {
    if (setting.overview !== undefined) { this.configure(setting); }
  }

  configure (setting) {
    const overviewBasemap = setting.overview.id;
    let rasters;

    if (overviewBasemap === undefined) { rasters = [AddBasemapTool.getRaster(setting)]; } else if (overviewBasemap !== Parameter.NONE_BASEMAP) { rasters = [basemapCatalog.getRasterLayer(overviewBasemap)]; }

    if (rasters === undefined) { rasters = []; }
    const overview = this.getOverviewControl(rasters, setting.overview.height, setting.overview.width);
    setting.map.getControls().push(overview);
  }

  getOverviewControl (raster, height, width) {
    const overview = new OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: raster,
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: false
    });

    const button = overview.element.getElementsByTagName('button')[0];
    button.className = 'w3-btn w3-ripple ogv-tool w3-circle w3-xlarge';
    button.innerHTML = '\u00BB';
    button.title = 'Cerrar vista general del mapa';

    button.addEventListener('click', () => {
      if (overview.collapsed_) {
        button.innerHTML = "<span class='w3-display-middle'><i class='ms ms-map-o'></i></span>";
        button.title = 'Abrir vista general del mapa';
      } else {
        button.innerHTML = '\u00BB';
        button.title = 'Cerrar vista general del mapa';
      }
    });

    if (height !== undefined) { overview.ovmapDiv_.style.height = height + 'vh'; }
    if (width !== undefined) { overview.ovmapDiv_.style.width = width + 'vh'; }

    return overview;
  }
}

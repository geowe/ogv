import basemapCatalog from '../catalog/BasemapCatalog';
import Parameter from '../Parameter';

export class AddBasemapTool {
  constructor (setting) {
    const raster = AddBasemapTool.getRaster(setting);
    if (raster !== undefined) { setting.map.addLayer(raster); }
  }

  static getRaster (setting) {
    let raster;
    if (setting.basemap !== undefined) {
      const basemap = setting.basemap.id;
      if (basemap !== Parameter.NONE_BASEMAP) { raster = basemapCatalog.getRasterLayer(basemap); }
    } else { raster = basemapCatalog.getDefaultRasterLayer(); }
    return raster;
  }
}

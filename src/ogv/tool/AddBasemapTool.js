import basemapCatalog from '../catalog/BasemapCatalog';
import Parameter from '../Parameter';

export class AddBasemapTool {
    constructor(setting) {
        const raster = AddBasemapTool.getRaster(setting);
        const rasterProxy = AddBasemapTool.getRaster(setting, true);
        if (raster !== undefined) {
            setting.map.addLayer(raster);
            setting.raster = raster;
            setting.rasterProxy = rasterProxy;
        }
    }

    static getRaster(setting, proxy = false) {
        let raster;
        if (setting.basemap !== undefined) {
            const basemap = setting.basemap.id;
            if (basemap !== Parameter.NONE_BASEMAP) {
                raster = basemapCatalog.getRasterLayer(basemap, proxy);
            }
        } else {
            raster = basemapCatalog.getDefaultRasterLayer();
        }

        raster.setOpacity(parseFloat(setting.basemapOpacity));
        return raster;
    }
}
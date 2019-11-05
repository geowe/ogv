import basemapBuilder from './BasemapBuilder';
import CatalogLayerName from './CatalogLayerName';

// const BINGMAP_KEY = '';
const BASEMAP_DEFAULT = CatalogLayerName.CARTO_LIGHT;

class BasemapCatalog {
  constructor () {
    this.catalog = {};
    this.catalog[CatalogLayerName.CARTO_LIGHT] = () => { return basemapBuilder.getOSMTiles('https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'); };
    this.catalog[CatalogLayerName.CARTO_DARK] = () => { return basemapBuilder.getOSMTiles('https://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'); };
    this.catalog[CatalogLayerName.CARTO_VOYAGER] = () => { return basemapBuilder.getOSMTiles('https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'); };
    this.catalog[CatalogLayerName.CATASTRO] = () => { return this.getCatastro(); };
    this.catalog[CatalogLayerName.IGN_FONDO] = () => { return this.getIGN('fondo'); };
    this.catalog[CatalogLayerName.IGN_RASTER] = () => { return this.getIGN('mtn_rasterizado'); };
    this.catalog[CatalogLayerName.IGN_BASE] = () => { return this.getBaseIGN(); };
    this.catalog[CatalogLayerName.PNOA_ORTHO] = () => { return this.getPNOA('OI.OrthoimageCoverage'); };
    this.catalog[CatalogLayerName.PNOA_MOSAIC] = () => { return this.getPNOA('OI.MosaicElement'); };
    this.catalog[CatalogLayerName.NASA] = () => { return this.getNASA(); };
    this.catalog[CatalogLayerName.OSM] = () => { return basemapBuilder.getOSM(); };
    this.catalog[CatalogLayerName.OSM_GREY] = () => { return basemapBuilder.getOSMGreyColor(); };
    this.catalog[CatalogLayerName.OSM_TERRAIN] = () => { return basemapBuilder.getOSMStamen(CatalogLayerName.OSM_TERRAIN); };
    this.catalog[CatalogLayerName.OSM_TONER] = () => { return basemapBuilder.getOSMStamen(CatalogLayerName.OSM_TONER); };
    this.catalog[CatalogLayerName.OSM_WATERCOLOR] = () => { return basemapBuilder.getOSMStamen(CatalogLayerName.OSM_WATERCOLOR); };
    this.catalog[CatalogLayerName.OSM_KLOKANTECH3D] = () => { return basemapBuilder.getOSMTiles('https://maps-cdn.salesboard.biz/styles/klokantech-3d-gl-style/{z}/{x}/{y}.png'); };
    this.catalog[CatalogLayerName.OSM_WIKIMEDIA] = () => { return basemapBuilder.getOSMTiles('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png'); };
    // this.catalog[CatalogLayerName.BING_MAP] = () => { return basemapBuilder.getBingMap(BINGMAP_KEY) };
  }

  getDefaultRasterLayer () {
    return this.getRasterLayer(BASEMAP_DEFAULT);
  }

  getRasterLayer (rasterKey) {
    var basemap = () => {};
    if (rasterKey in this.catalog) { basemap = this.catalog[rasterKey]; } else { basemap = this.catalog[BASEMAP_DEFAULT]; }
    return basemap();
  }

  getCatastro () {
    return basemapBuilder.getWMSLayer({
      title: 'Catastro',
      attributions: '© <a target="_blank" href="https://www.sedecatastro.gob.es/">DIRECCION GENERAL DEL CATASTRO</a>',
      url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx',
      layers: 'catastro',
      srs: 'EPSG:3857',
      format: 'image/png'
    });
  }

  getIGN (type) {
    return basemapBuilder.getWMSLayer({
      title: 'IGN',
      attributions: '© <a target="_blank" href="http://www.ign.es">Instituto Geográfico Nacional</a> ',
      url: 'https://www.ign.es/wms-inspire/mapa-raster',
      layers: type,
      srs: 'EPSG:3857',
      format: 'image/png'
    });
  }

  getBaseIGN () {
    return basemapBuilder.getWMSLayer({
      title: 'IGN',
      attributions: '© <a target="_blank" href="http://www.ign.es">Instituto Geográfico Nacional</a> ',
      url: 'https://www.ign.es/wms-inspire/ign-base',
      layers: 'IGNBaseTodo',
      srs: 'EPSG:3857',
      format: 'image/png'
    });
  }

  getPNOA (type) {
    return basemapBuilder.getWMSLayer({
      title: 'PNOA',
      attributions: '© <a target="_blank" href="http://www.scne.es">Sistema Cartográfico Nacional</a> ',
      url: 'https://www.ign.es/wms-inspire/pnoa-ma',
      layers: type,
      srs: 'EPSG:3857',
      format: 'image/png'
    });
  }

  getNASA () {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const parameterDate = currentDate.toISOString().slice(0, 10);
    return basemapBuilder.getXYZLayer({
      attributions: '<font size="0.5">We acknowledge the use of imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/Goddard Space Flight Center Earth Science Data and Information System (ESDIS) project. (' + currentDate + ')</font>',
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/' +
                'MODIS_Terra_CorrectedReflectance_TrueColor/default/' + parameterDate + '/' +
                // 'Agricultural_Lands_Pastures_2000/default/2018-08-15/' +
                'GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
    });
  }
}

export default new BasemapCatalog();

import urlParser from '../UrlParser';
import Parameter from '../Parameter';
import { LayerSetting } from '../layer/LayerSetting';
import MapInitializer from './MapInitializer';
import { LoadMonitorPanel } from '../../ui/LoadMonitorPanel';

const DEFAULT_TITLE_SIZE = '3';
const DEFAULT_TITLE_COLOR = 'black';
const DEFAULT_TITLE_FACE = 'Verdana, sans-serif';
const INCREMENTAL_COUNT_DEFAULT = 1;

export class MapSetting {
  constructor () {
    const loadStrategyType = (urlParser.has(Parameter.LOAD_TYPE) ? urlParser.get(Parameter.LOAD_TYPE) : Parameter.INC_LOAD_TYPE);
    const map = MapInitializer.getMap();

    const monitorPanel = new LoadMonitorPanel({
      parent: map.getOverlayContainerStopEvent()
    });

    this._layerSetting = new LayerSetting();

    this._setting = {
      map: map,
      monitorPanel: monitorPanel,
      loader: {
        isAllTypeLoad: loadStrategyType === Parameter.ALL_LOAD_TYPE,
        isIncrementalTypeLoad: loadStrategyType === Parameter.INC_LOAD_TYPE,
        incrementalCount: urlParser.has(Parameter.LOAD_BLOCK_INC) ? urlParser.get(Parameter.LOAD_BLOCK_INC) : INCREMENTAL_COUNT_DEFAULT
      },
      title: {
        hasTitle: urlParser.has(Parameter.TITLE),
        value: this.getTitleValue()
      },
      info: {
        allowNullAttribute: !urlParser.has(Parameter.ATTRIBUTE_NO_NULL)
      },
      zoom: {
        value: urlParser.get(Parameter.ZOOM)
      },
      colorPalette: {
        color1: urlParser.get(Parameter.COLOR1),
        color2: urlParser.get(Parameter.COLOR2),
        alpha: urlParser.get(Parameter.ALPHA)
      },
      addLayer: urlParser.has(Parameter.ADD_LAYER)
    };

    this._setting.layerSetting = this._layerSetting.getSetting();
    this._setting.layerSetting.map = map;

    this.registerBasemapSetting();
    this.registerOverviewSetting();
    this.registerLegendSetting();
  }

  setAllLoadStrategy () {
    this._setting.loader.isAllTypeLoad = true;
    this._setting.loader.isIncrementalTypeLoad = false;
  }

  registerBasemapSetting () {
    if (urlParser.has(Parameter.BASEMAP)) {
      this._setting.basemap = {
        id: urlParser.get(Parameter.BASEMAP)
      };
    }
  }

  registerOverviewSetting () {
    if (urlParser.has(Parameter.OVERVIEW)) {
      this._setting.overview = {
        id: urlParser.get(Parameter.OVERVIEW),
        height: urlParser.get(Parameter.OVERVIEW_HEIGHT),
        width: urlParser.get(Parameter.OVERVIEW_WIDTHT)
      };
    }
  }

  registerLegendSetting () {
    if (urlParser.has(Parameter.LEGEND)) {
      this._setting.legend = {
        isVertical: urlParser.get(Parameter.LEGEND) === Parameter.LEGEND_VERTICAL,
        colorWidth: urlParser.get(Parameter.LEGEND_COLOR_WIDTH),
        header: urlParser.get(Parameter.LEGEND_HEADER),
        footer: urlParser.get(Parameter.LEGEND_FOOTER),
        itemCount: urlParser.get(Parameter.LEGEND_ITEM_COUNT),
        layerZoom: urlParser.get(Parameter.LEGEND_LAYER_ZOOM),
        layerVisibility: urlParser.get(Parameter.LEGEND_LAYER_VISIBILITY),
        legendInfo: {},
        layers: {}
      };
    }
  }

  getTitleValue () {
    let size = `size="${DEFAULT_TITLE_SIZE}"`;
    let color = `color="${DEFAULT_TITLE_COLOR}"`;
    const face = `face="${DEFAULT_TITLE_FACE}"`;
    if (urlParser.has(Parameter.TITLE_SIZE)) { size = `size=${urlParser.get(Parameter.TITLE_SIZE)}`; }

    if (urlParser.has(Parameter.TITLE_COLOR)) { color = `color=${urlParser.get(Parameter.TITLE_COLOR)}`; }
    return `<font ${size} ${color} ${face}>${urlParser.get(Parameter.TITLE)} </font>`;
  }

  getSetting () {
    return this._setting;
  }

  getLayerSetting () {
    return this._layerSetting.getSetting();
  }
}

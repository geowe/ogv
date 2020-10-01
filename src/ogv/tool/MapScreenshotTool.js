import TileLayer from 'ol/layer/Tile';
import LayerTypeName from '../layer/LayerTypeName';
import domtoimage from 'dom-to-image-more';
const html2canvas = require('html2canvas');

HTMLCanvasElement.prototype.getContext = (function(origFn) {
    return function(type, attributes) {
        if (['experimental-webgl', 'webgl', 'webkit-3d', 'moz-webgl'].includes(type)) {
            attributes = Object.assign({}, attributes, {
                preserveDrawingBuffer: true,
            });
        }
        return origFn.call(this, type, attributes);
    };
})(HTMLCanvasElement.prototype.getContext);

const exportOptions = {
    filter: (element) => {
        var className = element.className || '';
        return (
            className.indexOf('ol-control') === -1 ||
            className.indexOf('ol-scale') > -1 ||
            (className.indexOf('ol-attribution') > -1 && className.indexOf('ol-uncollapsible'))
        );
    },
};

export class MapScreenshotTool {
    constructor(mapSetting) {
        this._setting = mapSetting.getSetting();
        this._setting.mapScreenshot.tool = this;
    }

    async getScreenshot(extension, format) {
        this._imageFormat = format;
        this._imageExtension = extension;
        this._map = this._setting.map;
        this._raster = this._setting.raster;
        this._rasterProxy = this._setting.rasterProxy;
        this.enableProxy();

        const promise = new Promise((resolve, reject) => {
            this._map.once('rendercomplete', () => {
                domtoimage.toCanvas(this._map.getViewport(), exportOptions).then(async(canvas) => {
                    const mapContext = canvas.getContext('2d');
                    this.addHeatMap(mapContext);
                    await this.addLegend(mapContext);
                    this.finish(canvas, resolve);
                });
            });
        });

        this._map.renderSync();
        return promise;
    }

    download(mapCanvas) {
        const element = document.createElement('a');
        element.setAttribute('href', mapCanvas.toDataURL(this._imageFormat));
        element.setAttribute('download', `map.${this._imageExtension}`);
        element.setAttribute('author', 'OGV GeoWE');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    finish(mapCanvas, resolve) {
        this.download(mapCanvas);
        this.enableProxy(false);
        resolve({});
    }

    addHeatMap(mapContext) {
        const heatMapCanvas = document.getElementsByTagName('canvas')[1];
        if (heatMapCanvas) mapContext.drawImage(heatMapCanvas, 0, 0);
    }

    getLegendName() {
        this._layerSetting = this._setting.layerSetting;
        let layerTypeName = LayerTypeName.SIMPLE_LAYER;

        if (this._layerSetting[LayerTypeName.THEMATIC_LAYER])
            layerTypeName = LayerTypeName.THEMATIC_LAYER;
        else if (this._layerSetting[LayerTypeName.SLD_LAYER])
            layerTypeName = LayerTypeName.SLD_LAYER;

        return `${layerTypeName}Legend`;
    }

    async addLegend(mapContext) {
        this._layerSetting = this._setting.layerSetting;
        let layerTypeName = LayerTypeName.SIMPLE_LAYER;

        if (this._layerSetting[LayerTypeName.THEMATIC_LAYER])
            layerTypeName = LayerTypeName.THEMATIC_LAYER;
        else if (this._layerSetting[LayerTypeName.SLD_LAYER])
            layerTypeName = LayerTypeName.SLD_LAYER;
        else if (this._layerSetting[LayerTypeName.HEAT_LAYER])
            layerTypeName = LayerTypeName.HEAT_LAYER;

        const legendElement = document.getElementById(`${layerTypeName}Legend`);
        if (legendElement) {
            const canvas = await html2canvas(legendElement);
            var rect = legendElement.getBoundingClientRect();
            mapContext.drawImage(canvas, rect.left, rect.top);
        }
    }

    clearTileLayers(map) {
        for (const layer of map.getLayers().getArray()) {
            if (layer instanceof TileLayer) {
                map.removeLayer(layer);
            }
        }
    }

    enableProxy(state = true) {
        this.clearTileLayers(this._map);
        const raster = state ? this._rasterProxy : this._raster;
        this._map.addLayer(raster);
    }
}
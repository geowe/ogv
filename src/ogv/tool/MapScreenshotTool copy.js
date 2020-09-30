import TileLayer from 'ol/layer/Tile';
import LayerTypeName from '../layer/LayerTypeName';
const html2canvas = require('html2canvas');

export class MapScreenshotTool {
    constructor(mapSetting) {
        this._setting = mapSetting.getSetting();
        this._setting.mapScreenshot.tool = this;
    }

    async getScreenshot(extension, format) {
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

        this._imageFormat = format;
        this._imageExtension = extension;
        this._map = this._setting.map;
        this._raster = this._setting.raster;
        this._rasterProxy = this._setting.rasterProxy;
        this._finish = true; // flag para finalizar directamente o esperar a renderizar leyenda
        // this.clearTileLayers(this._map);
        // this._map.addLayer(this._rasterProxy);

        const heatMapCanvas = document.getElementsByTagName('canvas')[1];
        const _addLegend = this.addLengend.bind(this);

        const promise = new Promise((resolve, reject) => {
            this._map.once('rendercomplete', () => {
                const mapCanvas = document.createElement('canvas');

                const size = this._map.getSize();
                mapCanvas.width = size[0];
                mapCanvas.height = size[1];
                const mapContext = mapCanvas.getContext('2d');

                Array.prototype.forEach.call(
                    document.querySelectorAll('.ol-layer canvas'),
                    (canvas) => {
                        if (canvas.width > 0) {
                            var opacity = canvas.parentNode.style.opacity;
                            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                            var transform = canvas.style.transform;
                            // Get the transform parameters from the style's transform matrix
                            var matrix = transform
                                .match(/^matrix\(([^\(]*)\)$/)[1]
                                .split(',')
                                .map(Number);
                            // Apply the transform to the export map context
                            CanvasRenderingContext2D.prototype.setTransform.apply(
                                mapContext,
                                matrix
                            );
                            mapContext.drawImage(canvas, 0, 0);
                            if (heatMapCanvas) mapContext.drawImage(heatMapCanvas, 0, 0);
                            // _addLegend(mapContext, mapCanvas, resolve);
                        }
                    }
                );

                this.finish(mapCanvas, resolve);
            });
        });

        this._map.renderSync();
        return promise;
    }

    download(mapCanvas) {
        const element = document.createElement('a');
        element.setAttribute('href', mapCanvas.toDataURL(this._imageFormat));
        // element.setAttribute('href', heatMapCanvas.toDataURL('PNG'));
        element.setAttribute('download', `map.${this._imageExtension}`);
        element.setAttribute('author', 'OGV GeoWE');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    clearTileLayers(map) {
        for (const layer of map.getLayers().getArray()) {
            if (layer instanceof TileLayer) {
                map.removeLayer(layer);
            }
        }
    }

    addLengend(mapContext, mapCanvas, resolve) {
        const legend = this.getLegend();

        if (legend.style.display === 'none') return false;

        this._finish = false;
        html2canvas(legend).then((canvas) => {
            var rect = legend.getBoundingClientRect();

            mapContext.drawImage(canvas, rect.left, rect.top);
            this._finish = true;
            this.finish(mapCanvas, resolve);
        });
    }

    getLegend() {
        this._layerSetting = this._setting.layerSetting;
        let layerTypeName = LayerTypeName.SIMPLE_LAYER;

        if (this._layerSetting[LayerTypeName.THEMATIC_LAYER])
            layerTypeName = LayerTypeName.THEMATIC_LAYER;
        else if (this._layerSetting[LayerTypeName.SLD_LAYER])
            layerTypeName = LayerTypeName.SLD_LAYER;

        return document.getElementById(`${layerTypeName}Legend`);
    }

    finish(mapCanvas, resolve) {
        // if (!this._finish) return;

        this.download(mapCanvas);
        this.clearTileLayers(this._map);
        this._map.addLayer(this._raster);
        resolve({});
    }
}
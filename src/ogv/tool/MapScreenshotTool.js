const html2canvas = require('html2canvas');

export class MapScreenshotTool {
    constructor(mapSetting) {
        this._setting = mapSetting.getSetting();
        this._setting.mapScreenshot.tool = this;
    }

    async getScreenshot() {
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

        const heatMapCanvas = document.getElementsByTagName('canvas')[1];

        const map = this._setting.map;
        const promise = new Promise((resolve, reject) => {
            map.once('rendercomplete', () => {
                var mapCanvas = document.createElement('canvas');

                var size = map.getSize();
                mapCanvas.width = size[0];
                mapCanvas.height = size[1];
                var mapContext = mapCanvas.getContext('2d');

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

                            var img = document.getElementById('simpleLayerLegend');

                            // mapContext.drawImage(img.getContext('2d'), 0, 0);
                            // 'simpleLayerLegendlegendContent'
                            html2canvas(img).then((canvas) => {
                                mapContext.drawImage(canvas, 100, 200);
                                this.download(mapCanvas);
                                resolve({});
                            });
                        }
                    }
                );
                // this.download();
                // resolve({});
            });
            // map.renderSync();
        });

        map.renderSync();
        return promise;
    }

    download(mapCanvas) {
        const element = document.createElement('a');
        element.setAttribute('href', mapCanvas.toDataURL('PNG'));
        // element.setAttribute('href', heatMapCanvas.toDataURL('PNG'));
        element.setAttribute('download', 'map.png');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
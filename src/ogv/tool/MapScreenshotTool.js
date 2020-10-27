import TileLayer from 'ol/layer/Tile';
import LayerTypeName from '../layer/LayerTypeName';
import domtoimage from 'dom-to-image-more';
import QRCode from 'easyqrcodejs/dist/easy.qrcode.min';
// import logo from '../../ui/img/geowe-logo-cuadrado.jpg';
import logoQR from '../../ui/img/geowe-qr.png';
// import ogvLogo2Azul from '../../ui/img/ogv-azul.png';
import ogvWater from '../../ui/img/ogv-water.png';

const html2canvas = require('html2canvas');

const DIN_A4 = [190, 210];
const RESOLUTION_DPI = 120;
const DIN = DIN_A4;
// 1 ppi = 1 dpi = 1 Pixeles por Inch(25.4 mm)
const widthPixel = Math.round((DIN[0] * RESOLUTION_DPI) / 25.4);
const heightPixel = Math.round((DIN[1] * RESOLUTION_DPI) / 25.4);

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
        this._loadMonitorPanel = this._setting.monitorPanel;
        this._map = this._setting.map;
    }

    async getScreenshot(extension, format, autoDonwload = true) {
        this._loadMonitorPanel.show('Generando captura...');
        this._imageFormat = format;
        this._imageExtension = extension;
        this._raster = this._setting.raster;
        this._rasterProxy = this._setting.rasterProxy;
        this.enableProxy();
        // const size = this._map.getSize();
        const size = [
            document.getElementById('map').style.width,
            document.getElementById('map').style.height,
        ];
        const viewResolution = this._map.getView().getResolution();

        const promise = new Promise((resolve, reject) => {
            this._map.once('rendercomplete', () => {
                domtoimage
                    .toCanvas(this._map.getViewport(), exportOptions)
                    .then(async(canvas) => {
                        const mapContext = canvas.getContext('2d');
                        this.addHeatMap(mapContext);
                        await this.addLegend(mapContext);
                        await this.addWaterGeoWELogo(mapContext);
                        // await this.addQRCode(mapContext);

                        document.getElementById('map').style.width = `100%`;
                        document.getElementById('map').style.height = `100%`;
                        this._map.updateSize();

                        this.finish(canvas, resolve, autoDonwload);
                    })
                    .catch((err) => {
                        alert('No se permite la captura del mapa');
                        this.enableProxy(false);
                        this._loadMonitorPanel.hide();
                        resolve({});
                    });
            });
        });

        document.getElementById('map').style.width = `${widthPixel}px`; // '2244px';
        document.getElementById('map').style.height = `${heightPixel}px`; // '2480px';
        this._map.updateSize();

        setTimeout(() => {
            this._map.renderSync();
        }, 1000);
        return promise;
    }

    download(base64Image) {
        const element = document.createElement('a');
        element.setAttribute('href', base64Image);
        element.setAttribute('download', `map.${this._imageExtension}`);
        element.setAttribute('author', 'OGV GeoWE');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    finish(mapCanvas, resolve, autoDonwload) {
        const base64Image = mapCanvas.toDataURL(this._imageFormat);
        if (autoDonwload) this.download(base64Image);
        this.enableProxy(false);
        this._loadMonitorPanel.hide();
        resolve(base64Image);
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
            const canvas = await html2canvas(legendElement)
                .then((canvas) => {
                    var rect = legendElement.getBoundingClientRect();
                    const mapWidth = this._map.getSize()[0];
                    const mapHeight = this._map.getSize()[1];
                    mapContext.drawImage(canvas, rect.left, mapHeight - canvas.height - 70);
                    // mapContext.drawImage(canvas, mapWidth - canvas.width, rect.top);
                    // mapContext.drawImage(canvas, rect.left, rect.top);
                })
                .catch(() => {});
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
        if (!this._raster) return;
        this.clearTileLayers(this._map);
        const raster = state ? this._rasterProxy : this._raster;
        this._map.addLayer(raster);
    }

    async showQrCode() {
        this._loadMonitorPanel.show('Generando código QR del mapa...');
        const promise = new Promise((resolve, reject) => {
            const qrSize = 200;
            const data = window.location.href;

            const qrCodeElement = document.getElementById('qrCode');

            const qrcode = new QRCode(qrCodeElement, {
                width: qrSize,
                height: qrSize,
                text: data,
                logo: logoQR,
                logoWidth: undefined,
                logoHeight: undefined,
                logoBackgroundColor: '#ffffff',
                logoBackgroundTransparent: true,
                correctLevel: QRCode.CorrectLevel.H,
            });

            setTimeout(() => {
                let qrCodeImage = qrcode._el.outerHTML.split('src=')[1];
                // qrCodeImage = qrCodeImage.substring(1, qrCodeImage.indexOf('"></div>'));
                qrCodeImage = qrCodeImage.split('"')[1];
                // this._qrCodeImage = await this.resizedataURL(this._qrCodeImage, qrSize, qrSize);
                qrcode.clear();
                this._loadMonitorPanel.hide();
                resolve(qrCodeImage);
            }, 1000);
        });

        return promise;
    }

    async addQRCode(mapContext) {
        const promise = new Promise(async(resolve, reject) => {
            const qrCodeImage = await this.showQrCode();
            const img = new Image();

            img.onload = () => {
                const mapWidth = this._map.getSize()[0];
                mapContext.drawImage(img, mapWidth - img.width, 60);
                resolve();
            };
            img.src = qrCodeImage;
        });

        return promise;
    }

    async addWaterGeoWELogo(mapContext) {
        const promise = new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const mapWidth = this._map.getSize()[0];
                const mapHeight = this._map.getSize()[1];
                mapContext.drawImage(img, mapWidth - img.width, mapHeight - img.height - 5);
                resolve();
            };
            img.src = ogvWater;
        });

        return promise;
    }

    // resizedataURL(datas, wantedWidth, wantedHeight) {
    //         return new Promise(async function(resolve, reject) {
    //             // We create an image to receive the Data URI
    //             var img = document.createElement('img');

    //             // When the event "onload" is triggered we can resize the image.
    //             img.onload = function() {
    //                 // We create a canvas and get its context.
    //                 var canvas = document.createElement('canvas');
    //                 var ctx = canvas.getContext('2d');

    //                 // We set the dimensions at the wanted size.
    //                 // var dpr = window.devicePixelRatio || 1;
    //                 canvas.width = wantedWidth;
    //                 canvas.height = wantedHeight;

    //                 // We resize the image with the canvas method drawImage();
    //                 ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
    //                 ctx.scale(0.5, 0.5);
    //                 var dataURI = canvas.toDataURL();

    //                 // This is the return of the Promise
    //                 resolve(dataURI);
    //             };
    //             img.src = datas;
    //         });
    //     } // Use it lik

    // getQRCodeSize() {
    //     // ancho: > 1000 pc;  768 tablet; 360 movil
    //     this._mapWidth = this._map.getSize()[0];
    //     // let size = configSize.mobile;
    //     // if (this._mapWidth > 600 && this._mapWidth < 1000) size = configSize.tablet;
    //     // if (this._mapWidth > 1000) size = configSize.pc;

    //     // return size;
    //     return 200;
    // }
}
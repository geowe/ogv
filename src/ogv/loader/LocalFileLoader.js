import { FileLoader } from './FileLoader';

export class LocalFileLoader extends FileLoader {
  constructor (mapSetting) {
    super(mapSetting);
    this._layerSetting = mapSetting.getLayerSetting();
  }

  load (files) {
    this._layerSetting.geojson = {};
    this._totalFileLoaded = this.getCountVectorLayerLoaded();
    this._totalFiles = this._totalFileLoaded + files.length;
    const colorPaletteSetting = this._mapSetting.colorPalette;
    colorPaletteSetting.colorTotal = this._totalFiles;
    colorPaletteSetting.keepIndex = true;
    this.configureColorPalette(colorPaletteSetting);
    super.load();

    files.forEach((file) => {
      this.loadFile(file);
    });
  }

  loadFile (file) {
    var points = '';
    var message = 'Cargando fichero';
    var loadId = setInterval(() => {
      points = points + '.';
      this._loadMonitorPanel.show(`${message}` + points);
    }, 1000);

    const workerUrl = this.createWorker((e) => {
      var fr = new FileReader();
      fr.onload = () => {
        self.postMessage(fr.result);
      };

      fr.readAsText(e.data);
    });

    const worker = new Worker(workerUrl);
    worker.onmessage = (e) => {
      message = 'Obteniendo elementos';

      setTimeout(() => {
        var fc = this.getFeatureCollection(e.data);
        clearInterval(loadId);
        this.addToMap(fc, file.name);
      }, 900);
    };
    worker.postMessage(file);
  }

  createWorker (param) {
    var str = (typeof param === 'function') ? param.toString() : param;
    var blob = new Blob(['\'use strict\';\nself.onmessage =' + str], { type: 'text/javascript' });
    return window.URL.createObjectURL(blob);
  }
}

import '../../ui/html/addLayerTool.css';
import html from '../../ui/html/addLayerTool.html';
import { VisualElement } from '../../ui/VisualElement';
import { FileLoadPanel } from '../../ui/FileLoadPanel';
import { LocalFileLoader } from '../loader/LocalFileLoader';

export class AddLayerTool extends VisualElement {
  constructor (mapSetting) {
    super(mapSetting.getSetting().map.getOverlayContainerStopEvent(), html);
    if (mapSetting.getSetting().addLayer) { this.configure(mapSetting); }
  }

  configure (mapSetting) {
    this.loader = new LocalFileLoader(mapSetting);
    this.fileLoadPanel = new FileLoadPanel({
      parent: mapSetting.getSetting().map.getOverlayContainerStopEvent(),
      onSuccessful: this.accept.bind(this)
    });

    const button = document.getElementById('addLayerButton');
    button.addEventListener('click', this.fileLoadPanel.show.bind(this.fileLoadPanel));
    this.show();
  }

  accept () {
    this.fileLoadPanel.hide();
    var files = this.fileLoadPanel.getFiles();
    this.loader.load(files);
  }
}

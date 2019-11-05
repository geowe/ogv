import { MapTitlePanel } from '../../ui/MapTitlePanel';

export class TitleMapTool {
  constructor (setting) {
    const titleSetting = setting.title;

    this.mapTitlePanel = new MapTitlePanel({
      parent: setting.map.getOverlayContainerStopEvent()
    });

    if (titleSetting.hasTitle) { this.mapTitlePanel.show(titleSetting.value); }
  }
}

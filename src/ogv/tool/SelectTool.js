import Select from 'ol/interaction/Select';
import { FeatureInfoPanel } from '../../ui/FeatureInfoPanel';
import { SelectToolStyle } from '../style/SelectToolStyle';

export class SelectTool {
  constructor (setting) {
    this._style = new SelectToolStyle();

    this._featureInfoPanel = new FeatureInfoPanel({
      parent: setting.map.getOverlayContainerStopEvent(),
      allowNullAttribute: setting.info.allowNullAttribute
    });

    const featureSelect = new Select({
      style: [this._style.getStyle(), this._style.getShadowStyle(), this._style.getShadowStyle()]
    });

    setting.map.addInteraction(featureSelect);
    this.registerEvent(featureSelect);
    setting.layerSetting.featureSelect = featureSelect;
  }

  registerEvent (select) {
    const selectedFeatures = select.getFeatures();

    selectedFeatures.on('add', (event) => {
      var feature = event.target.item(0);
      this._featureInfoPanel.show(feature);
    });

    selectedFeatures.on('remove', (event) => {
      this._featureInfoPanel.hide();
    });
  }
}

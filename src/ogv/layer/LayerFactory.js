import { HeatLayer } from './HeatLayer';
import { SimpleLayer } from './SimpleLayer';
import { ThematicLayer } from './ThematicLayer';
import { ClusterLayer } from './ClusterLayer';
import { SLDLayer } from './SLDLayer';
import LayerTypeName from './LayerTypeName';

class LayerFactory {
    constructor() {
        this.baseLayerType = {};
        this.baseLayerType[LayerTypeName.SIMPLE_LAYER] = () => new SimpleLayer();
        this.baseLayerType[LayerTypeName.HEAT_LAYER] = () => new HeatLayer();
        this.baseLayerType[LayerTypeName.THEMATIC_LAYER] = () => new ThematicLayer();
        this.baseLayerType[LayerTypeName.CLUSTER_LAYER] = (mapSetting) => {
            mapSetting.setAllLoadStrategy();
            return new ClusterLayer();
        };
        this.baseLayerType[LayerTypeName.SLD_LAYER] = () => new SLDLayer();
    }

    getLayer(mapSetting, features) {
        const layerSetting = mapSetting.getLayerSetting();
        let selectedBaseLayer = this.baseLayerType[LayerTypeName.SIMPLE_LAYER];

        for (var type in this.baseLayerType) {
            if (Object.prototype.hasOwnProperty.call(layerSetting, type)) {
                selectedBaseLayer = this.baseLayerType[type];
            }
        }

        const baseLayer = selectedBaseLayer(mapSetting);
        baseLayer.setSetting(layerSetting);
        baseLayer.setFeatures(features);
        return baseLayer;
    }
}

export default new LayerFactory();
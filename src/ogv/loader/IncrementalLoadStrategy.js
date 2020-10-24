import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import { LoadAnimationStyle } from '../style/LoadAnimationStyle';

const DEFAULT_DELAY_TIME = 0;
const FLASH_ANIMATION_DURATION = 100;

export class IncrementalLoadStrategy {
    constructor(args) {
        this._incrementalValue = parseInt(args.incrementalValue);
        this._monitorPanel = args.monitorPanel;
        this._map = args.map;
        this._layerName = args.layerName;
        this._zIndex = args.zIndex;
        this._onFinish = args.onFinish;
    }

    load(baseLayer) {
        const features = baseLayer.getFeatures();
        const vectorLayer = baseLayer.getEmptyLayer(this._layerName);
        vectorLayer.setZIndex(this._zIndex);
        this._map.addLayer(vectorLayer);
        const source = vectorLayer.getSource();

        source.on('addfeature', (e) => {
            // this.flash(e.feature, vectorLayer);
        });

        let index = 0;
        const elementTotal = features.length;
        let currentElement = 0;
        var blockInc = 0;
        var blockFeature = [];

        var timeOut = setInterval(() => {
            if (index < features.length) {
                currentElement++;

                const porcentaje = parseInt('' + (currentElement * 100) / elementTotal);
                if (this._incrementalValue === 1) {
                    source.addFeature(features[index]);
                    this._monitorPanel.show(
                        `Cargando capa <b><i>${this._layerName}</i></b> en el mapa...[${currentElement}/${elementTotal}]`,
                        porcentaje
                    );
                } else {
                    if (blockInc === this._incrementalValue) {
                        source.addFeatures(blockFeature);
                        this._monitorPanel.show(
                            `Cargando capa <b><i>${this._layerName}</i></b> en el mapa...[${currentElement}/${elementTotal}]`,
                            porcentaje
                        );
                        blockInc = 0;
                        blockFeature = [];
                    }

                    blockFeature[blockInc] = features[index];
                    blockInc++;
                }

                index++;
            } else {
                source.addFeatures(blockFeature);
                clearInterval(timeOut);
                this._onFinish();
            }
        }, DEFAULT_DELAY_TIME);
    }

    flash(feature, vectorLayer) {
        const start = new Date().getTime();
        const listenerKey = vectorLayer.on('postrender', animate);
        const map = this._map;

        function animate(event) {
            var vectorContext = getVectorContext(event);
            var frameState = event.frameState;
            var flashGeom = feature.getGeometry().clone();
            var elapsed = frameState.time - start;
            var elapsedRatio = elapsed / FLASH_ANIMATION_DURATION;
            var radius = easeOut(elapsedRatio) * 25 + 5;
            var opacity = easeOut(1 - elapsedRatio);

            vectorContext.setStyle(LoadAnimationStyle.getStyle(opacity, radius));
            vectorContext.drawGeometry(flashGeom);
            if (elapsed > FLASH_ANIMATION_DURATION) {
                unByKey(listenerKey);
                return;
            }

            map.render();
        }
    }
}
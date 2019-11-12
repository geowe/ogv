import { Reader, createOlStyleFunction } from '@nieuwlandgeo/sldreader/src/index';
import { getLayer as getSLDLayer, getStyle as getSLDStyle } from '@nieuwlandgeo/sldreader/src/Utils';

export class SLDLayerStyle {

    constructor(sldFileUrl, sldLayerName, callback) {
        this._sldFileUrl = sldFileUrl;
        this._sldLayerName = sldLayerName;

        fetch(sldFileUrl).then((response) => {
                return response.text();
            })
            .then((text) => {
                const sldObject = new Reader(text);
                const sldLayer = getSLDLayer(sldObject, sldLayerName);
                const style = getSLDStyle(sldLayer, sldLayerName);
                const featureTypeStyle = style.featuretypestyles[0];

                this._rule = {};
                featureTypeStyle.rules.forEach((rule) => {
                    //alert(JSON.stringify())
                    this._rule[rule.name] = rule.polygonsymbolizer.fill.styling.fill
                        //alert(rule.name + "  " + JSON.stringify(rule.polygonsymbolizer.fill.styling.fill))

                })

                callback();
            });

    }

    setSLDFileUrl(url, sldLayerName, vectorLayer) {
        fetch(url).then((response) => {
                return response.text();
            })
            .then((text) => {
                const sldObject = new Reader(text);
                const sldLayer = getSLDLayer(sldObject, sldLayerName);
                const style = getSLDStyle(sldLayer, sldLayerName);
                const featureTypeStyle = style.featuretypestyles[0];
                vectorLayer.setStyle(createOlStyleFunction(featureTypeStyle));
                this._rule = {};
                featureTypeStyle.rules.forEach((rule) => {
                    //alert(JSON.stringify())
                    this._rule[rule.name] = rule.polygonsymbolizer.fill.styling.fill
                        //alert(rule.name + "  " + JSON.stringify(rule.polygonsymbolizer.fill.styling.fill))

                })
            });
    }

    getRule() {


        return this._rule;
    }
}
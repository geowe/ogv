import { COLOR_WIDTH_DEFAULT, PIXEL_WIDTH_VALUE, LEGEND_HEIGHT, VERTICAL_CSS_NAME, LayerLegend } from './LayerLegend';

export class SLDLayerLegend extends LayerLegend {
    constructor(arg) {
        super({ id: 'sldLayerLegend', parent: arg.parent });
        this._categories = arg.categories;
    }

    show(mapSetting, layerName) {
        super.show(mapSetting, layerName);
    }

    prepareLegendInfo(mapSetting) {
        if (mapSetting.legend !== undefined) {

        }
    }

    addHorizontalLegend(colorWidth) {
        this.addVerticalLegend(colorWidth);
    }

    addVerticalLegend(colorWidth) {
        let maxWidth = 0;
        this._legendContent.style.height = LEGEND_HEIGHT;
        let keys = Object.keys(this._categories);

        keys.forEach((categoryKey) => {
            var length = ("" + categoryKey).length;
            if (length > maxWidth) {
                maxWidth = length;
            }
            var item = this.getItemLegend(categoryKey, this._categories[categoryKey], VERTICAL_CSS_NAME, colorWidth);
            item.boxContainer.appendChild(item.box);
            item.boxContainer.appendChild(item.label);

            this._legendContent.appendChild(item.boxContainer);
        });

        colorWidth = colorWidth === null ? COLOR_WIDTH_DEFAULT : parseInt(colorWidth);
        var width = colorWidth + (maxWidth * PIXEL_WIDTH_VALUE);
        this.setLegendContentWidth(width);
    }

    getItemLegend(itemName, color, className, colorWidth) {
        var label = document.createElement('span');
        label.innerHTML = ' ' + itemName;

        var box = document.createElement('div');
        box.className = className;
        box.style.backgroundColor = color;
        box.title = itemName;

        if (colorWidth !== undefined) { box.style.width = colorWidth + 'px'; }

        return {
            boxContainer: document.createElement('div'),
            label: label,
            box: box
        };
    }
}
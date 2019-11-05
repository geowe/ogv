import './html/fileDetailPanel.css';

import html from './html/legendInfoPanel.html';
import { VisualElement, ID_ATTRIBUTE } from './VisualElement';

const LEGEND_INFO_CLOSE_BUTTON = 'legendInfoCloseButton';
const LEGEND_INFO_TABLE = 'legendInfoTable';
const TOTAL_LAYERS = 'Total de capas';
const TOTAL_ELEMENTS = 'Total elementos';

export class LegendInfoPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    this.availablesHTMLElement();
    this.adaptIdentifiersToTypeLegend(arg.id);
    this.registerEventCloseButton();
  }

  availablesHTMLElement () {
    this._legendInfoCloseButton = document.getElementById(LEGEND_INFO_CLOSE_BUTTON);
    this._legendInfoTable = document.getElementById(LEGEND_INFO_TABLE);
  }

  adaptIdentifiersToTypeLegend (id) {
    this._element.setAttribute(ID_ATTRIBUTE, id);
    this._legendInfoCloseButton.setAttribute(ID_ATTRIBUTE, id + LEGEND_INFO_CLOSE_BUTTON);
    this._legendInfoTable.setAttribute(ID_ATTRIBUTE, id + LEGEND_INFO_TABLE);
  }

  registerEventCloseButton () {
    this._legendInfoCloseButton.onclick = () => {
      while (this._legendInfoTable.rows.length !== 1) {
        this._legendInfoTable.deleteRow(1);
      }

      this.hide();
    };
  }

  show (legendSetting) {
    // if (this._legendInfoTable.rows.length === 1) {
    this.addRow({
      description: TOTAL_LAYERS,
      count: legendSetting.totalLayer
    });
    this.addRow({
      description: TOTAL_ELEMENTS,
      count: legendSetting.totalFeatures
    });

    for (var key in legendSetting.legendInfo) {
      this.addRow({
        description: key,
        count: legendSetting.legendInfo[key]
      });
    }
    // }
    super.show();
  }

  addRow (rowInfo) {
    const row = this._legendInfoTable.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = rowInfo.description;
    cell2.innerHTML = rowInfo.count;
  }
}

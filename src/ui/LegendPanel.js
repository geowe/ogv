import './html/legendPanel.css';
import html from './html/legendPanel.html';
import { VisualElement, ID_ATTRIBUTE } from './VisualElement';

const LEGEND_HEADER_ID = 'legendHeader';
const LEGEND_CONTENT_ID = 'legendContent';
const LEGEND_FOOTER_ID = 'legendFooter';

export class LegendPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    this.availablesHTMLElement();
    this.adaptIdentifiersToTypeLegend(arg.id);

    if (arg.visible) { super.show(); }
  }

  availablesHTMLElement () {
    this._legendHeader = document.getElementById(LEGEND_HEADER_ID);
    this._legendContent = document.getElementById(LEGEND_CONTENT_ID);
    this._legendFooter = document.getElementById(LEGEND_FOOTER_ID);
  }

  adaptIdentifiersToTypeLegend (id) {
    this._element.setAttribute(ID_ATTRIBUTE, id);
    this._legendHeader.setAttribute(ID_ATTRIBUTE, id + LEGEND_HEADER_ID);
    this._legendContent.setAttribute(ID_ATTRIBUTE, id + LEGEND_CONTENT_ID);
    this._legendFooter.setAttribute(ID_ATTRIBUTE, id + LEGEND_FOOTER_ID);
  }

  showSection (parameter, section, enabled) {
    if (enabled) {
      section.style.display = 'block';
      section.innerHTML = parameter;
    }
  }
}

import { VisualElement } from './VisualElement';
import html from './html/mapTitlePanel.html';

export class MapTitlePanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    this.titleContainer = document.getElementById('mapTitleContainer');
    this.mapTitle = document.getElementById('mapTitle');
  }

  show (title) {
    this.setTitle(title);
    super.show();
  }

  setTitle (title) {
    this.mapTitle.innerHTML = title;
  }
}

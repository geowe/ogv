import html from './html/loadMonitorPanel.html';
import { VisualElement } from './VisualElement';

export class LoadMonitorPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);
    this._messageLabel = document.getElementById('messageLabel');
  }

  show (msg) {
    this.setMessage(msg);
    super.show();
  }

  setMessage (msg) {
    this._messageLabel.innerHTML = msg;
  }
}

import html from './html/loadMonitorPanel.html';
import { VisualElement } from './VisualElement';

export class LoadMonitorPanel extends VisualElement {
    constructor(arg) {
        super(arg.parent, html);
        this._messageLabel = document.getElementById('messageLabel');
        this._progressBar = document.getElementById('progressBar');
    }

    show(msg, width) {
        this.setMessage(msg);
        super.show();
        if (isNaN(width)) return;
        this._progressBar.style.width = `${width}%`;
        this._progressBar.innerHTML = width * 1 + '%';
    }

    setMessage(msg) {
        this._messageLabel.innerHTML = msg;
    }
}
import htmlTemplate from './html/HTMLWidgetPanel.html';
import './html/HTMLWidgetPanel.css';

export class HTMLWidget {

    constructor() {

        const template = document.createElement('div');
        template.innerHTML = htmlTemplate.trim();
        this._element = template.firstChild;
        this._element.style.display = 'none';
        document.body.appendChild(this._element);

        //this._panel = document.getElementById("htmlWidgetpanel");
        this._code = document.getElementById("code");

        this._button = document.getElementById("widgetHtmlButton");

        this._button.onclick = () => {
            if (this._element.style.display === 'block') {
                this._element.style.display = 'none';
            } else {
                this._element.style.display = 'block';

                this._code.innerText = `<iframe 
                id="map" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                src="https://geowe.org/ogv/viewer/${location.search}"></iframe>`;
            }
        }
    }




}
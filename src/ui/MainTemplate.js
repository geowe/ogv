import 'mapskin/css/mapskin.css';
import 'w3css/w3.css';
import './html/main.css';
import logo from './img/geowe-logo-cuadrado.jpg';
import ogvLogo from './img/ogv-logo.png';
import html from './html/main.html';

class MainTemplate {
  constructor () {
    var templateElement = document.createElement('div');
    templateElement.innerHTML = html;
    document.body.appendChild(templateElement);
    document.getElementById('logo').src = logo;
    document.getElementById('ogvLogo').src = ogvLogo;
  }
}

export default new MainTemplate();

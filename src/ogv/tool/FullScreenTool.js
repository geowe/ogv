import { FullScreen } from 'ol/control';

const MAXIMIZE_MESSAGE = 'Maximizar mapa';
const MINIMIZE_MESSAGE = 'Minimizar mapa';

export class FullScreenTool {
  constructor (setting) {
    var fullScreen = new FullScreen({
      source: 'fullscreen',
      tipLabel: MAXIMIZE_MESSAGE
    });

    fullScreen.element.style['background-color'] = 'rgba(00, 00, 00, 0)';
    fullScreen.element.style.top = 'calc(100vh - 8.8rem)';
    fullScreen.element.style.right = '40px';
    fullScreen.button_.className = 'w3-btn w3-ripple w3-circle w3-xlarge ogv-tool'; // w3-red
    fullScreen.button_.innerHTML = "<b class='w3-display-middle'><i class='ms ms-maximize'></i></b>";
    fullScreen.element.style.width = '10px'; // 10px
    fullScreen.element.style.height = '25px'; // 25px
    fullScreen.element.style['z-index'] = '5';

    fullScreen.button_.addEventListener('click', () => {
      if (this.isFullScreen()) {
        fullScreen.button_.innerHTML = "<b class='w3-display-middle'><i class='ms ms-maximize'></i></b>";
        fullScreen.button_.title = MAXIMIZE_MESSAGE;
      } else {
        fullScreen.button_.innerHTML = "<b class='w3-display-middle'><i class='ms ms-minimize'></i></b>";
        fullScreen.button_.title = MINIMIZE_MESSAGE;
      }
    });

    setting.map.getControls().push(fullScreen);
  }

  isFullScreen () {
    return !!(
      document.webkitIsFullScreen || document.msFullscreenElement || document.fullscreenElement
    );
  }
}

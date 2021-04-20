// const WMS_PROXY = '//www.geowe.org/proxy/wmsTiledProxy.php?url=';
const proxy = '//www.geowe.org/proxy/xyzTiledProxy.php?url=';

class ProxyTileLoader {
    constructor() {
        this._proxy = proxy;
    }

    setProxyURL(url) {
        this._proxy = url;
    }

    load(tile, src) {
        const xhr = new XMLHttpRequest();
        xhr.open(
            'GET',
            this._proxy + encodeURIComponent(src).replace(/'/g, '%27').replace(/"/g, '%22')
        );
        xhr.responseType = 'arraybuffer';

        xhr.onload = () => {
            const arrayBufferView = new Uint8Array(xhr.response);
            const blob = new Blob([arrayBufferView], { type: 'image/png' });
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);
            tile.getImage().src = imageUrl;
        };
        xhr.onerror = () => {
            console.log('ERROR al intentar cargar las teselas desde el proxy: ' + this._proxy);
        };

        xhr.send();
    }
}

export default new ProxyTileLoader();
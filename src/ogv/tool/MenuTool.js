class MenuTool {
    configure(mapSetting) {
        this._mapSetting = mapSetting;
        const menuButton = document.getElementById('menuButton');
        menuButton.addEventListener('click', this.execute);

        const pngDownloadButton = document.getElementById('pngDownloadButton');
        pngDownloadButton.addEventListener('click', this.download.bind(this, 'PNG'));
    }

    execute() {
        var x = document.getElementById('menuOptionsButton');
        if (x.className.indexOf('w3-show') === -1) {
            x.className += ' w3-show';
        } else {
            x.className = x.className.replace(' w3-show', '');
        }
    }

    async download(format) {
        const screenshotConfig = this._mapSetting.mapScreenshot;
        await screenshotConfig.tool.getScreenshot();
    }
}

export default new MenuTool();
class MenuTool {
    configure(mapSetting) {
        this._mapSetting = mapSetting;
        const menuButton = document.getElementById('menuButton');
        menuButton.addEventListener('click', this.execute);

        const pngDownloadButton = document.getElementById('pngDownloadButton');
        pngDownloadButton.addEventListener('click', this.download.bind(this, 'png', 'image/png'));

        const jpgDownloadButton = document.getElementById('jpgDownloadButton');
        jpgDownloadButton.addEventListener('click', this.download.bind(this, 'jpg', 'image/jpeg'));
    }

    execute() {
        var x = document.getElementById('menuOptionsButton');
        if (x.className.indexOf('w3-show') === -1) {
            x.className += ' w3-show';
        } else {
            x.className = x.className.replace(' w3-show', '');
        }
    }

    async download(extension, format) {
        const screenshotConfig = this._mapSetting.mapScreenshot;
        await screenshotConfig.tool.getScreenshot(extension, format);
    }
}

export default new MenuTool();
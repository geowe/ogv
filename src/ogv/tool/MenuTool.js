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
        this._menuOptionsButton = document.getElementById('menuOptionsButton');
        if (this._menuOptionsButton.className.indexOf('w3-show') === -1) {
            this._menuOptionsButton.className += ' w3-show';
        } else {
            this._menuOptionsButton.className = this._menuOptionsButton.className.replace(
                ' w3-show',
                ''
            );
        }
    }

    async download(extension, format) {
        this.execute();
        const screenshotConfig = this._mapSetting.mapScreenshot;
        await screenshotConfig.tool.getScreenshot(extension, format);
        this.execute();
    }
}

export default new MenuTool();
import reportGeneratorTool from './ReportGeneratorTool';

class MenuTool {
    configure(mapSetting) {
        this._mapSetting = mapSetting;
        const menuButton = document.getElementById('menuButton');
        menuButton.addEventListener('click', this.execute);

        const pngDownloadButton = document.getElementById('pngDownloadButton');
        pngDownloadButton.addEventListener('click', this.download.bind(this, 'png', 'image/png'));

        const jpgDownloadButton = document.getElementById('jpgDownloadButton');
        jpgDownloadButton.addEventListener('click', this.download.bind(this, 'jpg', 'image/jpeg'));

        const pdfDownloadButton = document.getElementById('pdfDownloadButton');
        pdfDownloadButton.addEventListener('click', this.generatePDF.bind(this));

        const qrCodeDownloadButton = document.getElementById('qrCodeDownloadButton');

        qrCodeDownloadButton.addEventListener('click', this.showQRCodeAndDownload.bind(this));
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

    async showQRCodeAndDownload() {
        const qrCodeImageElement = document.getElementById('qrCodeImage');
        qrCodeImageElement.src = '';
        const screenshotConfig = this._mapSetting.mapScreenshot;
        const qrCodeImage = await screenshotConfig.tool.showQrCode('qrCode');
        qrCodeImageElement.className = qrCodeImageElement.className.replace('w3-hide', '');
        qrCodeImageElement.src = qrCodeImage;

        const element = document.createElement('a');
        element.setAttribute('href', qrCodeImage);
        element.setAttribute('download', `geoweMapQRCode.png`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    async generatePDF() {
        reportGeneratorTool.generate(this._mapSetting);
    }
}

export default new MenuTool();
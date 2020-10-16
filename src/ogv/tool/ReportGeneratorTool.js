import jsPDF from 'jspdf';

const PDF_PARAMETER = {
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
};
const DEFAULT_TITLE = 'Informe de mapa';
const LEFT_MARGIN = 10;
const RIGHT_MARGIN = 10;
const PDF_IN_MM = 210;

class ReportGeneratorTool {
    async generate(mapSetting) {
        const screenshotConfig = mapSetting.mapScreenshot;
        const base64Image = await screenshotConfig.tool.getScreenshot('png', 'image/png', false);

        this._doc = new jsPDF(PDF_PARAMETER.orientation, PDF_PARAMETER.unit, PDF_PARAMETER.format);
        this._doc.setProperties({
            title: 'OGV by GeoWE',
            subject: 'Informe del mapa',
            author: 'OGV - GeoWE.org',
            keywords: 'Informe, report, mapa, maps, ogv, geowe',
            creator: 'GeoWE.org',
        });

        // this._doc.setFont('times');
        // this._doc.setFontSize(16);
        // this._doc.setFontStyle('bold');

        const title = mapSetting.title.hasTitle ? mapSetting.title.titleText : DEFAULT_TITLE;

        let y = 20;

        this._doc.setFontStyle('bold');
        this.centeredText(title, y, 24);
        this._doc.setFontSize(10);

        y = 70;
        const qrCodeImage = await screenshotConfig.tool.showQrCode('qrCode');
        var qrImageOffset =
            (this._doc.internal.pageSize.getWidth() - 50 - LEFT_MARGIN - RIGHT_MARGIN) / 2;
        this._doc.addImage(qrCodeImage, 'PNG', qrImageOffset, y, 50, 50);

        y = 210;
        this.centeredText(
            'Informe generado por OGV de GeoWE.org el' + this.getCurrentDate(),
            y,
            14
        );
        this._doc.addPage();
        y = 20;
        this._doc.setFontStyle('bold');
        this._doc.setFontSize(14);
        this._doc.text(LEFT_MARGIN, y, 'REPRESENTACIÓN GRÁFICA');
        y += 5;
        this._doc.addImage(base64Image, 'PNG', 10, y, 190, 210);

        await this.addHeaderAndPageNumber();
        const PDF_FILE_NAME = `geowe-ogv-map.pdf`;
        this._doc.save(PDF_FILE_NAME);
    }

    async addHeaderAndPageNumber(headerInfo) {
        var pageCount = this._doc.internal.getNumberOfPages();

        var num = pageCount;
        for (var i = 1; i < pageCount; i++) {
            this._doc.setPage(num);
            this._doc.setDrawColor(0, 0, 0);
            this._doc.setLineWidth(0.2);
            this._doc.setFontStyle('normal');
            this._doc.setFontSize(8);
            this._doc.text(10, 8, 'OGV - GeoWE.org');
            this._doc.line(10, 9, 200, 9);

            // await reportHeaderTemplate.addHeader(this._doc, headerInfo);

            this._doc.line(10, 287, 200, 287);
            this._doc.setFontSize(8);

            this._doc.text(10, 292, '' + this.getCurrentDate());
            this._doc.text(185, 292, '' + num + '/' + pageCount);
            num--;
        }
    }

    getCurrentDate() {
        var d = new Date();
        return `${this.getCompletedNumber(d.getDate())}/${this.getCompletedNumber(
            d.getMonth() + 1
        )}/${d.getFullYear()} ${this.getCompletedNumber(d.getHours())}:${this.getCompletedNumber(
            d.getMinutes()
        )}`;
    }

    getCompletedNumber(number) {
        number = number.toString();
        return number.length === 1 ? '0' + number : number;
    }

    centeredText(text, y, size = 12) {
        this._doc.setFontSize(size);
        var textWidth =
            (this._doc.getStringUnitWidth(text) * this._doc.internal.getFontSize()) /
            this._doc.internal.scaleFactor;
        var textOffset =
            (this._doc.internal.pageSize.getWidth() - textWidth - LEFT_MARGIN - RIGHT_MARGIN) / 2;

        if (textOffset > 10) this._doc.text(textOffset, y, text);
        else {
            const lines = this._doc.splitTextToSize(text, PDF_IN_MM - LEFT_MARGIN - RIGHT_MARGIN);
            this._doc.text(LEFT_MARGIN, y, lines);
        }
        this._doc.setFontStyle('normal');
        // const lineHeight = 10 * lines.length * 0.5;
    }
}

export default new ReportGeneratorTool();
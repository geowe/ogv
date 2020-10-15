import jsPDF from 'jspdf';

const PDF_PARAMETER = {
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
};

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

        this._doc.addImage(base64Image, 'PNG', 10, 20, 190, 63);
        // page1.addContent(this._doc, info, mapScreenshot);
        // page2.addContent(this._doc, info, config.checkedConfig);

        await this.addHeaderAndPageNumber();
        const PDF_FILE_NAME = `ogv-map.pdf`;
        this._doc.save(PDF_FILE_NAME);
    }

    async addHeaderAndPageNumber(headerInfo) {
        var pageCount = this._doc.internal.getNumberOfPages();

        var num = pageCount;
        for (var i = 0; i < pageCount; i++) {
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
}

export default new ReportGeneratorTool();
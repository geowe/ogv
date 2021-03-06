import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { VectorImage as VectorImageLayer, Vector as VectorLayer } from 'ol/layer';
import page3 from './report/Page3';
import page4 from './report/Page4';
import geowebg from '../../ui/img/geowe-bg.jpg';
import ogvLogo2Azul from '../../ui/img/ogv-azul.png';

const PDF_PARAMETER = {
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
};
const DEFAULT_TITLE = 'Informe de mapa';
const LEFT_MARGIN = 10;
const RIGHT_MARGIN = 10;
const PDF_IN_MM = 210;
const QR_CODE_SIZE = 50;
const FORM_FIELD_COLOR = 'rgb(255, 255, 200)';

const DISCLAIMER = `La información presentada en este informe ha sido generada dinámicamente a partir de los orígenes de datos geográficos visualizados en OGV, los cuales son propiedad de sus respectivos dueños y pueden cambiar en el tiempo.

Garantías y renuncia de responsabilidad
GeoWE.org no se hace responsable y no puede ofrecer garantías en relación de la veracidad, fiabilidad y calidad de los datos.

GeoWE SE PRESENTA "TAL CUAL", SIN GARANTÍAS O CONDICIONES DE CUALQUIER TIPO (ya sea explícita o implícita). EN NINGÚN CASO GeoWE (ni sus integrantes) SERÁN RESPONSABLES DE LA PÉRDIDA O DAÑO QUE PUDIERAN DERIVAR DEL USO DEL SISTEMA. `;

class ReportGeneratorTool {
    async generate(mapSetting) {
        this._map = mapSetting.map;
        const screenshotConfig = mapSetting.mapScreenshot;

        const title = mapSetting.title.hasTitle ? mapSetting.title.titleText : DEFAULT_TITLE;

        this._doc = new jsPDF(PDF_PARAMETER.orientation, PDF_PARAMETER.unit, PDF_PARAMETER.format);
        this._doc.setProperties({
            title: title,
            subject: 'Información gráfica y alfanumérica del mapa',
            author: 'OGV - GeoWE.org',
            keywords: `Informe, report, mapa, maps, ogv, geowe,${title}`,
            creator: 'GeoWE.org',
        });

        // this._doc.setFont('times');
        // this._doc.setFontSize(16);
        // this._doc.setFontStyle('bold');

        await this.addPage1(screenshotConfig, title);
        this.addDisclaimer();
        await this.addPage2(screenshotConfig);
        const layers = this.getLayers();
        page3.addPage(this._doc, layers);
        page4.addPage(this._doc, layers);

        await this.addHeaderAndPageNumber();
        const PDF_FILE_NAME = `geowe-ogv-map.pdf`;
        this._doc.save(PDF_FILE_NAME);
    }

    addHeaderAndPageNumber(headerInfo) {
        var pageCount = this._doc.internal.getNumberOfPages();

        var num = pageCount;
        for (var i = 1; i < pageCount; i++) {
            this._doc.setPage(num);
            this._doc.setDrawColor(0, 0, 0);
            this._doc.setLineWidth(0.2);
            this._doc.setFontStyle('normal');
            this._doc.setFontSize(8);
            this._doc.text(LEFT_MARGIN, 8, 'OGV - GeoWE.org');

            // this._doc.line(LEFT_MARGIN, 9, 180, 9);
            this._doc.line(LEFT_MARGIN, 9, this._doc.internal.pageSize.getWidth() - 27, 9);
            this._doc.addImage(ogvLogo2Azul, 'PNG', this._doc.internal.pageSize.getWidth() - 27, 1);

            // this._doc.addImage(ogvLogo2Azul, 'PNG', 180, 1);

            // await reportHeaderTemplate.addHeader(this._doc, headerInfo);

            this._doc.line(LEFT_MARGIN, 287, 200, 287);
            this._doc.setFontSize(8);

            this._doc.text(LEFT_MARGIN, 292, '' + this.getCurrentDate());
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
        let lineHeight = 50;
        this._doc.setFontSize(size);
        var textWidth =
            (this._doc.getStringUnitWidth(text) * this._doc.internal.getFontSize()) /
            this._doc.internal.scaleFactor;
        var textOffset = (this._doc.internal.pageSize.getWidth() - textWidth) / 2; // - LEFT_MARGIN - RIGHT_MARGIN

        if (textOffset > 10) this._doc.text(textOffset, y, text);
        else {
            const lines = this._doc.splitTextToSize(text, PDF_IN_MM - LEFT_MARGIN - RIGHT_MARGIN);
            this._doc.text(LEFT_MARGIN, y, lines);
            lineHeight = 10 * lines.length * 0.5;
        }
        this._doc.setFontStyle('normal');

        return lineHeight;
    }

    async addPage1(screenshotConfig, title) {
        this._doc.addImage(geowebg, 'JPG', 0, 0, 210, 298);
        let y = 50;

        this._doc.setFontStyle('bold');
        this.centeredText(title, y, 24);
        this._doc.setFontSize(10);

        y = 100;
        const qrCodeImage = await screenshotConfig.tool.showQrCode('qrCode');
        var qrImageOffset = (this._doc.internal.pageSize.getWidth() - QR_CODE_SIZE) / 2; // - LEFT_MARGIN - RIGHT_MARGIN
        this._doc.addImage(qrCodeImage, 'PNG', qrImageOffset, y, QR_CODE_SIZE, QR_CODE_SIZE);

        this._doc.line(45, 236, 165, 236);
        y = 240;
        this._doc.setFontStyle('bold');
        this.centeredText(
            'Informe generado por OGV de GeoWE.org el ' + this.getCurrentDate(),
            y,
            11
        );
    }

    addDisclaimer() {
        this._doc.addPage();
        this._doc.setFillColor(FORM_FIELD_COLOR);
        this._doc.rect(LEFT_MARGIN - 1, 18, 190, 48, 'FD');
        const y = 21;
        this._doc.setFontStyle('bold');
        this.centeredText(DISCLAIMER, y, 10);
    }

    async addPage2(screenshotConfig) {
        const base64Image = await screenshotConfig.tool.getScreenshot('png', 'image/png', false);
        this._doc.addPage();
        let y = 20;
        this._doc.setFontStyle('bold');
        this._doc.setFontSize(14);
        this._doc.text(LEFT_MARGIN, y, '1.- REPRESENTACIÓN GRÁFICA');
        y += 5;
        this._doc.addImage(base64Image, 'PNG', 10, y, 190, 210);
    }

    getLayers() {
        const layers = [];
        const currentLayers = this._map.getLayers().getArray();
        for (const layer of currentLayers) {
            if (layer instanceof VectorImageLayer || layer instanceof VectorLayer) {
                layers.push(layer);
            }
        }

        return layers;
    }
}

export default new ReportGeneratorTool();
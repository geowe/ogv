const LEFT_MARGIN = 10;
const PAGE_TITLE = '2.- RESUMEN';
const ID_COLUMN_STYLE = {
    halign: 'left',
    fillColor: [213, 214, 210],
    textColor: [78, 53, 73],
    fontStyle: 'bold',
};

class Page3 {
    addPage(doc, layers) {
        const layerCount = layers.length;
        if (layerCount === 0) return;

        doc.addPage();
        let y = 25;
        doc.setFontStyle('bold');
        doc.setFontSize(14);
        doc.text(LEFT_MARGIN, y, PAGE_TITLE);
        y += 7;

        doc.setFontSize(10);
        doc.setFontStyle('normal');
        doc.text(LEFT_MARGIN, y, 'Orígenes de datos: ' + layers.length);
        y += 7;

        doc.autoTable({
            margin: { top: 40, left: LEFT_MARGIN },
            startY: y,
            tableLineColor: [189, 195, 199],
            tableLineWidth: 0.75,
            headStyles: {
                fillColor: [204, 204, 204],
                textColor: [78, 53, 73],
                lineWidth: 0.2,
            },
            styles: {
                cellWidth: 'wrap',
                font: 'times',
                fontSize: 6,
                lineWidth: 0.2,
                lineColor: 0,
                halign: 'center',
            },
            columnStyles: {
                0: ID_COLUMN_STYLE,
            },
            head: [
                ['Nombre', 'Nº elementos']
            ],
            body: this.getBody(layers),
        });
    }

    getBody(layers) {
        const data = [];

        for (const layer of layers) {
            const layerName = layer.get('name').split('.geojson')[0];
            data.push([layerName, layer.getSource().getFeatures().length]);
        }
        return data;
    }
}

export default new Page3();
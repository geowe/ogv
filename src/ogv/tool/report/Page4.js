const LEFT_MARGIN = 10;

class Page4 {
    addPage(doc, layers) {
        const layerCount = layers.length;
        if (layerCount === 0) return;

        let y = 25;
        let count = 1;
        for (const layer of layers) {
            doc.addPage();
            if (count === 1) {
                doc.setFontStyle('bold');
                doc.setFontSize(14);
                doc.text(LEFT_MARGIN, y, '3.- INFORMACIÓN ALFANUMÉRICA');
                y = 35;
            } else y = 25;

            doc.setFontSize(12);
            doc.setFontStyle('bold');
            const layerName = layer.get('name').split('.geojson')[0];
            doc.text(LEFT_MARGIN, y, `3.${count++} ${layerName.toUpperCase()}`);
            y += 7;

            doc.setFontSize(10);
            doc.setFontStyle('normal');
            doc.text(LEFT_MARGIN, y, 'Detalle de la información asociada al origen de datos');
            y += 5;
            y = y + this.addTable(doc, layer, y);
        }
    }

    addTable(doc, layer, y) {
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

            head: this.getHead(layer),
            body: this.getBody(layer),
        });

        return doc.autoTable.previous.finalY + 15;
    }

    getHead(layer) {
        const head = [];
        const feature = layer.getSource().getFeatures()[0];

        const properties = feature.getProperties();
        const row = [];
        for (const name in properties) {
            if (name !== 'geometry') row.push(name);
        }
        head.push(row);
        return head;
    }

    getBody(layer) {
        const data = [];
        const features = layer.getSource().getFeatures();
        var properties = features[0].getProperties();

        for (const feature of features) {
            const row = [];
            for (const name in properties) {
                if (name !== 'geometry') {
                    let value = feature.get(name);
                    if (name === 'weight') value = parseFloat(value).toFixed(2);
                    row.push(value);
                }
            }
            data.push(row);
        }
        return data;
    }
}

export default new Page4();
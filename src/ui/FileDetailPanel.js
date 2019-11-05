import './html/fileDetailPanel.css';
import html from './html/fileDetailPanel.html';
import { VisualElement } from './VisualElement';

export class FileDetailPanel extends VisualElement {
  constructor (parent) {
    super(parent, html);
    document.getElementById('fileDetailCloseButton').onclick = this.hide.bind(this);
  }

  show (files) {
    const fileTable = document.getElementById('fileTable');

    let totalSize = 0;
    files.forEach((file) => {
      const row = fileTable.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = file.name;
      cell2.innerHTML = file.size;
      totalSize = totalSize + file.size;
    });

    const totalSizeKB = Math.round((totalSize / 1024) * 100) / 100;
    const totalSizeMB = Math.round((totalSizeKB / 1024) * 100) / 100;
    const sizeInfo = `${files.length} fichero/s. ` + (parseInt(totalSizeMB) > 0 ? `<b>${totalSizeMB} MB </b>` : `<b> ${totalSizeKB} KB </b>`);
    document.getElementById('totalSize').innerHTML = sizeInfo;
    super.show();
  }
}

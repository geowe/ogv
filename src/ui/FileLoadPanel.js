import './html/fileLoadPanel.css';
import html from './html/fileLoadPanel.html';
import { VisualElement } from './VisualElement';
import { FileDetailPanel } from './FileDetailPanel';

export class FileLoadPanel extends VisualElement {
  constructor (arg) {
    super(arg.parent, html);

    const fileListButton = document.getElementById('fileListButton');
    const fileDetailPanel = new FileDetailPanel(this._element);
    const acceptButton = document.getElementById('acceptButton');
    acceptButton.disabled = true;
    acceptButton.onclick = () => (arg.onSuccessful === undefined) ? this.hide() : arg.onSuccessful();
    document.getElementById('cancelButton').onclick = () => (arg.onCancel === undefined) ? this.hide() : arg.onCancel();

    document.getElementById('upload').onchange = (evt) => {
      this.files = Array.from(evt.target.files);
      const filesTotal = this.files.length;

      if (filesTotal > 0) {
        acceptButton.disabled = false;
        fileListButton.disabled = false;

        const fileTotalMessage = `${filesTotal} fichero`;
        fileListButton.value = filesTotal > 1 ? fileTotalMessage + 's' : fileTotalMessage;
        fileListButton.onclick = fileDetailPanel.show.bind(fileDetailPanel, this.files);
      } else {
        fileListButton.value = 'Sin ficheros';
        fileListButton.disabled = true;
      }
    };
  }

  getFiles () {
    return this.files;
  }
}

export const ID_ATTRIBUTE = 'id';
export class VisualElement {
  constructor (parent, htmlTemplate) {
    const template = document.createElement('div');
    template.innerHTML = htmlTemplate.trim();

    /**
         * @type {HTMLElement} _element
         */
    this._element = template.firstChild;
    this.hide();
    parent.appendChild(this._element);
  }

  show () {
    this._element.style.display = 'block';
  }

  hide () {
    this._element.style.display = 'none';
  }
}

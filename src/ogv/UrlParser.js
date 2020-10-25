class UrlParser {
    constructor() {
        const parameters = location.search; // .replace('&', '%26');
        this.params =
            location.search !== '' ? new URLSearchParams(parameters) : new URLSearchParams();
    }

    has(attributeName) {
        return this.params.has(attributeName);
    }

    get(attributeName) {
        return this.safeTagsReplace(this.params.get(attributeName));
    }

    safeTagsReplace(str) {
        return str === undefined || str === null ? str : str.replace(/[<>]/g, '');
    }
}

export default new UrlParser();
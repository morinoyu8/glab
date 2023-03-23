marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
})

fetch('./content.md').then(r => { return r.text() }).then(file => {
    document.getElementById('content').innerHTML = marked.parse(file);
});
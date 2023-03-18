fetch('./content.md').then(r => { return r.text() }).then(file => {
    document.getElementById('content').innerHTML = marked.parse(file);
});
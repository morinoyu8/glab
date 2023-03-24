marked.setOptions({
    highlight: function (code, lang) {
        // console.log(lang)
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
})

const renderer = {
    code(code, infostring, escaped) {
        var lang = (infostring || '').match(/\S*/)[0];
        var linenum = -1;

        if (lang.match(/=/)) {
            var info = lang.split('=');
            lang = info[0];
            if (info[1].match(/^[0-9]/))
                linenum = Number(info[1]);
            else
                linenum = 1;
        }

        if (this.options.highlight) {
            const out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return '<pre><code>'
            + code // (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        if (linenum < 0) {
            return '<pre><code class="'
            + this.options.langPrefix
            + lang // escape(lang)
            + '">'
            + code // (escaped ? code : escape(code, true))
            + '</code></pre>\n';
        }

        const num = code.match(/\r\n|\n/g).length;
        var strLinenum = String(linenum);
        for (let i = 1; i < num; i++) {
            console.log(strLinenum);
            strLinenum = strLinenum + '\n' + (linenum + i);
        }

        return '<pre><div class="code-linenum"><code>'
        + strLinenum
        + '</code></div><code class="'
        + this.options.langPrefix
        + lang // escape(lang)
        + ' code-linenum-main">'
        + code // (escaped ? code : escape(code, true))
        + '</code></pre>\n';
    }
};
marked.use({ renderer });

fetch('./content.md').then(r => { return r.text() }).then(file => {
    document.getElementById('content').innerHTML = marked.parse(file);
});
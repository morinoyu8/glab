marked.setOptions({
    highlight: function (code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
})

const renderer = {
    code(code, infostring, escaped) {
        var lang = (infostring || '').match(/\S*/)[0];
        var linenum = -1;
        var diffLang = false; 

        if (lang.match(/=/)) {
            const info = lang.split('=');
            lang = info[0];
            if (info[1].match(/^[0-9]/))
                linenum = Number(info[1]);
            else
                linenum = 1;
        }

        if (lang.match(/diff_/)) {
            const info = lang.split('_');
            lang = info[1];
            diffLang = true
        }

        if (this.options.highlight) {
            const out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        code = code.replace(/\n$/, '') + '\n';
        if (linenum >= 0) {
            /* add line number */
            const num = code.match(/\r\n|\n/g).length;
            var strLinenum = String(linenum);
            for (let i = 1; i < num; i++) {
                strLinenum = strLinenum + '\n' + (linenum + i);
            }
        }

        if (diffLang) {
            code = code.replace(/\n\+(.*)/g, '<div class="hljs-addition">+$1\n</div>');
            code = code.replace(/\n\-(.*)/g, '<div class="hljs-deletion">-$1\n</div>');
            code = code.replace(/\<\/div\>\n/g, '</div>');
        }

        code = code.replace(/\n(.*)\<span class=\"hljs-comment\"\>.*\@\@\((.*)\)\@\@.*\<\/span\>\n/g, '<div style="min-width:inherit;$2">$1</div>');

        if (!lang) {
            return '<div class="code-block"><pre class="code-linenum-main"><code>'
            + code // (escaped ? code : escape(code, true))
            + '</code></pre></div>\n';
        }

        if (linenum < 0) {
            return '<div class="code-block"><pre class="code-linenum-main"><code class="'
            + this.options.langPrefix
            + lang // escape(lang)
            + '">'
            + code // (escaped ? code : escape(code, true))
            + '</code></pre></div>\n';
        }

        return '<div class="code-block"><pre class="code-linenum"><code>'
        + strLinenum
        + '</code></pre><pre class="code-linenum-main"><code class="'
        + this.options.langPrefix
        + lang // escape(lang)
        + '">'
        + code // (escaped ? code : escape(code, true))
        + '</code></pre></div>\n';
    },

    text(text) {
        if (text.match(/\_c/)) {
            // console.log(text);
        }
        if (text === '{') {
            text = '\\{';
        } else if (text === '}') {
            text = '\\}';
        } else if (text === '(') {
            text = '\\(';
        } else if (text === ')') {
            text = '\\)';
        } else if (text === '\\') {
            text = '\\\\';
        } else if (text === '\_') {
            //console.log(text);
            text = '\\_';
        }
        return text;
    }
};
marked.use({ renderer });

fetch('./content.md').then(r => { return r.text() }).then(file => {
    $('#content').html(marked.parse(file));
    var x = Math.random(1)
    MathJax.Hub.Typeset()
});
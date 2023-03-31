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

        if (lang.match(/diff/)) {
            const info = lang.split('_');
            if (info.length == 1)
                lang = '';
            else
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

        if (linenum < 0) {
            if (!lang) {
                return '<div class="code-block"><pre class="code-linenum-main"><code>'
                + code // (escaped ? code : escape(code, true))
                + '</code></pre></div>\n';
            }

            return '<div class="code-block"><pre class="code-linenum-main"><code class="'
            + this.options.langPrefix
            + lang // escape(lang)
            + '">'
            + code // (escaped ? code : escape(code, true))
            + '</code></pre></div>\n';
        }

        if (!lang) {
            return '<div class="code-block"><pre class="code-linenum"><code>'
            + strLinenum
            + '</code></pre><pre class="code-linenum-main"><code>'
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
            text = '\\_';
        }
        return text;
    },

    listitem(text) {
        if (text.match(/\<p\>/)) {
            return `<li>${text}</li>\n`;
        }
        text = text.replace(/\<li\>[^(\<p\>)](.*)\<\/li\>/g, '<li><p>$2</p></li>');
        return `<li><p>${text}</p></li>\n`;
    },

    html(html) {
        html = html.replace(/\<summary\>(.*)\<\/summary\>/g, '<summary><p style="display: inline;">$1</p></summary>');
        return html;
    }
};
marked.use({ renderer });

MathJax.Hub.Config({
    loader: {load: ['[tex]/braket']},
    tex: {packages: {'[+]': ['braket']}}
});

fetch('./content.md').then(r => { return r.text() }).then(file => {
    $('#content').html(marked.parse(file));

    const mainMaxWidth = 800.0;
    for (let i = 5; i <= 100; i += 5) {
        $('.img-' + i).css('width', Math.min(100, (mainMaxWidth / $('main').width()) * i) + '%');
    }

    $(window).resize(function() {
        for (let i = 5; i <= 100; i += 5) {
            $('.img-' + i).css('width', Math.min(100, (mainMaxWidth / $('main').width()) * i) + '%');
        }
    });

    MathJax.Hub.Typeset(null, function() {
        MathJax.Hub.Config({
            tex2jax: { inlineMath: [['$','$'], ['\\(','\\)']] },
            CommonHTML: { linebreaks: { automatic: true } },
            "HTML-CSS": { linebreaks: { automatic: true } },
                   SVG: { linebreaks: { automatic: true } }
        });
        MathJax.Hub.Typeset(null, function() {
            $('.mjx-full-width').css({'cssText': 'display: initial !important; font-size: 119% !important'});
        });
    });
});


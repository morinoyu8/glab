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

        code = code.replace(/\n(.*)\<span class=\"hljs-comment\"\>(.*)\@\@\((.*)\)\@\@.*\<\/span\>\n/g, '<div style="min-width:inherit;$3">$1<span class="hljs-comment">$2</span></div>');

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
        // if (text.match(/\<p\>/)) {
        //     return `<li>${text}</li>\n`;
        // }
        text = text.replace(/\<li\>[^(\<p\>)](.*)\<\/li\>/g, '<li><p>$2</p></li>');
        return `<li><p>${text}</p></li>\n`;
    },

    html(html) {
        html = html.replace(/\<summary\>(.*)\<\/summary\>/g, '<summary><p style="display: inline;">$1</p></summary>');
        return html;
    },

    table(header, body) {
        if (body) 
            body = `<tbody>${body}</tbody>`;
    
        return '<div class="table-outer"><table cellspacing="0">\n'
          + '<thead>\n'
          + header
          + '</thead>\n'
          + body
          + '</table></div>\n';
    },

    tablecell(content, flags) {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
          ? `<${type} align="${flags.align}">`
          : `<${type}>`;
        return tag + '<p>' + content + `</p></${type}>\n`;
      }

};
marked.use({ renderer });

MathJax.Hub.Config({
    loader: {load: ['[tex]/braket']},
    tex: {packages: {'[+]': ['braket']}}
});

fetch('./content.md').then(r => { return r.text() }).then(file => {
    $('#content').html(parseExtension(marked.parse(file)));
    imageSizeSetting();

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

function parseExtension(html) {
    return html;
}

// function parseExtension(html) {
//     html = parseTab(html);
//     return html;
// }

// function parseTab(html) {
//     // remove p tag
//     html = html.replace(/\<p\>\@\@/g, '@@');
//     html = html.replace(/\@\@\<\/p\>/g, '@@');
//     // add div of tab class
//     html = html.replace(/\@\@\@\(tab,\s?(.*?)\)\@\@\@/g, '<div class="tab" id="$1"><div class="tab-nav"></div><div class="tab-main">');
//     const tab = html.match(/\@\@\((.*?),\s?(.*?)\)\@\@/g);
//     console.log(tab);
//     html = html.replace(/\@\@\((.*?),\s?(.*?)\)\@\@/g, '<div id="main-$2">');
//     html = html.replace(/\@\@\@\(\/\)\@\@\@/g, '</div></div>');
//     html = html.replace(/\@\@\(\/\)\@\@/g, '</div>');
//     return html;
// }

function imageSizeSetting() {
    const mainMaxWidth = 800.0;
    for (let i = 5; i <= 100; i += 5) {
        $('.img-' + i).css('width', Math.min(100, (mainMaxWidth / $('main').width()) * i) + '%');
    }

    $(window).resize(function() {
        for (let i = 5; i <= 100; i += 5) {
            $('.img-' + i).css('width', Math.min(100, (mainMaxWidth / $('main').width()) * i) + '%');
        }
    });
}
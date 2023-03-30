var urlHeader = ''
if (location.href.indexOf('https://morinoyu8.github.io') >= 0) {
    urlHeader = '/glab';
}

var style = [urlHeader + '/style/main.css', 
             urlHeader + '/style/highlight.css',
             urlHeader + '/style/header.css',
             urlHeader + '/style/footer.css',
             urlHeader + '/style/mainpage.css',
             urlHeader + '/style/code.css',
             urlHeader + '/style/math.css',
             urlHeader + '/style/image.css'];

for (var i in style) {
    $('<link>').attr({
        'rel': 'stylesheet',
        'type': 'text/css',
        'href': style[i]
    }).appendTo('head');
}

$(document).ready(function() {
    $('body').prepend('<main>')
    $('<div>').attr({
        'class': 'main-item',
        'style': 'display: none'
    }).appendTo('main');
    $('<div>').attr({
        'class': 'item-inner'
    }).appendTo('.main-item');
    $('<div>').attr({
        'id': 'content'
    }).appendTo('.item-inner');
    $('main').before($('<div>').attr({
        'id': 'header'
    }));
    $('main').after($('<div>').attr({
        'id': 'footer',
        'style': 'display: none'
    }));
    $('<script>').attr({
        'type': 'text/javascript',
        'src': urlHeader + '/js/template.js',
    }).appendTo('body');
});

$(document).on('load', function() {
    console.log('hello');
})

var headSrc = ['https://cdn.jsdelivr.net/npm/marked/marked.min.js',
               'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML',
               'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js',
               'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/languages/c.min.js',
               'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/languages/python.min.js',
               urlHeader + '/js/mathjax-config.js'];

var e_time = new Date(); 
loadHeadSrc(0);

function loadHeadSrc(i) {
    $.getScript(headSrc[i], function() {
        if (i + 1 < headSrc.length) {
            loadHeadSrc(i + 1);
        } else {
            $.getScript(urlHeader + '/js/markdown-to-html.js', function() { 
                $('#footer').attr({
                    'style': 'display: block;'
                });
                $('.main-item').attr({
                    'style': 'display: block;'
                });
            });
        }
    })
}
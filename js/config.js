var urlHeader = ''
if (location.href.indexOf('https://morinoyu8.github.io') >= 0) {
    urlHeader = '/glab';
}

$(document).ready(function() {
    var style = [urlHeader + '/style/style.css', 
                 urlHeader + '/style/highlight.css'];

    var headSrc = ['https://cdn.jsdelivr.net/npm/marked/marked.min.js',
                   'https://polyfill.io/v3/polyfill.min.js?features=es6',
                   'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
                   'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/highlight.min.js',
                   'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/languages/c.min.js',
                   urlHeader + '/js/mathjax-config.js'];

    var bodySrc = [urlHeader + '/js/markdown-to-html.js',
                   urlHeader + '/js/template.js'];
    
    for (var i in style) {
        $('<link>').attr({
            'rel': 'stylesheet',
            'type': 'text/css',
            'href': style[i]
        }).appendTo('head');
    }

    for (var i in headSrc) {
        $('<script>').attr({
            'type': 'text/javascript',
            'src': headSrc[i]
        }).appendTo('head');
    }

    $('<meta>').attr({
        'name': 'viewport',
        'content': 'width=device-width'
    }).appendTo('head');

    $('body').prepend('<main>');
    $('<div>').attr({
        'class': 'main-item'
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
        'id': 'footer'
    }));
    // $('body').prepend('<p>$x$</p>');

    $('#footer').ready(function() {
        for (var i in bodySrc) {
            $('<script>').attr({
                'type': 'text/javascript',
                'src': bodySrc[i]
            }).appendTo('body');
        }
    })
});
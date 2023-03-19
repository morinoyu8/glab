var urlHeader = ''
if (location.href.indexOf('https://morinoyu8.github.io') >= 0) {
    urlHeader = '/glab';
}

$(document).ready(function() {
    $('<link>').attr({
        'rel': 'stylesheet',
        'type': 'text/css',
        'href': urlHeader + '/style/style.css'
    }).appendTo('head');

    var headSrc = ['https://cdn.jsdelivr.net/npm/marked/marked.min.js'];

    var bodySrc = [urlHeader + '/js/markdown-to-html.js',
                   urlHeader + '/js/template.js'];
    
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

    $('#footer').ready(function() {
        for (var i in bodySrc) {
            $('<script>').attr({
                'type': 'text/javascript',
                'src': bodySrc[i]
            }).appendTo('body');
        }
    })
});
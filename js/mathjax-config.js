// MathJax = {
//     loader: {load: ['ui/lazy']},
//     options: {
//         lazyMargin: '200px'
//     },
//     tex: {
//       inlineMath: [['$', '$'], ['\\(', '\\)']],
//       displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
//       processEscapes: true
//     },
//     chtml: {
//         displayIndent: '1em',
//         lineBreaks: { automatic: true }
//     }
// };

MathJax.Hub.Config({
    tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
    CommonHTML: { linebreaks: { automatic: true } },
    "HTML-CSS": { linebreaks: { automatic: true } },
           SVG: { linebreaks: { automatic: true } }
});

var timer = false;
var resize = false;
var firstWidth = 0;
$(window).resize(function() {
    if (resize === false) {
        firstWidth = $(window).width();
    }
    resize = true;
    if (timer !== false) {
        clearTimeout(timer);
    }
    timer = setTimeout(function() {
        if (Math.abs($(window).width() - firstWidth) > 100) {
            console.log('resize');
            MathJax.Hub.Typeset();
        }
        resize = false;
    }, 200);
});
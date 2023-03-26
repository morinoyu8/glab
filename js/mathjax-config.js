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
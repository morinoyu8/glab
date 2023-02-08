function header() {
    $.ajax({
        url: "_header.html",
        cache: false,
        success: function(html){
            document.write(html);
        }
    });
}

function footer() {
    $.ajax({
        url: "../view/_footer.html",
        cache: false,
        success: function(html){
            document.write(html);
        }
    });
}
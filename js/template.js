function header() {
    $.ajax({
        url: "../view/_header.html",
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
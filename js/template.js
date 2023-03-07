function header() {
    $.ajax({
        url: "./header.html",
        cache: false,
        success: function(html){
            document.write(html);
        }
    });
}

function footer() {
    $.ajax({
        url: "./footer.html",
        cache: false,
        success: function(html){
            document.write(html);
        }
    });
}
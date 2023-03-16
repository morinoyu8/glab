var urlHeader = ""
if (location.href.indexOf("https://morinoyu8.github.io") >= 0) {
    urlHeader = "/glab";
}

$("#header").load(urlHeader + "/templete/header.html", function() {
    $("#title").attr("href", urlHeader + "/");
    $("#header-jc").attr("href", urlHeader + "/#jc");
    $("#header-it").attr("href", urlHeader + "/#it");
    $("#header-pr").attr("href", urlHeader + "/#pr");
    $("#header-lt").attr("href", urlHeader + "/#lt");
    $("#jc-nav").load(urlHeader + "/main/journal-club.html");
    $("#it-nav").load(urlHeader + "/main/intro-thesis.html");
    $("#pr-nav").load(urlHeader + "/main/progress-report.html");
    $("#lt-nav").load(urlHeader + "/main/lt.html");
    $("#header-jc").hover(
        function() {
            $(".jc-nav").css("display", "block");
            $(".it-nav").css("display", "none");
            $(".pr-nav").css("display", "none");
            $(".lt-nav").css("display", "none");
        },
        function() {}
    );
    $("#header-it").hover(
        function() {
            $(".jc-nav").css("display", "none");
            $(".it-nav").css("display", "block");
            $(".pr-nav").css("display", "none");
            $(".lt-nav").css("display", "none");
        },
        function() {}
    );
    $("#header-pr").hover(
        function() {
            $(".jc-nav").css("display", "none");
            $(".it-nav").css("display", "none");
            $(".pr-nav").css("display", "block");
            $(".lt-nav").css("display", "none");
        },
        function() {}
    );
    $("#header-lt").hover(
        function() {
            $(".jc-nav").css("display", "none");
            $(".it-nav").css("display", "none");
            $(".pr-nav").css("display", "none");
            $(".lt-nav").css("display", "block");
        },
        function() {}
    );
    $("#title").hover(
        function() {
            $(".jc-nav").css("display", "none");
            $(".it-nav").css("display", "none");
            $(".pr-nav").css("display", "none");
            $(".lt-nav").css("display", "none");
        },
        function() {}
    );
    $("#header").hover(
        function() {},
        function() {
            $(".jc-nav").css("display", "none");
            $(".it-nav").css("display", "none");
            $(".pr-nav").css("display", "none");
            $(".lt-nav").css("display", "none");
        }
    );
});
$("#footer").load(urlHeader + "/templete/footer.html");
$("#jc").load(urlHeader + "/main/journal-club.html");
$("#it").load(urlHeader + "/main/intro-thesis.html");
$("#pr").load(urlHeader + "/main/progress-report.html");
$("#lt").load(urlHeader + "/main/lt.html");
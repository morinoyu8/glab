var urlHeader = ""
if (location.href.indexOf("https://morinoyu8.github.io") >= 0) {
    urlHeader = "/glab";
}
var clickEventType = (( window.ontouchstart!==null ) ? "click":"touchend");

$("#header").load(urlHeader + "/templete/header.html", 
    function() {
        $("#title").attr("href", urlHeader + "/");
        $(".jc").load(urlHeader + "/lists/journal-club.html");
        $(".it").load(urlHeader + "/lists/intro-thesis.html");
        $(".pr").load(urlHeader + "/lists/progress-report.html");
        $(".lt").load(urlHeader + "/lists/lt.html");
        $("#header-jc").attr("href", urlHeader + "/#jc");
        $("#header-it").attr("href", urlHeader + "/#it");
        $("#header-pr").attr("href", urlHeader + "/#pr");
        $("#header-lt").attr("href", urlHeader + "/#lt");
        $("#header-jc").hover(
            function() {
                setNavDisplay(1);
            },
            function() {}
        );
        $("#header-it").hover(
            function() {
                setNavDisplay(2);
            },
            function() {}
        );
        $("#header-pr").hover(
            function() {
                setNavDisplay(3);
            },
            function() {}
        );
        $("#header-lt").hover(
            function() {
                setNavDisplay(4);
            },
            function() {}
        );
        $("#title").hover(
            function() {
                setNavDisplay(0);
            },
            function() {}
        );
        $("#header").hover(
            function() {},
            function() {
                setNavDisplay(0);
            }
        );
    }
);
$("#footer").load(urlHeader + "/templete/footer.html", 
    function() {
        $("#footer-title").attr("href", urlHeader + "/");
        setFooterPosition();
        $(document).on(clickEventType, ".hamburger",
            function() {
                setHamburgerNav();
            }
        );
        $(document).on(clickEventType, ".hamburger-close",
            function() {
                resetStyle();
                setFooterPosition()
                window.scrollTo(0, 0);
            }
        );
        $(window).resize(
            function() {
                if (window.innerWidth > 720) {
                    resetStyle();
                }
                setFooterPosition()
            }
        );
    }
);

function setNavDisplay(id) {
    if (id == 1) {
        $(".jc-nav").css("display", "block");
        $(".it-nav").css("display", "none");
        $(".pr-nav").css("display", "none");
        $(".lt-nav").css("display", "none");
    } else if (id == 2) {
        $(".jc-nav").css("display", "none");
        $(".it-nav").css("display", "block");
        $(".pr-nav").css("display", "none");
        $(".lt-nav").css("display", "none");
    } else if (id == 3) {
        $(".jc-nav").css("display", "none");
        $(".it-nav").css("display", "none");
        $(".pr-nav").css("display", "block");
        $(".lt-nav").css("display", "none");
    } else if (id == 4) {
        $(".jc-nav").css("display", "none");
        $(".it-nav").css("display", "none");
        $(".pr-nav").css("display", "none");
        $(".lt-nav").css("display", "block");
    } else {
        $(".jc-nav").css("display", "none");
        $(".it-nav").css("display", "none");
        $(".pr-nav").css("display", "none");
        $(".lt-nav").css("display", "none");
    }
}

function resetStyle() {
    $("main").removeAttr("style");
    $(".hamburger-nav").removeAttr("style");
    $(".hamburger-close").removeAttr("style");
    $(".hamburger").removeAttr("style");
    $("footer").removeAttr("style");
}

function setHamburgerNav() {
    $("main").css("display", "none");
    $(".hamburger-nav").css("display", "block");
    $(".hamburger-close").css("display", "block");
    $(".hamburger").css("display", "none");
    $("footer").removeAttr("style");
    $("footer").css("margin-top", $("#hamburger-nav").innerHeight() + "px");
}

function setFooterPosition() {
    if (window.innerHeight > $("header").innerHeight() + $("main").outerHeight(true) + $("footer").innerHeight()) {
        $("footer").css("position", "fixed");
        $("footer").css("top", (window.innerHeight - $("footer").outerHeight()) + "px");
        $("footer").css("width", "100%");
        $("footer").css("height", "66px");
    }
}
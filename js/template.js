var urlHeader = ""
if (location.href.indexOf("https://morinoyu8.github.io") >= 0) {
    urlHeader = "/glab";
}
var clickEventType = (( window.ontouchstart!==null ) ? "click":"touchend");

$("#header").load(urlHeader + "/templete/header.html", 
    function() {
        $("#title").attr("href", urlHeader + "/");
        $(".jc").load(urlHeader + "/lists/journal-club.html",
            function() {
                setJCHref();
            }
        );
        $(".it").load(urlHeader + "/lists/intro-thesis.html",
            function() {
                setITHref();
            }
        );
        $(".pr").load(urlHeader + "/lists/progress-report.html",
            function() {
                setPRHref();
            }
        );
        $(".lt").load(urlHeader + "/lists/lt.html",
            function() {
                setLTHref();
            }
        );
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
                setFooterPosition();
                window.scrollTo(0, 0);
            }
        );
        $(window).resize(
            function() {
                if (window.innerWidth > 720) {
                    resetStyle();
                }
                setFooterPosition();
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
    $("main").css("min-height", (window.innerHeight - $("header").outerHeight() - $("footer").outerHeight() - 70) + "px");
}

function setJCHref() {
    // journal-club
    $(".jc-isa-5").attr("href", urlHeader + "/test");
    $(".jc-isa-3a").attr("href", urlHeader + "/markdown-test");
    $(".jc-pba-13b").attr("href", urlHeader + "/");
    $(".jc-pba-11").attr("href", urlHeader + "/");
}

function setITHref() {
    // intro-thesis
    $(".it-saver").attr("href", urlHeader + "/");
}

function setPRHref() {
    // progress-report
    $(".pr-2023-01-23").attr("href", urlHeader + "/");
    $(".pr-2023-01-12").attr("href", urlHeader + "/");
    $(".pr-2022-12-26").attr("href", urlHeader + "/");
    $(".pr-2022-12-19").attr("href", urlHeader + "/");
    $(".pr-2022-12-12").attr("href", urlHeader + "/");
    $(".pr-2022-12-05").attr("href", urlHeader + "/");
    $(".pr-2022-11-28").attr("href", urlHeader + "/");
    $(".pr-2022-11-06").attr("href", urlHeader + "/");
    $(".pr-2022-10-24").attr("href", urlHeader + "/");
    $(".pr-2022-10-17").attr("href", urlHeader + "/");
}

function setLTHref() {
    // LT
    $(".lt-2022-7").attr("href", urlHeader + "/");
    $(".lt-2022-6").attr("href", urlHeader + "/");
    $(".lt-2022-5").attr("href", urlHeader + "/");
    $(".lt-2022-4").attr("href", urlHeader + "/");
    $(".lt-2022-3").attr("href", urlHeader + "/");
    $(".lt-2022-2").attr("href", urlHeader + "/");
    $(".lt-2022-1").attr("href", urlHeader + "/");
}
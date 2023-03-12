if (location.href.indexOf("https://morinoyu8.github.io") < 0) {
    $("#header").load("/templete/header.html");
    $("#footer").load("/templete/footer.html");
    $("#jc").load("/main/journal-club.html");
    $("#it").load("/main/intro-thesis.html");
    $("#pr").load("/main/progress-report.html");
    $("#lt").load("/main/lt.html");
} else {
    $("#header").load("/glab/templete/header.html");
    $("#footer").load("/glab/templete/footer.html");
    $("#jc").load("/glab/main/journal-club.html");
    $("#it").load("/glab/main/intro-thesis.html");
    $("#pr").load("/glab/main/progress-report.html");
    $("#lt").load("/glab/main/lt.html");
}
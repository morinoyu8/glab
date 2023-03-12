var urlHeader = ""
if (location.href.indexOf("https://morinoyu8.github.io") >= 0) {
    urlHeader = "/glab";
}

$("#header").load(urlHeader + "/templete/header.html", function() {
    var title = document.getElementById("title");
    title.href = urlHeader + "/";
});
$("#footer").load(urlHeader + "/templete/footer.html");
$("#jc").load(urlHeader + "/main/journal-club.html");
$("#it").load(urlHeader + "/main/intro-thesis.html");
$("#pr").load(urlHeader + "/main/progress-report.html");
$("#lt").load(urlHeader + "/main/lt.html");
(function () {
  var script = document.currentScript;
  if (!script) return;
  var spaceId = script.getAttribute("data-space");
  if (!spaceId) return;

  var origin = new URL(script.src).origin;
  var iframe = document.createElement("iframe");
  var lang = script.getAttribute("data-lang");
  var query = [];
  if (script.getAttribute("data-theme") === "dark") query.push("theme=dark");
  if (lang === "fr" || lang === "ar") query.push("lang=" + lang);
  iframe.src = origin + "/widget/" + encodeURIComponent(spaceId) + (query.length ? "?" + query.join("&") : "");
  iframe.title = "Testimonials";
  iframe.loading = "lazy";
  iframe.style.cssText = "width:100%;border:0;display:block;min-height:200px;";
  script.parentNode.insertBefore(iframe, script);

  window.addEventListener("message", function (event) {
    if (event.origin !== origin) return;
    var data = event.data;
    if (data && data.wallify === "height" && data.spaceId === spaceId) {
      iframe.style.height = data.height + "px";
    }
  });
})();

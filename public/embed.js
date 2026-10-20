(function () {
  var script = document.currentScript;
  if (!script) return;
  var spaceId = script.getAttribute("data-space");
  if (!spaceId) return;

  var origin = new URL(script.src).origin;
  var iframe = document.createElement("iframe");
  iframe.src = origin + "/widget/" + encodeURIComponent(spaceId);
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

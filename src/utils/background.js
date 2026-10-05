// Build a wavy contour line at a given baseline y, spanning the full
// svg width with a bit of overflow on each side.
function buildWavePath(y, amplitude, phase) {
  var width = 1440;
  var segments = 4;
  var segmentWidth = (width + 100) / segments;
  var d = "M-50," + (y + Math.sin(phase) * amplitude).toFixed(1);
  for (var s = 0; s < segments; s++) {
    var x1 = -50 + segmentWidth * (s + 0.33);
    var x2 = -50 + segmentWidth * (s + 0.66);
    var xEnd = -50 + segmentWidth * (s + 1);
    var y1 = y + Math.sin(phase + s * 1.3) * amplitude;
    var y2 = y + Math.sin(phase + s * 1.3 + 1.5) * amplitude;
    var yEnd = y + Math.sin(phase + (s + 1) * 1.3) * amplitude;
    d += " C" + x1.toFixed(1) + "," + y1.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1) + " " + xEnd.toFixed(1) + "," + yEnd.toFixed(1);
  }
  return d;
}

// Height of the page's in-flow content. Deliberately not
// documentElement.scrollHeight: that includes these absolutely positioned
// layers themselves, so once sized they could never shrink again (e.g. after
// content-visibility sections settle below their estimated size), leaving
// an empty band under the last section.
export function contentHeight() {
  return Math.max(document.body.offsetHeight, window.innerHeight);
}

// Contour lines span the whole document, not just one viewport, so
// scrolling reveals genuinely different lines instead of a fixed image
// being shifted around. Rebuilt on load and on resize.
export function buildContours(contoursEl, contoursSvg) {
  if (!contoursEl || !contoursSvg) return;
  var pageHeight = contentHeight();
  contoursEl.style.height = pageHeight + "px";
  contoursSvg.setAttribute("viewBox", "0 0 1440 " + pageHeight);

  var spacing = 260;
  var count = Math.ceil(pageHeight / spacing) + 1;
  var frag = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var y = i * spacing + spacing / 2;
    var amplitude = 40 + (i % 3) * 20;
    var phase = i * 1.7;
    var d = buildWavePath(y, amplitude, phase);
    var duration = 20 + (i % 5) * 3 + "s";
    var delay = "-" + (i % 7) * 4 + "s";
    var lineOpacity = (0.08 + (i % 4) * 0.015).toFixed(3);

    // Glow duplicate first, so the crisp line renders on top of it.
    var glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
    glow.setAttribute("class", "contour-glow");
    glow.setAttribute("d", d);
    glow.style.animationDuration = duration;
    glow.style.animationDelay = delay;
    frag.appendChild(glow);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "contour-line");
    path.setAttribute("d", d);
    path.style.opacity = lineOpacity;
    path.style.animationDuration = duration;
    path.style.animationDelay = delay;
    frag.appendChild(path);
  }

  contoursSvg.textContent = "";
  contoursSvg.appendChild(frag);
}

// A handful of large, softly blurred glow blobs spread down the full
// page (not just the hero), alternating sides so they sit between the
// contour lines rather than behind the text column. Each idles with
// its own slow drift via CSS; their brightness is driven purely by the
// --glow-strength custom property set by the scroll effect, so no
// per-frame JS work is needed here after they're placed.
export function buildGlows(glowEl) {
  if (!glowEl) return;
  var pageHeight = contentHeight();
  glowEl.style.height = pageHeight + "px";

  var spacing = 1000;
  var count = Math.max(Math.ceil(pageHeight / spacing), 3);
  var frag = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    var y = ((i + 0.5) * pageHeight) / count;
    var side = i % 2 === 0 ? 14 + (i % 3) * 5 : 80 - (i % 3) * 5;
    var blob = document.createElement("div");
    blob.className = "glow-blob";
    blob.style.top = y.toFixed(0) + "px";
    blob.style.left = side + "%";
    blob.style.animationDuration = 26 + (i % 4) * 6 + "s";
    blob.style.animationDelay = "-" + (i % 5) * 5 + "s";
    frag.appendChild(blob);
  }

  glowEl.textContent = "";
  glowEl.appendChild(frag);
}

export function buildBackground(contoursEl, contoursSvg, glowEl) {
  buildContours(contoursEl, contoursSvg);
  buildGlows(glowEl);
}

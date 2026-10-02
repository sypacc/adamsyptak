(function () {
  'use strict';

  var links = document.querySelectorAll('.site-nav a[data-nav-link]');
  if (!links.length) return;

  var sections = [];
  links.forEach(function (link) {
    var id = link.getAttribute('data-nav-link');
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  function setActive(id) {
    links.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('data-nav-link') === id);
    });
  }

  if ('IntersectionObserver' in window) {
    var current = sections[0] ? sections[0].id : null;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var match = sections.filter(function (s) { return s.el === entry.target; })[0];
          if (match) {
            current = match.id;
            setActive(current);
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s.el); });
    setActive(current);
  }
})();

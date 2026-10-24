(function () {
  function target() {
    var path = window.location.pathname;
    var isEn = path.indexOf('/en/') !== -1;
    var href;
    if (isEn) {
      href = path.replace('/en/', '/');
    } else {
      var m = path.match(/^(\/[^/]+\/)/);
      href = m ? path.replace(m[1], m[1] + 'en/') : '/en/';
    }
    return { href: href, isEn: isEn };
  }

  var t = target();
  var a = document.createElement('a');
  a.id = 'lang-switch';
  a.href = t.href;
  a.setAttribute('aria-label', t.isEn ? '切换到中文版' : 'Switch to English');
  a.setAttribute('title', t.isEn ? '切换到中文版' : 'Switch to English');
  a.textContent = t.isEn ? '中文' : 'EN';
  document.body.appendChild(a);
})();

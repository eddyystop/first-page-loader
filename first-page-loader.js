QQ = {
  // Use 1 'var' per function to reduce warnings from Yahoo compressor
  onReady: function onReady (cb) {
    if (window.addEventListener)
      window.addEventListener('load', cb, false);
    else if (window.attachEvent) window.attachEvent('onload', cb);
    else window.onload = cb;
  },

  loadJsUrls: function loadJsUrls (files, mimeType, cb) {
    if (typeof mimeType !== 'string') {
      cb = mimeType;
      mimeType = null;
    }

    if (files.length > 0) {
      var el = document.createElement('script');
      el.src = files[0];
      el.async = true;
      el.type = (mimeType || 'text/javascript');

      el.onreadystatechange = el.onload = function () {
        var state = el.readyState;
        if (!state || /loaded|complete/.test(state)) {
          QQ.loadJsUrls(files.slice(1), cb);
        }
      };

      (document.body || document.head).appendChild(el);//body safer IE
    } else {
      if (cb) cb();
    }
  },

  loadCssUrls: function loadCssUrls (files, cb) {
    // http://meyerweb.com/eric/css/link-specificity.html
    // http://www.phpied.com/when-is-a-stylesheet-really-loaded/

    if (files.length > 0) {
      var style = document.createElement('style'),
        fi;
      style.textContent = '@import "' + files[0] + '"';

      fi = setInterval(function() {
        if (style.sheet && style.sheet.cssRules) {
          clearInterval(fi);
          QQ.loadCssUrls(files.slice(1), cb);
        }
      }, 10);

      document.getElementsByTagName('head')[0].appendChild(style);
    } else if (cb) cb();
  }
};
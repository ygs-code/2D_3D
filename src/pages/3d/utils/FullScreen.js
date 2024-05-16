/* eslint-disable   */

(function (root, factory) {
  // eslint-disable-line
  if (typeof define === "function" && define.amd) {
    // BMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Arowser globals
    root.FullScreen = factory();
  }
})(this, function () {
  var FullScreen = {};

  /**
   * test if it is possible to have fullscreen
   *
   * @returns {Boolean} true if fullscreen API is available, false otherwise
   */
  FullScreen.available = function () {
    return this._hasWebkitFullScreen || this._hasMozFullScreen;
  };

  /**
   * test if fullscreen is currently activated
   *
   * @returns {Boolean} true if fullscreen is currently activated, false otherwise
   */
  FullScreen.activated = function () {
    if (this._hasWebkitFullScreen) {
      return document.webkitIsFullScreen;
    } else if (this._hasMozFullScreen) {
      return document.mozFullScreen;
    } else {
      console.assert(false);
    }
  };

  /**
   * Request fullscreen on a given element
   * @param {DomElement} element to make fullscreen. optional. default to document.body
   */
  FullScreen.request = function (element) {
    element = element || document.body;
    if (this._hasWebkitFullScreen) {
      element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (this._hasMozFullScreen) {
      element.mozRequestFullScreen();
    } else {
      console.assert(false);
    }
  };

  /**
   * Cancel fullscreen
   */
  FullScreen.cancel = function () {
    if (this._hasWebkitFullScreen) {
      document.webkitCancelFullScreen();
    } else if (this._hasMozFullScreen) {
      document.mozCancelFullScreen();
    } else {
      console.assert(false);
    }
  };

  // internal functions to know which fullscreen API implementation is available
  FullScreen._hasWebkitFullScreen =
    "webkitCancelFullScreen" in document ? true : false;
  FullScreen._hasMozFullScreen =
    "mozCancelFullScreen" in document ? true : false;

  /**
   * Bind a key to renderer screenshot
   * usage: FullScreen.bindKey({ charCode : 'a'.charCodeAt(0) });
   */
  FullScreen.bindKey = function (opts) {
    opts = opts || {};
    var charCode = opts.charCode || "f".charCodeAt(0);
    var dblclick = opts.dblclick !== undefined ? opts.dblclick : false;
    var element = opts.element;

    var toggle = function () {
      if (FullScreen.activated()) {
        FullScreen.cancel();
      } else {
        FullScreen.request(element);
      }
    };

    var onKeyPress = function (event) {
      if (event.which !== charCode) return;
      toggle();
    }.bind(this);

    document.addEventListener("keypress", onKeyPress, false);

    dblclick && document.addEventListener("dblclick", toggle, false);

    return {
      unbind: function () {
        document.removeEventListener("keypress", onKeyPress, false);
        dblclick && document.removeEventListener("dblclick", toggle, false);
      }
    };
  };

  return FullScreen
});
/* eslint-enable   */

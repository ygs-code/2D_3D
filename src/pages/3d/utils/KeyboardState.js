/**
 * @author Lee Stemkoski
 *
 * Usage:
 * (1) create a global variable:
 *      var keyboard = new KeyboardState();
 * (2) during main loop:
 *       keyboard.update();
 * (3) check state of keys:
 *       keyboard.down("A")    -- true for one update cycle after key is pressed
 *       keyboard.pressed("A") -- true as long as key is being pressed
 *       keyboard.up("A")      -- true for one update cycle after key is released
 *
 *  See KeyboardState.k object data below for names of keys whose state can be polled
 */
/* eslint-disable   */
(function (root, factory) {
  // eslint-disable-line
  if (typeof define === "function" && define.amd) {
    // BMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Arowser globals
    root.KeyboardState = factory();
  }
})(this, function () {
  /**
   * - NOTE: it would be quite easy to push event-driven too
   *   - microevent.js for events handling
   *   - in this._onkeyChange, generate a string from the DOM event
   *   - use this as event name
   */
  var KeyboardState = function () {
    // to store the current state
    this.keyCodes = {};
    this.modifiers = {};

    // create callback to bind/unbind keyboard events
    var self = this;
    this._onKeyDown = function (event) {
      self._onKeyChange(event, true);
    };
    this._onKeyUp = function (event) {
      self._onKeyChange(event, false);
    };

    // bind keyEvents
    document.addEventListener("keydown", this._onKeyDown, false);
    document.addEventListener("keyup", this._onKeyUp, false);
  };

  /**
   * To stop listening of the keyboard events
   */
  KeyboardState.prototype.destroy = function () {
    // unbind keyEvents
    document.removeEventListener("keydown", this._onKeyDown, false);
    document.removeEventListener("keyup", this._onKeyUp, false);
  };

  KeyboardState.MODIFIERS = ["shift", "ctrl", "alt", "meta"];
  KeyboardState.ALIAS = {
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    space: 32,
    pageup: 33,
    pagedown: 34,
    tab: 9
  };

  /**
   * to process the keyboard dom event
   */
  KeyboardState.prototype._onKeyChange = function (event, pressed) {
    // log to debug
    //console.log("onKeyChange", event, pressed, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)

    // update this.keyCodes
    var keyCode = event.keyCode;
    this.keyCodes[keyCode] = pressed;

    // update this.modifiers
    this.modifiers["shift"] = event.shiftKey;
    this.modifiers["ctrl"] = event.ctrlKey;
    this.modifiers["alt"] = event.altKey;
    this.modifiers["meta"] = event.metaKey;
  };

  /**
   * query keyboard state to know if a key is pressed of not
   *
   * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
   * @returns {Boolean} true if the key is pressed, false otherwise
   */
  KeyboardState.prototype.pressed = function (keyDesc) {
    var keys = keyDesc.split("+");
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var pressed;
      if (KeyboardState.MODIFIERS.indexOf(key) !== -1) {
        pressed = this.modifiers[key];
      } else if (Object.keys(KeyboardState.ALIAS).indexOf(key) != -1) {
        pressed = this.keyCodes[KeyboardState.ALIAS[key]];
      } else {
        pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
      }
      if (!pressed) return false;
    }
    return true;
  };

  return KeyboardState;

  ///////////////////////////////////////////////////////////////////////////////
});
/* eslint-disable   */

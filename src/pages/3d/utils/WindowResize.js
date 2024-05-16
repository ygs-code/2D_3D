// This THREEx helper makes it easy to handle window resize.
// It will update renderer and camera when window is resized.
//
// # Usage
//
// **Step 1**: Start updating renderer and camera
//
// ```var windowResize = WindowResize(aRenderer, aCamera)```
//
// **Step 2**: Start updating renderer and camera
//
// ```windowResize.stop()```
// # Code

//
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
    root.WindowResize = factory();
  }
})(this, function () {
 

  /**
   * Update renderer and camera when the window is resized
   *
   * @param {Object} renderer the renderer to update
   * @param {Object} Camera the camera to update
   */
  var WindowResize = function (renderer, camera) {
    var callback = function () {
      // notify the renderer of the size change
      renderer.setSize(window.innerWidth, window.innerHeight);
      // update the camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    // bind the resize event
    window.addEventListener("resize", callback, false);
    // return .stop() the function to stop watching window resize
    return {
      /**
       * Stop watching window resize
       */
      stop: function () {
        window.removeEventListener("resize", callback);
      }
    };
  };

  return WindowResize
});

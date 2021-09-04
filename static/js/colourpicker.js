(function($, window) {
  var jqColourEl = $('#colour-rgb');
  var colourEl = jqColourEl[0];
  var hueb = new Huebee(
    colourEl, {
      "saturations": 1,
      "notation": "hex",
      "staticOpen": true});

  jqColourEl.attr('type', 'hidden');

  // This is needed in order for Huebee to render properly in a dropdown
  // that's not visible on page load.
  // See https://github.com/metafizzy/huebee/pull/20
  $('.dropdown-colour').on('shown.bs.dropdown', function() {
    hueb.updateSizes();
    hueb.renderColors();
  });
}).call(this, jQuery, window);

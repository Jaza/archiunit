(function($, window) {
  $('.description-popup-link').click(function(e) {
    var $this = $(this);

    var desc_content = $this.parent().parent().next('.description-popup-content-container');

    if (desc_content.length) {
      e.preventDefault();

      bootbox.dialog({
        message: desc_content.children('.description-popup-content')[0],
        buttons: [],
        onEscape: true
      });
    }
  });
}).call(this, jQuery, window);

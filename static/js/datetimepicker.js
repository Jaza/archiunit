(function($, window) {

  $('.datepicker-enable').each(function() {
    var dpformat = $(this).attr('data-datepicker-format')
      ? $(this).attr('data-datepicker-format')
      : 'DD MMM YYYY';

    $(this).datetimepicker({
      format: dpformat});
  });

  $('.timepicker-enable').each(function() {
    var dpformat = $(this).attr('data-datepicker-format')
      ? $(this).attr('data-datepicker-format')
      : 'HH:mm';

    $(this).datetimepicker({
      format: dpformat});
  });

  $('.datepicker-enable, .timepicker-enable').on('dp.change', function(e) {
      $(this)
        .trigger('input');
    });

}).call(this, jQuery, window);

(function($, window) {
  $('.phone-toggle').click(function(e) {
    if ($(this).hasClass('phone-toggle-international')) {
      $(this).parents('.phone-toggle-wrapper')
             .find('.phone-national, ' +
                   '.phone-toggled-national, ' +
                   '.phone-toggle-international')
             .removeClass('phone-enabled');

      $(this).parents('.phone-toggle-wrapper')
             .find('.phone-international, ' +
                   '.phone-toggled-international, ' +
                   '.phone-toggle-national')
             .addClass('phone-enabled');
    }
    else {
      $(this).parents('.phone-toggle-wrapper')
             .find('.phone-international, ' +
                   '.phone-toggled-international, ' +
                   '.phone-toggle-national')
             .removeClass('phone-enabled');

      $(this).parents('.phone-toggle-wrapper')
             .find('.phone-national, ' +
                   '.phone-toggled-national, ' +
                   '.phone-toggle-international')
             .addClass('phone-enabled');
    }

    return false;
  });
}).call(this, jQuery, window);

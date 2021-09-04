(function($, window) {

  $('.select2-enable').select2({theme: 'bootstrap'});

  $('.select2-enable').on('change', function(e) {
      $(this)
        .trigger('input');
    });

  //$('.bscolorpicker-enable').colorpicker({
      //format: 'hex',
      //colorSelectors: {
          //'black': '#000000',
          //'lime': '#00ff00',
          //'blue': '#0000ff',
          //'purple': '#800080',
          //'white': '#ffffff',
          //'green': '#009900',
          //'red': '#ff0000',
          //'yellow': '#ffff00',
          //'gray': '#808080'
      //}});

  $('.dropdown-menu').click(function(e) {
    e.stopPropagation();
  });

  //$('.dropdown-colour').click(function() {
    //var $this = $(this);
    //setTimeout(function() {
      //$this.parent()
           //.find('.colorpicker-element')
           //.colorpicker('show');
    //}, 10);
  //});

  $('.bsswitch-enable').each(function() {
    var contEl = $(this);

    contEl
      .find('input[type=radio]')
      .bootstrapSwitch({radioAllOff: true})
      .on('switchChange.bootstrapSwitch', function(event, state) {
        if ($(this).attr('id').endsWith('1') && !state) {
          var otherElId = $(this).attr('id').slice(0, -1) + '0';
          contEl
            .find('#' + otherElId)
            .bootstrapSwitch('toggleState', true, false);
        }
      });

    setTimeout(function() {
      $('#search-advanced-body, #search-fortype-body').collapse('hide');
    }, 100);
  });

  $('.modal-reload-on-close').on('hidden.bs.modal', function (e) {
    window.location.reload(false);
  });

}).call(this, jQuery, window);

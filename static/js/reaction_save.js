(function($, window) {
  function init(contEl) {
    var jqContEl = $(contEl);

    jqContEl.find('.reaction-submit').click(function() {
      var thisBtn = $(this);
      var thisFormEl = thisBtn.parent('.reaction-form');

      if (thisFormEl.length && thisFormEl.data('reaction-save-url')) {
        $.ajax(
          {
            type: thisFormEl.attr('method'),
            url: thisFormEl.data('reaction-save-url'),
            data: thisFormEl.serializeArray()
          })
          .done(function(data, textStatus, jqXHR) {
            thisFormEl.addClass('reaction-form-disabled');

            var thisFormId = thisFormEl.attr('id');
            var isAddAction = thisFormId.indexOf('-add-') !== -1;
            var targetFormId = (
              isAddAction
                ? thisFormId.replace(/\-add\-/, '-delete-')
                : thisFormId.replace(/\-delete\-/, '-add-'));

            var targetFormEl = $('#' + targetFormId);

            targetFormEl.removeClass('reaction-form-disabled');

            var oldCountStr = (
              $.trim(thisFormEl.find('.reaction-count').html()));
            var oldCount = oldCountStr !== '' ? parseInt(oldCountStr) : 0;

            var newCount = isAddAction ? oldCount + 1 : oldCount - 1;
            var newCountStr = newCount !== 0 ? newCount.toString() : '';

            thisFormEl.find('.reaction-count').html(newCountStr);
            targetFormEl.find('.reaction-count').html(newCountStr);
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            thisBtn.addClass('reaction-error');
          });

        return false;
      }
    });
  }

  var contSel = '.reactions';

  if ($(contSel).length) {
    $(contSel).each(function() {
      init(this);
    });
  }


}).call(this, jQuery, window);

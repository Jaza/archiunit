(function($, window) {
  function init(searchBoxEl) {
    var jqSearchBoxEl = $(searchBoxEl);

    jqSearchBoxEl.typeahead(
      null, {
        name: 'keywords',
        display: 'value',
        source: function(q, cb) {
          // If no product code value has been entered yet, then
          // populate typeahead so the user can select to search by
          // keyword or by product code.
          // But if a product code has already been entered, no
          // typeahead, just make the search box populate keywords.
          var ret = (
            !$('#brand-code').val()
            ? [
              {field: 'keywords', value: q},
              {field: 'brand-code', value: q}]
            : []);

          cb(ret);
        },
        templates: {
          suggestion: function(data) {
            // The two "suggestions" are whatever the user just typed,
            // formatted to allow a choice between keywords or brand
            // code.
            return [
              '<p><strong>',
              ('brand-code' === data.field ? 'Product code' : 'Keywords'),
              ':</strong> ',
              data.value,
              '</p>'
            ].join('');
          }
        }
      })
    .bind('typeahead:select', function(ev, suggestion) {
      // When the user clicks the "search by product code" option,
      // populate the product code search field, and clear typeahead
      // (i.e. clear keywords).
      if ('brand-code' === suggestion.field) {
        $('#brand-code').val(suggestion.value)
                           .trigger('change');
        jqSearchBoxEl.typeahead('val', '');
      }
    });
  }

  var searchBoxSel = '.form-control-search-keywords';

  if ($(searchBoxSel).length) {
    $(searchBoxSel).each(function() {
      init(this);
    });
  }
}).call(this, jQuery, window);

(function($, window) {
  function fieldFormatterIntegerGm(formParamVal) {
    return formParamVal ? formParamVal.toString() + 'gm' : '';
  }

  function fieldFormatterIntegerDollars(formParamVal) {
    return formParamVal ? '$' + formParamVal.toString() : '';
  }

  function fieldFormatterDimensionsMm(formParamVal) {
    return formParamVal ? formParamVal.toString() + 'mm' : '';
  }

  function setOptionForParam(contEl, formParam) {
    var jqContEl = $(contEl);
    var jqFormEl = jqContEl.parents('form');
    var jqEl = jqContEl.find('select');

    var formParamId = formParam.id;
    var formParamLabel = formParam.label;
    var formParamFieldType = formParam.fieldType;
    var formParamFieldFormatter = formParam.fieldFormatter;
    var formParamIdSel = '#' + formParamId;
    var formParamEl = jqFormEl.find(formParamIdSel);
    var formParamVal = formParamEl.val();

    var optEl = jqEl.find('.indicator-value-' + formParamId);

    if (formParamVal && 'choice' === formParamFieldType) {
      var formParamOptText = formParamVal.map(function(el) {
        return jqFormEl
          .find(formParamIdSel + ' option[value="' + el + '"]')
          .text()
          .trim();
      });

      formParamVal = formParamOptText.join(' OR ');
    }

    if (formParamVal && 'integer' === formParamFieldType) {
      if (!/^[0-9]+$/.test(formParamVal)) {
        formParamVal = '';
      }
    }

    if (formParamVal && 'colour' === formParamFieldType) {
      if (/^\#?[0-9A-Fa-f]{6}$/.test(formParamVal)) {
        if (!/^\#/.test(formParamVal)) {
          formParamVal = '#' + formParamVal;
        }
      }
      else {
        formParamVal = '';
      }
    }

    if (formParamVal && 'dimensions' === formParamFieldType) {
      if (!/^[0-9]+x[0-9]+x[0-9]+$/.test(formParamVal)) {
        formParamVal = '';
      }
    }

    if (null != formParamFieldFormatter) {
      formParamVal = formParamFieldFormatter(formParamVal);
    }

    if (optEl.length) {
      optEl.remove();
    }

    if (formParamVal) {
      var optText = formParamLabel + ': ' + formParamVal;
      var optClass = 'indicator-value indicator-value-' + formParamId;
      jqEl.append(
        '<option class="' + optClass + '" ' +
                'selected="selected">' +
        '</option>');

      optEl = jqEl.find('.indicator-value-' + formParamId);
      optEl.attr('value', formParamVal);
      optEl.text(optText);
    }

    if (jqEl.find('.indicator-value').length) {
      jqContEl.show();
    }
    else {
      jqContEl.hide();
    }
  }

  function init(contEl, formParams) {
    var jqContEl = $(contEl);
    var jqFormEl = jqContEl.parents('form');

    jqContEl.append(
      '<div class="form-group" ' +
           'style="display: block">' +
      '<select class="form-control" ' +
              'multiple="multiple" ' +
              'data-tags="true" ' +
              'disabled="disabled" ' +
              'style="width: 100%">' +
      '</select></div>');

    var jqEl = jqContEl.find('select');
    jqEl.select2();

    $.each(formParams, function(i, formParam) {
      setOptionForParam(contEl, formParam);
    });

    jqEl.trigger('change');

    $.each(formParams, function(i, formParam) {
      var formParamId = formParam.id;
      var formParamIdSel = '#' + formParamId;
      var formParamEl = jqFormEl.find(formParamIdSel);

      formParamEl.on('change', function() {
        setOptionForParam(contEl, formParam);
        jqEl.trigger('change');
      });
    });
  }

  var formParams = [
    {id: 'keywords', label: 'Keywords', fieldType: 'string'},
    {id: 'product-type', label: 'Product type', fieldType: 'choice'},
    {id: 'brand-code', label: 'Product code', fieldType: 'string'},
    {id: 'brand-id', label: 'Brand', fieldType: 'choice'},
    {id: 'colour-rgb', label: 'Colour', fieldType: 'colour'},
    {id: 'dim-mm-min', label: 'Min dimensions', fieldType: 'dimensions',
      fieldFormatter: fieldFormatterDimensionsMm},
    {id: 'dim-mm-max', label: 'Max dimensions', fieldType: 'dimensions',
      fieldFormatter: fieldFormatterDimensionsMm},
    {id: 'phys-weight-gm-min', label: 'Min weight', fieldType: 'integer',
     fieldFormatter: fieldFormatterIntegerGm},
    {id: 'phys-weight-gm-max', label: 'Max weight', fieldType: 'integer',
     fieldFormatter: fieldFormatterIntegerGm},
    {id: 'price-min', label: 'Min price', fieldType: 'integer',
     fieldFormatter: fieldFormatterIntegerDollars},
    {id: 'price-max', label: 'Max price', fieldType: 'integer',
     fieldFormatter: fieldFormatterIntegerDollars}];

  var contSel = '.searchparams-indicator-container';

  if ($(contSel).length) {
    $(contSel).each(function() {
      init(this, formParams);
    });
  }


}).call(this, jQuery, window);

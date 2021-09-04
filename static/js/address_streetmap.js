(function($, L, window) {
  function geocodeAddressAndShowStreetMap(
      mapDivId, mapboxAccessToken, streetMapAddress) {
    var smAddress = $.trim(streetMapAddress);

    var mapDivSel = '#' + mapDivId;

    if (smAddress) {
      var poBoxRegex = /^[Pp][Oo] [Bb][Oo][Xx]\s*\d+\,?\s*/;
      if (poBoxRegex.test(smAddress)) {
        smAddress = smAddress.replace(poBoxRegex, '');
      }

      var streetRangeRegex = /^(\d+)\s*\-\s*\d+(\s*)/;
      if (streetRangeRegex.test(smAddress)) {
        smAddress = smAddress.replace(streetRangeRegex, '$1$2');
      }

      var geocodingQuery = encodeURIComponent(smAddress);
      var geocodingRequestURL = (
        '//api.mapbox.com/geocoding/v5/mapbox.places/' +
        geocodingQuery + '.json');
      var geocodingMinRelevanceScore = 0.6;

      var leafletMapURL = (
        '//api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}' +
        '?access_token={accessToken}');
      var leafletMapAttribution = (
        'Map data &copy; ' +
        '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
        'contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ')

      var leafletDefaultStyleID = 'cjzoh882k2njo1crylb28iiz3';
      var leafletDefaultStyleName = 'Pencil';
      var leafletDefaultAttribution = (
        leafletMapAttribution +
        '<a href="https://blog.mapbox.com' +
        '/designing-a-pencil-drawn-style-in-mapbox-studio-classic-842019b33c52">' +
        'Pencil</a> style &copy; <a href="https://www.mapbox.com/">Mapbox</a>');

      var leafletAltStyleID = 'streets-v11';
      var leafletAltStyleName = 'Streets';
      var leafletAltAttribution = (
        leafletMapAttribution +
        'Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>');

      var toggleLinkId = 'toggle-leaflet-tilelayer';
      var toggleLinkSel = '#' + toggleLinkId;
      var switchToAltClass = 'switch-to-alt';

      var leafletDefaultZoom = 16;
      var leafletMaxZoom = 18;

      $.get(
        geocodingRequestURL,
        {access_token: mapboxAccessToken},
        function(data) {
          if (
              null != data && null != data.features &&
              null != data.features[0].center &&
              null != data.features[0].relevance &&
              data.features[0].relevance >= geocodingMinRelevanceScore) {
            $(mapDivSel).addClass('map-enabled');

            var coords = [
              data.features[0].center[1], data.features[0].center[0]];
            var map = L.map(mapDivId).setView(coords, leafletDefaultZoom);

            var defaultStyle = L.tileLayer(leafletMapURL, {
              attribution: leafletDefaultAttribution,
              maxZoom: leafletMaxZoom,
              id: leafletDefaultStyleID,
              accessToken: mapboxAccessToken
            })
            var altStyle = L.tileLayer(leafletMapURL, {
              attribution: leafletAltAttribution,
              maxZoom: leafletMaxZoom,
              id: leafletAltStyleID,
              accessToken: mapboxAccessToken
            })

            map.addLayer(defaultStyle);

            $(mapDivSel).after(
              '<p class="text-right small">(' +
              '<a href="#" id="' + toggleLinkId + '" ' +
              'class="' + switchToAltClass + '">' +
              'Switch to ' + leafletAltStyleName +
              '</a>)</p>');

            $(toggleLinkSel).click(function() {
              if ($(this).hasClass(switchToAltClass)) {
                map.removeLayer(defaultStyle);
                map.addLayer(altStyle);
                $(this).removeClass(switchToAltClass)
                       .html('Switch to ' + leafletDefaultStyleName);
              }
              else {
                map.removeLayer(altStyle);
                map.addLayer(defaultStyle);
                $(this).addClass(switchToAltClass)
                       .html('Switch to ' + leafletAltStyleName);
              }

              return false;
            });
          }
          else {
            $(mapDivSel).after('<p class="alert alert-warning" role="alert">Error displaying map: unable to geocode the specified address with sufficient accuracy.</p>');
          }
        })
      .fail(
        function() {
          $(mapDivSel).after('<p class="alert alert-warning" role="alert">Error displaying map: failed to fetch map data.</p>');
        });
    }
  }

  function init() {
    if ($('.address-streetmap').length) {
      $('.address-streetmap').each(function() {
        var jqEl = $(this);
        var mapDivId = jqEl.attr('id');
        var mapboxAccessToken = jqEl.data('addressStreetmapMapboxAccessToken');
        var streetMapAddress = jqEl.data('addressStreetmapAddress');

        if (mapDivId && mapboxAccessToken && streetMapAddress) {
          geocodeAddressAndShowStreetMap(
            mapDivId, mapboxAccessToken, streetMapAddress)
        }
      });
    }
  }

  init();
}).call(this, jQuery, L, window);

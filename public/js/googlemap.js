$(function(){

function initMap() {
<<<<<<< HEAD
  alert(state1+''+state2+''+year+''+month);
  var myCenter1;// = {lat: 46.413, lng: -94.504};
=======

  var myCenter1 = {lat: 46.413, lng: -94.504};
>>>>>>> a17550e771ca73a2ffa4a9566103eecaff3446ce
  var myCenter2;
  var dataLocal = null;
  initializeCenter("Minnesota","Wisconsin");
  //console.log(myCenter2);
 //Draw Map 1

  function addStyleToMap(mapLabel,center,url){
    var map;
    //console.log("Center="+center);
    map = new google.maps.Map(document.getElementById(mapLabel), {
      center: center, // This needs a json for lat long {lat: 46.413, lng: -94.504}
      zoom: 6,
      styles: mapStyle
    });
    map.data.setStyle(styleFeature);
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(map,'click',function() {
          infowindow.close();
      });

      map.data.addListener('click', function(event) {
             var myHTML = event.feature.getProperty("Description");
             console.log(event.feature.getProperty("Description"));
         infowindow.setContent("<div style='width:150px; text-align: center;'>"+myHTML+"</div>");
         infowindow.setPosition(event.feature.getGeometry().get());
         infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
         infowindow.open(map);
     });
     populateMap(map,url);
   }



  function populateMap(map,url){
    var snowUrl = url;
    var map = map;
    $.ajax({
        type: "get",
        url: snowUrl,
        dataType: "json",
        jsonp:"callback",
        success: function (data) {
            dataSource = data.data;
            dataDesc = data.description;
            snowDisp = parseSnowData(dataSource,1,28);
            dataLocal = dataSource;
            var testSnow = snowDisp;
            var test = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"mag":1.3}, "geometry":{"type":"Point","coordinates":[-140.8051,61.5171]}},{"type":"Feature","properties":{"mag":1.3}, "geometry":{"type":"Point","coordinates":[-140.8051,63]}}]}';
            var testJson = JSON.parse(testSnow);
            var jData = eqfeed_callback(map,testJson);
            console.log(testJson["features"]);
            packDataToLocation(dataSource);
            // script.setAttribute('src',jData);
            // document.getElementsByTagName('head')[0].appendChild(script);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }

  function packDataToLocation(data)
  {
    dataLocal = data;
  }
  function parseSnowData(dataSource,daybegin,dayend) {
    var maxSnowF = 0;
    // $.each(dataSource, function(i, n){
    //     $.each(n["values"], function(j, m){
    //         // console.log("maxsnowf: " + m);
    //         maxSnowF = parseFloat(m)>maxSnowF ? parseFloat(m) : maxSnowF;
    //     });
    // });
    //
    // console.log("maxsnowf: " + maxSnowF);
    var snowMapJson = '{"type":"FeatureCollection","features":[';
    var daybegin = daybegin;
    var dayend = dayend;
    var ii = 0;
    var i1 = 0, i2 = 0, i3 = 0;

    $.each(dataSource, function(i, n){
        var day = 0;var magVal=0.0;
        for(day = daybegin;day <= dayend; day++){
          var temp = parseFloat(n["values"][day]);
          if(isNaN(temp)){temp = 0.0;}
          magVal = magVal + temp;
        }
        console.log(magVal,dayend-daybegin);
        magVal = magVal/ (dayend-daybegin);
        if(isNaN(magVal)){
            magVal = 0.0;
        }
        if(magVal<1) i1++;
        else if(magVal>=1 && magVal<5) i2++;
        else if(magVal>5) i3++;
        magVal = magVal*3 + 2;
        snowMapJson += '{"type":"Feature","properties":{"mag":' + magVal + '}, "geometry":{"type":"Point","coordinates":[' + n["lon"] + "," + n["lat"] + ']}},';
        ii++;
        if(ii==2000) return false;
    });
    console.log(i1 + "---" + i2 + '----' + i3);

    snowMapJson = snowMapJson.substring(0, snowMapJson.length-1);
    snowMapJson += ']}';
    return snowMapJson;
  }

  // Defines the callback function referenced in the jsonp file.
  function eqfeed_callback(map,data) {
    map.data.addGeoJson(data);
  }


  function styleFeature(feature) {
    var low = [151, 83, 34];   // color of mag 1.0
    var high = [5, 69, 54];  // color of mag 6.0 and above
    var minMag = 1.0;
    var maxMag = 6.0;

    // fraction represents where the value sits between the min and max
    var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) /
        (maxMag - minMag);
    var color = interpolateHsl(low, high, fraction);
    return {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        strokeWeight: 0.5,
        strokeColor: '#fff',
        fillColor: color,
        fillOpacity: 2 / feature.getProperty('mag'),
        // while an exponent would technically be correct, quadratic looks nicer
        scale: Math.pow(feature.getProperty('mag'), 1)
      },
      zIndex: Math.floor(feature.getProperty('mag'))
    };
  }

  function interpolateHsl(lowHsl, highHsl, fraction) {
    var color = [];
    for (var i = 0; i < 3; i++) {
      // Calculate color based on the fraction.
      color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
    }

    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
  }

  var mapStyle = [{
    'featureType': 'all',
    'elementType': 'all',
    'stylers': [{'visibility': 'off'}]
  }, {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
  }, {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{'visibility': 'off'}]
  }, {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
  }];


  function initializeCenter(location1,location2){
    var Jsonlatlong = '',Jsonlatlong2 = '';
    var JsonlatlongObject = null,JsonlatlongObject2=null;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({

        'address': location1
    }, function (results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            Jsonlatlong+='{"lat":' + results[0].geometry.location.lat() + ', "lng":'+ results[0].geometry.location.lng()+'}';
            JsonlatlongObject = JSON.parse(Jsonlatlong);
            var center=JsonlatlongObject;
            addStyleToMap('map',center,"https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/MN-snowfall-201612.json");
            console.log(center);
            // console.log(results[0]);
            // console.log(results[1]);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });

    geocoder.geocode({

        'address': location2
    }, function (results2, status) {

        if (status == google.maps.GeocoderStatus.OK) {
            Jsonlatlong2+='{"lat":' + results2[0].geometry.location.lat() + ', "lng":'+ results2[0].geometry.location.lng()+'}';
            JsonlatlongObject2 = JSON.parse(Jsonlatlong2);
            var center=JsonlatlongObject2;
            addStyleToMap('map2',JsonlatlongObject2,"https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/WI-snowfall-201612.json");
            console.log(center);
            // console.log(results2[0]);
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });

  }
}

var mapsAPI='AIzaSyAyZrx9EmwScpARmLLJLRYgNv1L53v2n0g';
$.getScript('https://maps.google.com/maps/api/js?key=' + mapsAPI).done(function(){initMap()});
});

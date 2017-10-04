$(function(){
  var datalocal1,datalocal2;//dataLocal[];
  var map1,map2;


  function reset(begindate,enddate){
    // for(var counter=0;counter<=mapList.length; counter++){
    //var datalocal=  (counter==0)?dataLocal1:dataLocal2;
    var jsondata = JSON.parse(parseSnowData(datalocal1,begindate,enddate));
    //console.log("entered here");
    //var map = mapList[counter];
    map1.data.forEach(function(feature) {
       //filter...
        map1.data.remove(feature);
    });
    
    map1.data.addGeoJson(jsondata);
    var jsondata2 = JSON.parse(parseSnowData(datalocal2,begindate,enddate));
    map2.data.addGeoJson(jsondata2);
  //}
  }

  function parseSnowData(dataSource,daybegin,dayend) {
    var snowMapJson = '{"type":"FeatureCollection","features":[';
    var day = 9;
    var ii = 0;
    var i1 = 0, i2 = 0, i3 = 0;
    $.each(dataSource, function(i, n){
        var day = 0;var magVal=0.0;
        for(day = daybegin;day <= dayend; day++){
          var temp = parseFloat(n["values"][day]);
          if(isNaN(temp)){temp = 0.0;}
          magVal = magVal + temp;
        }
        magVal = magVal/ (dayend-daybegin);
        if(isNaN(magVal)){
            magVal = 0.0;
        }
        if(magVal<1) i1++;
        else if(magVal>=1 && magVal<5) i2++;
        else if(magVal>5) i3++;
        magVal = magVal*3 + 2;
        var jsonObj = {};
        jsonObj["stationName"] = n["station_name"];
        jsonObj["mag"] = magVal;
        snowMapJson += '{"type":"Feature","properties": '+JSON.stringify(jsonObj)+', "geometry":{"type":"Point","coordinates":[' + n["lon"] + "," + n["lat"] + ']}},';
        ii++;
        if(ii==2000) return false;
    });
    snowMapJson = snowMapJson.substring(0, snowMapJson.length-1);
    snowMapJson += ']}';
    return snowMapJson;
  }

function initMap() {
  // initializeCenter("Minnesota","Wisconsin");
  initializeCenter(state1,state2);

  function addStyleToMap(stateNo, mapLabel, center, url){
    var map;

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

     populateMap(stateNo, map,url,1,28);
     map.data.addListener('click', function(event) {
       var myHTML = event.feature.getProperty("stationName");
       infowindow.close();
       infowindow.setContent("<div style='width:150px; text-align: center; color: black;'>"+myHTML+"</div>");
       infowindow.setPosition(event.feature.getGeometry().get());
       infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
       infowindow.open(map);
    });
  //  mapList.push(map);
   }
   // Defines the callback function referenced in the jsonp file.
   var feature ;
   function eqfeed_callback(map,data) {
     feature = map.data.addGeoJson(data);
   }

  function populateMap(stateNo, map,url,begindate,enddate){
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
            var description = (stateNo == 1) ?  $("#description1") :  $("#description2");
            description.text(data.description.title) ;
            snowDisp = parseSnowData(dataSource,begindate,enddate);
            var testSnow = snowDisp;
            //var test = '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"mag":1.3}, "geometry":{"type":"Point","coordinates":[-140.8051,61.5171]}},{"type":"Feature","properties":{"mag":1.3}, "geometry":{"type":"Point","coordinates":[-140.8051,63]}}]}';
            var testJson = JSON.parse(testSnow);
            var jData = eqfeed_callback(map,testJson);
            (stateNo == 1)? (datalocal1=dataSource):(datalocal2=dataSource);
            (stateNo == 1)? (map1=map):(map2=map);
            //packDataToLocation(dataSource);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }



  // function packDataToLocation(data)
  // { console.log("called again");
  //   dataLocal.push(data);
  // }


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
            var url1 = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/"+state1+"-snowfall-"+year+month+".json";
            console.log(url1);
            addStyleToMap(1,'map',center,url1);
            //addStyleToMap('map',center,"https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/MN-snowfall-201612.json");

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
            var url2 = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/"+state2+"-snowfall-"+year+month+".json";
            console.log(url2);
            addStyleToMap(2, 'map2',center,url2);
            //addStyleToMap('map2',JsonlatlongObject2,"https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/WI-snowfall-201612.json");
        } else {
            console.log("Geocode was not successful for the following reason: " + status);
        }
    });

  }
}


var var1 , var2;
d3.select('#slider3').call(d3.slider().axis(true).value([1,28]).min(1).max(28).step(1).on("slide", function(evt, value) {
      var1 = value[0];
      var2 = value[1];
      d3.select('#slider3textmin').text(value[ 0 ]);
      d3.select('#slider3textmax').text(value[ 1 ]);
      //reset(value[0],value[1]);
    }));
$("#play").on("click", function(){
  reset(var1,var2);
});


var mapsAPI='AIzaSyAyZrx9EmwScpARmLLJLRYgNv1L53v2n0g';
$.getScript('https://maps.google.com/maps/api/js?key=' + mapsAPI).done(function(){initMap()});
});

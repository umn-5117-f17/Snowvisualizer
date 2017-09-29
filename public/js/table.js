$(function(){
  //console.log('The Javascript is loaded');
  //alert(state);
  /*$.get( "/submit", function( data ) {
  alert(data);
});*/

  // state and year variables are present now.
  // Draw a simple graph first
  //Make calls to the server to extract data
  //parse the data
  callNoaa(state, year, month);
  function callNoaa(state, year, month) {

    // for parse json data to a new format
    var snowUrl = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/"+state+"-snowfall-"+year+month+".json" ;
    $.ajax({
        type: "get",
        url: snowUrl,
        dataType: "json",
        success: function (data) {
            dataSource = data.data;
            dataDesc = data.description;
            snowDisp = parseSnowData(dataSource);
          //  var testJson = JSON.parse(snowDisp);
            $("#description").text(data.description.title) ;
            var table = $("#table tbody");
            $.each(snowDisp, function(idx, elem){
              table.append("<tr><td>"+(idx+1)+"</td><td>"+snowDisp[idx].station_name+"</td><td>"+snowDisp[idx].average+"</td><td>"+snowDisp[idx].maxSnowF+"</td></tr>");
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }

  // function for parsing snowdata to geo map format
  function parseSnowData(dataSource) {
    var AvgJson = [];
    $.each(dataSource, function(i, n){
        var sum = 0.0;
        var days = 0;
        var average = 0;
        var maxSnowF = 0;
        $.each(n["values"], function(j, m){
            days++;
            m = parseFloat(m);
            if(isNaN(m)){
                m = 0.0;
            }
            maxSnowF = parseFloat(m)>maxSnowF ? parseFloat(m) : maxSnowF;
            sum += m;
        });
        average = sum/days;
        //console.log(average);
        AvgJson.push({station_name: n["station_name"] , average: average, maxSnowF : maxSnowF })
    });
    return AvgJson;
  }

  $("#search").on("keyup", function() {
    var value = $(this).val().toUpperCase();

    $("table tr").each(function(index) {
        if (index !== 0) {
            $row = $(this);
            var id = $row.find("td:nth-child(2)").text();
            if (id.indexOf(value) !== 0) {
                $row.hide();
            }
            else {
                $row.show();
            }
        }
    });
});

});

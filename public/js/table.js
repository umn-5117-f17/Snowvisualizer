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
  var graphData = {};
  callNoaa(state1, year, month, 1);
  callNoaa(state2, year, month, 2);
  function callNoaa(state, year, month, tableNumber) {
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
            snowDisp = snowDisp['monthAvg'];
            graphData = data.data;
          //  var testJson = JSON.parse(snowDisp);
            var description = (tableNumber == 1) ?  $("#description1") :  $("#description2");
            description.text(data.description.title) ;
            var table = (tableNumber == 1) ? $('#table1') :  $('#table2');
            $.each(snowDisp, function(idx, elem){
              //console.log(snowDisp[idx].maxSnowF);
              if(snowDisp[idx].maxSnowF>parseFloat(5)){
                  //console.log(table);
                  //table.rows(idx+1).css('background-color', '#FFFF99');
                  table.append("<tr style = 'background-color: #ffffb2'><td>"+(idx+1)+"</td><td>"+snowDisp[idx].station_name+"</td><td>"+snowDisp[idx].average+"</td><td>"+snowDisp[idx].maxSnowF+"</td></tr>");
              }else{
                  table.append("<tr><td>"+(idx+1)+"</td><td>"+snowDisp[idx].station_name+"</td><td>"+snowDisp[idx].average+"</td><td>"+snowDisp[idx].maxSnowF+"</td></tr>");
              }
            });
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
  }


  // function for parsing snowdata to geo map format
  function parseSnowData(dataSource) {
    var AvgJson = { "monthAvg" : [], "dayAvg" : [] };         // ?????????????????????/ Remove this logic >>> No longerneeded
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
        AvgJson['monthAvg'].push({station_name: n["station_name"] , average: Number((average).toFixed(2)), maxSnowF : maxSnowF })
    });
    return AvgJson;
  }

  $("#search1").on("keyup", function() {
    callSearch($(this),1);
  });

  $("#search2").on("keyup", function() {
    callSearch($(this),2);
  });

  $("#table1").on("click", "tr", function(){
    $(this).removeAttr('style');    //need to take care of this and remove this soon
    $(this).toggleClass('selected');
    //var value=$(this).find('td:first').html();
    //alert(value);
  });

  $("#table2").on("click", "tr", function(){
    $(this).removeAttr('style');    //need to take care of this and remove this soon
    $(this).toggleClass('selected');
    //var value=$(this).find('td:first').html();
    //alert(value);
  });

/*
  $('#visualize').on('click', function(e){
    console.log("Here");
    var selected = [];
    $("#table1 tr.selected").each(function(){
        selected.push($('td:nth-child(2)', this).html());
    });
    alert(selected);
}); */

function visualize(table){

}
$("#visualize1").click(function() {
  var selected = [];
  //   show an alert message if more than one.
  $("#table1 tr.selected").each(function(){
    selected.push($('td:nth-child(2)', this).html());
  });
  if(selected.length>3){
    alert("Please select atmost 3 stations");
  }else{
    callGraph(selected[0],selected[1],selected[2]);
    $(".modal").addClass("is-active");
  }
});

$("#visualize2").click(function() {
  var selected = [];
  //   show an alert message if more than one.
  $("#table2 tr.selected").each(function(){
    selected.push($('td:nth-child(2)', this).html());
  });
  if(selected.length>3){
    alert("Please select atmost 3 stations");
  }else{
    callGraph(selected[0],selected[1],selected[2]);
    $(".modal").addClass("is-active");
  }
});


$(".modal-close").click(function() {
   $(".modal").removeClass("is-active");
});

function callGraph(station1, station2, station3){
  var station1Data = [];
  var station2Data = [];
  var station3Data = [];
  $.each(graphData, function(idx, elem){
    if(elem['station_name'] == station1){
        $.each(elem["values"], function(j, m){
            var obj = [];
            m = parseFloat(m);
            if(isNaN(m)){
                m = 0.0;
            }
            var d = new Date(month+","+ parseInt(j)+","+year);
            obj.push(d.getTime());
            obj.push(m);
            station1Data.push(obj);
        });
    }
    if(elem['station_name'] == station2){
        $.each(elem["values"], function(j, m){
            var obj = [];
            m = parseFloat(m);
            if(isNaN(m)){
                m = 0.0;
            }
            var d = new Date(month+","+ parseInt(j)+","+year);
            obj.push(d.getTime());
            obj.push(m);
            station2Data.push(obj);
        });
    }
    if(elem['station_name'] == station3){
        $.each(elem["values"], function(j, m){
            var obj = [];
            m = parseFloat(m);
            if(isNaN(m)){
                m = 0.0;
            }
            var d = new Date(month+","+ parseInt(j)+","+year);
            obj.push(d.getTime());
            obj.push(m);
            station3Data.push(obj);
        });
    }
  });
  drawCharts(station1Data, station2Data, station3Data);
}

function drawCharts(station1, station2, station3){
  Highcharts.chart('container', {
      chart: {
          zoomType: 'x'
      },
      title: {
          text: 'Time series'
      },
      subtitle: {
          text: document.ontouchstart === undefined ?
                  'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'SnowFall(Inches)'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              fillColor: {
                  linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1
                  },
                  stops: [
                      [0, Highcharts.getOptions().colors[0]],
                      [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                  ]
              },
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: [{
          type: 'area',
          name: 'station1',
          data: station1
      },
      {
          type: 'area',
          name: 'station2',
          data: station2
      },
      {
          type: 'area',
          name: 'station3',
          data: station3
      }
    ]
  });
}

  function callSearch(reference, tableNo){
    var value = reference.val().toUpperCase();
    var table = (tableNo == 1) ? $('#table1 tr') : $('#table2 tr');
    table.each(function(index) {
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
  }

});

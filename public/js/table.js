$(function(){
  var graphData1 = {};
  var graphData2 = {};

  callNoaa(state1, year, month, 1);
  callNoaa(state2, year, month, 2);

  function callNoaa(state, year, month, tableNumber) {

    var snowUrl = "https://www.ncdc.noaa.gov/snow-and-ice/daily-snow/"+state+"-snowfall-"+year+month+".json" ;

    $.ajax({
        type: "get",
        url: snowUrl,
        dataType: "json",
        success: function (data) {
            dataSource = data.data;
            if (state == state1){
              graphData1 = dataSource;
            }else{
              graphData2 = dataSource;
            }
            dataDesc = data.description;
            snowDisp = parseSnowData(dataSource);
            snowDisp = snowDisp;
            var description = (tableNumber == 1) ?  $("#description1") :  $("#description2");
            description.text(data.description.title) ;
            var table = (tableNumber == 1) ? $('#table1') :  $('#table2');
            $.each(snowDisp, function(idx, elem){
              if(snowDisp[idx].maxSnowF>parseFloat(5)){
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
        AvgJson.push({station_name: n["station_name"] , average: Number((average).toFixed(2)), maxSnowF : maxSnowF })
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
    $(this).removeAttr('style');
    $(this).toggleClass('selected');
  });

  $("#table2").on("click", "tr", function(){
    $(this).removeAttr('style');
    $(this).toggleClass('selected');
  });

  $("#reset1").on("click", function(){
      $("#table1 tr.selected").each(function(){
          $(this).toggleClass('selected');
      });
  });

  $("#reset2").on("click", function(){
      $("#table2 tr.selected").each(function(){
          $(this).toggleClass('selected');
      });
  });

  $("#visualize1").click(function() {
    var selected = [];
    $("#table1 tr.selected").each(function(){
      selected.push($('td:nth-child(2)', this).html());
    });
     populateSelected(selected, 1);
  });

  $("#visualize2").click(function() {
    var selected = [];
    $("#table2 tr.selected").each(function(){
      selected.push($('td:nth-child(2)', this).html());
    });
    populateSelected(selected, 2);
  });

function populateSelected(selected, stateNo){
  if(selected.length >3 || selected.length ==0 ){
    var msg = (selected.length ==0 ) ? 'Please select a station':'Please select atmost 3 stations';
    alert(msg);
  }else{
    callGraph(stateNo, selected[0],selected[1],selected[2]);
    $(".modal").addClass("is-active");
  }
}

$(".modal-close").click(function() {
   $(".modal").removeClass("is-active");
});

function callGraph(stateNo, station1, station2, station3){
  var station1Data = {name : {}, data:[]}; station2Data = {name : {}, data:[]}; station3Data = {name : {}, data:[]};
  var localGraph = (stateNo == 1)? graphData1 : graphData2;
  $.each(localGraph, function(idx, elem){
    if(elem['station_name'] == station1){
        station1Data.name = elem['station_name'];
        iterateOverStation(elem["values"], station1Data);
    }
    if(elem['station_name'] == station2){
      station2Data.name = elem['station_name'];
      iterateOverStation(elem["values"], station2Data);
    }
    if(elem['station_name'] == station3){
      station3Data.name = elem['station_name'];
      iterateOverStation(elem["values"], station3Data);
    }
  });
  drawCharts(station1Data, station2Data, station3Data);
}

function iterateOverStation(values, station){
  $.each(values, function(j, m){
      var obj = [];
      m = parseFloat(m);
      if(isNaN(m)){
          m = 0.0;
      }
      var d = new Date(month+","+ parseInt(j)+","+year);
      obj.push(d.getTime());
      obj.push(m);
      station.data.push(obj);
  });
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
          name: station1.name,
          data: station1.data
      },
      {
          type: 'area',
          name: station2.name,
          data: station2.data
      },
      {
          type: 'area',
          name: station3.name,
          data: station3.data
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

$(function(){
  d3.select('#slider3').call(d3.slider().axis(true).value( [ 1, 31 ] ).on("slide", function(evt, value) {
        d3.select('#slider3textmin').text(value[ 0 ]);
        d3.select('#slider3textmax').text(value[ 1 ]);
      }));
});

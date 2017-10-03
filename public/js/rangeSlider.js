$(function(){
  // d3.slider().axis(true).min(2000).max(2100).step(5)
  // d3.select('#slider3').call(d3.slider().axis(true).value( [ 1, 31 ] ).on("slide", function(evt, value) {
  //       d3.select('#slider3textmin').text(value[ 0 ]);
  //       d3.select('#slider3textmax').text(value[ 1 ]);
  //     }));
  d3.select('#slider3').call(d3.slider().axis(true).value([1,28]).min(1).max(28).step(1).on("slide", function(evt, value) {
        d3.select('#slider3textmin').text(value[ 0 ]);
        d3.select('#slider3textmax').text(value[ 1 ]);
        // populateMap()
      }));
});

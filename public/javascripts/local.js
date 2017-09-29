$( function() {
$( "#range-slider" ).slider({
  range: true,
  min: 1,
  max: 31,
  values: [ 1, 31 ],
  slide: function( event, ui ) {
    $( "#dataRange" ).val( "" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
  }
});
$( "#dataRange" ).val( "$" + $( "#range-slider" ).slider( "values", 0 ) +
  " - $" + $( "#range-slider" ).slider( "values", 1 ) );
});

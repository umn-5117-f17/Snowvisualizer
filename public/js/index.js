$(function(){
  alert("yo its done");
  var numDays = {
                  '1': 31, '2': 28, '3': 31, '4': 30, '5': 31, '6': 30,
                  '7': 31, '8': 31, '9': 30, '10': 31, '11': 30, '12': 31
                };

  function setDays(oMonthSel, oDaysSel, oYearSel)
  {
  	var nDays, oDaysSelLgth, opt, i = 1;
  	nDays = numDays[oMonthSel[oMonthSel.selectedIndex].value];
  	if (nDays == 28 && oYearSel[oYearSel.selectedIndex].value % 4 == 0)
  		++nDays;
  	oDaysSelLgth = oDaysSel.length;
  	if (nDays != oDaysSelLgth)
  	{
  		if (nDays < oDaysSelLgth)
  			oDaysSel.length = nDays;
  		else for (i; i < nDays - oDaysSelLgth + 1; i++)
  		{
  			opt = new Option(oDaysSelLgth + i, oDaysSelLgth + i);
                    	oDaysSel.options[oDaysSel.length] = opt;
  		}
  	}
  	var oForm = oMonthSel.form;
  	var month = oMonthSel.options[oMonthSel.selectedIndex].value;
  	var day = oDaysSel.options[oDaysSel.selectedIndex].value;
  	var year = oYearSel.options[oYearSel.selectedIndex].value;
  	oForm.hidden.value = month + '/' + day + '/' + year;
  }
});

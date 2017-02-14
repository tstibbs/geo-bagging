$.get('down-flash.php' + window.location.search, function(data) {
	var decodedXmlString = decodeURIComponent(data);
	var dom = $($.parseXML(decodedXmlString));
	var points = "";
	dom.find('C').each(function(i, element) {
		if (points.length > 0) {
			points = points + ";";
		}
		//e.g. <C D='Castlebythe Barrow' I='2041' E='202873' N='229647' F='n'/>
		var point = $(element);
		var name = point.attr('D');
		if (name !== null) {
			//get rid of any commas as that will break the parsing of the query string
			name = name.replace(',', ' ');
		}
		var url = 'http://www.trigpointing.uk/trig/' + point.attr('I');
		var eastings = point.attr('E');
		var northings = point.attr('N');
		points = points + eastings + "," + northings + "," + url + "," + name;
	});
	window.location="https://tstibbs.github.io/geo-bagging/examples/index.html?trigs=" + encodeURIComponent(points);
});

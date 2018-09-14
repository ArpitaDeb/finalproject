function init_map()
{
var myOptions = {zoom:12,center:new google.maps.LatLng(52.1275159,-106.66762449999999),mapTypeId: google.maps.MapTypeId.ROADMAP};
map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
marker = new google.maps.Marker({map: map,position: new google.maps.LatLng(52.1275159,-106.66762449999999)});
infowindow = new google.maps.InfoWindow({content:'<strong>Midtown Plaza</strong><br>201 1st Avenue S<br>S4P SASKATOON<br>'});
google.maps.event.addListener(marker, 'click', function()
{infowindow.open(map,marker);
});
infowindow.open(map,marker);
}
google.maps.event.addDomListener(window, 'load', init_map);
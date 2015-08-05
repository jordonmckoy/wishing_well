var socket = io();
var last_wish = {
  phrase : '',
  country : ''
};
var geo = true;

$('form').submit(function(){
  var data = {
    wish : $('#m').val().trim(),
    country : 'ZZ'
  }

  // get country code
  if (geo == true) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $.getJSON('http://ws.geonames.org/countryCode', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          type: 'JSON'
        }, function(result) {
          data.country = result.countryName;
        });
      });
    }
  }
  
  socket.emit('wish', data);
  $('#m').val('');
  return false;
});

$('#location').click(function(){
  geo = !geo;
  $('#location').toggleClass('locOn');
  $('#location').toggleClass('locOff');
});

setInterval(function() {
  socket.emit('fulfill');
}, 7000);

socket.on('log', function(cur) {
  console.log('> ' + cur);
});

socket.on('fulfill', function(wish) {
  console.log('... ' + wish.phrase);

  if (wish) {
    if ((last_wish.phrase.toLowerCase() != wish.phrase.toLowerCase()) && last_wish.country != wish.country) {

      $('#fadebox').fadeOut(800);
      setTimeout(function() {
        $('#wishbox').text(wish.phrase);
        $('#flagbox').attr("class","flag " + wish.cc.toLowerCase());
      }, 800);
      $('#fadebox').fadeIn(800);

      last_wish.phrase = wish.phrase;
      last_wish.country = wish.cc;
    } else  {
      socket.emit('random');
    }
  } else {
    socket.emit('random');
  }
  
});

socket.on('random', function(wish) {
  if (wish) {

    $('#fadebox').fadeOut(800);
    setTimeout(function() {
      $('#wishbox').text(wish.phrase);
      $('#flagbox').attr("class","flag " + wish.cc.toLowerCase());
    }, 800);
    $('#fadebox').fadeIn(800);

    last_wish.phrase = wish.phrase;
    last_wish.country = wish.cc;
  }
});
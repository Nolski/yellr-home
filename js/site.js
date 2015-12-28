
// entry point
$(document).ready(function() {
  yellr.init();
});


//
// helper functions
//

// function taken from
//   http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

// function taken from
//   http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}

// function taken from 
//   http://stackoverflow.com/a/105074
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

//
// site javascript object
//

var yellr = {

  // params that get sent to the server on every async server request
  cuid: '',
  lat: '43.1', // note: string prevents float rounding issues
  lng: '-77.5', // note: string prevents float rounding issues
  language_code: 'en',
  platform: 'web',

  init: function() {
    yellr.load_data_from_cookies();
    yellr.update_posts();
    yellr.update_assignments();
  },

  load_data_from_cookies() {
    // cuid
    var cuid = getCookie('cuid');
    if( yellr.cuid == '' || yellr.cuid == undefined ) {
      cuid = guid();
      setCookie('cuid', cuid);
    }
    yellr.cuid = cuid;

    // lat, lng
    var lat = getCookie('lat'); var lng = getCookie('lng');
    if ( lat == '' || lat == undefined || lng == '' || lng == undefined ) {
      lat = '43.1';
      lng = '-77.3';

      // todo: move into async with location share request dialog
      //setCookie('location_set')
      //setCookie('lat', lat);
      //setCookie('lng', lng);

    }
    yellr.lat = lat;
    yellr.lng = lng;
  },

  build_url: function(base_url) {
    var url = base_url + '?';
    url += 'cuid=' + yellr.cuid + '&';
    url += 'lat=' + yellr.lat + '&';
    url += 'lng=' + yellr.lng + '&';
    url += 'language_code=' + yellr.language_code + '&';
    url += 'platform=' + yellr.platform + '&';
    return url;
  },

  posts_url: '/api/posts',
  posts:[],

  update_posts: function() {
    var url = yellr.build_url(yellr.posts_url);
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(resp) {
        console.log('update_posts()');
        console.log(resp);
        var html = yellr.build_posts_html(resp.posts);
        $('#local-feed').html(html);
      }
    });
  },

  build_posts_html: function(posts) {
    var html = '';
    for( var i=0; i<posts.length; i++ ) {
      var post = posts[i];
      html += '<div class="post">';
      html += '  <div class="container-box">';
      if ( post.media_objects.length == 0 ) {
        html += '<div class="header-blank">Yellr</div>';
      } else {
        switch(post.media_objects[0].media_type) {
          case 'image':
            html += '  <div class="header-media">';
            html += '    <img src="/media/' + post.media_objects[0].preview_filename + '"></img>';
            html += '  </div>';
            break;
          case 'video':
            html += '<video class="embedded-player" controls="" poster="/media/58625b17-787c-46f8-b68b-328681ee3f17.mp4">';
            html += '  <source type="video/mp4" src="/media/58625b17-787c-46f8-b68b-328681ee3f17.mp4"></source>';
            html += '  <!--Fallback for browsers that do not support the <video> element-->';
            html += '  <a href="/media/58625b17-787c-46f8-b68b-328681ee3f17.mp4">Download</a>';
            html += '</video>';
            break;
          case 'audio':
            html += '<audio controls="">';
            html += '  <source type="audio/mp3" src="/media/37f01110-67f4-4968-bc94-6dfb453e9b6e.mp3"></source>';
            html += '  <!--Fallback for browsers that do not support the <audio> element-->';
            html += '  <a href="/media/37f01110-67f4-4968-bc94-6dfb453e9b6e.mp3">Download</a>';
            html += '</audio>';
            break;
          default:
            // shouldn't be here, do nothing
            break;
        };
      }
      html += '  <div class="inside-container">';
      html += '    <div class="small-text">';
      html += '      <span class="right"><i class="fa fa-pencil icon"></i>' + post.creation_datetime + '</span>';
      html += '      <i class="fa fa-user anonymous-user-label icon"></i> Anonymous User';
      html += '    </div>';
      html += '    <div class="column column-tiny">';
      html += '      <div class="votes-container">';
      html += '        <i class="fa fa-caret-up vote-icon up-vote"></i></br>';
      html += '        <div class="up-vote-count">' + post.up_vote_count + '</div>';
      html += '        <div class="down-vote-count">' + post.down_vote_count + '</div>';
      html += '        <i class="fa fa-caret-down vote-icon down-vote"></i></br>';
      html += '      </div>';
      html += '    </div>';
      html += '    <div class="column column-large">';
      html += '      <p class="post-text">' + post.contents + '</p>';
      html += '    </div>';
      html += '  </div>';
      html += '  </div>';
      html += '</div>';
    }
    return html;
  },

  assignments_url: '/api/assignments',
  assignments:[],

  update_assignments: function() {
    var url = yellr.build_url(yellr.assignments_url);
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function(resp) {
        var html = yellr.build_assignments_html(resp.assignments);
        $('#assignments-feed').html(html);
      }
    });
  },

  build_assignments_html: function(assignments) {
    var html = '';
    // todo: build assignments html
    return html;
  }

};


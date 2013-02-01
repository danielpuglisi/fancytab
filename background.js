  var API_KEY = "YOUR API KEY";
  var FLICKR_SET = "72157632647136261";
  var PER_PAGE = "500";
  var shortTimeout = 500;
  var longTimeout = 5 * 60 * 1000;
  var DEBUG = false;

  function log (o) {
    if (DEBUG) console.log(o);
  }

  // CONFIG OPTIONS
  localStorage["useSmallerImages"] = true;
  localStorage["showTitle"] = false;
  //localStorage["showOwner"] = true;

  function fetchPool(poolId, callback) {
    var req = new XMLHttpRequest();
    req.open(
        "GET",
        "http://api.flickr.com/services/rest/?" +
          "method=flickr.groups.pools.getPhotos&" +
          "api_key=" + API_KEY + "&" +
          "group_id=" + poolId + "&" +
          "extras=url_o,path_alias&" +
          "per_page=" + PER_PAGE,
        true);
    req.onload = function () { callback(req) };
    req.send(null);
  }

  function fetchSet(photosetId, callback) {
    var req = new XMLHttpRequest();
    req.open(
        "GET",
        "http://api.flickr.com/services/rest/?" +
          "method=flickr.photosets.getPhotos&" +
          "api_key=" + API_KEY + "&" +
          "photoset_id=" + photosetId + "&" +
          "extras=url_o,path_alias&" +
          "per_page=" + PER_PAGE,
        true);
    req.onload = function () { callback(req) };
    req.send(null);
  }

  function fillCache(req) {
    var photoset = req.responseXML.getElementsByTagName("photoset");
    var photos = req.responseXML.getElementsByTagName("photo");
    log(photos);

    // start adding some new ones
    function againAndAgain() {
      var photoCache = JSON.parse(localStorage["photoCache"])
      addOnePhoto(photos);
      if (photoCache.length < 30) {
        window.setTimeout(againAndAgain, shortTimeout);
      } else {
        removeOnePhoto();
        window.setTimeout(againAndAgain, longTimeout);
      }
    }
    localStorage["photoCache"] = JSON.stringify(new Array());
    againAndAgain();
  }

  function addOnePhoto(aPhotos) {
    var whichPhoto = Math.round(Math.random() * (aPhotos.length - 1));
    var photo = aPhotos[whichPhoto];
    log("adding photo");

    var img = document.createElement("image");
    if (localStorage["useSmallerImages"]
        && photo.getAttribute("width_o") > 1280) {
      img.src = constructImageUrl(photo);
    } else if (photo.getAttribute("url_o") == null || photo.getAttribute("url_o") == "") {
      img.src = constructImageUrl(photo);
    } else {
      img.src = photo.getAttribute("url_o");
    }
    document.body.appendChild(img);
    var photoCache = JSON.parse(localStorage["photoCache"]);
    var cached = {"src": img.src,
                  "title": photo.getAttribute("title"),
                  "id": photo.getAttribute("id"),
                  "ownername": photo.getAttribute("pathalias"),
                  "owner": photo.getAttribute("pathalias")
                  }

    photoCache.push(cached);
    localStorage["photoCache"] = JSON.stringify(photoCache);
  }

  function removeOnePhoto() {
    var photoCache = JSON.parse(localStorage["photoCache"]);
    photoCache.shift();
    localStorage["photoCache"] = JSON.stringify(photoCache);
  }

  // See: http://www.flickr.com/services/api/misc.urls.html
  function constructImageUrl(photo) {
    return "http://farm" + photo.getAttribute("farm") +
        ".static.flickr.com/" + photo.getAttribute("server") +
        "/" + photo.getAttribute("id") +
        "_" + photo.getAttribute("secret") +
        "_b.jpg";
  }

  function init() {
    localStorage["photoCache"] = null;

    var flickr_set = localStorage["flickr_set"];
    if (!flickr_set) {
      flickr_set = FLICKR_SET;
    }

    fetchSet(flickr_set, fillCache);
  }

  init();

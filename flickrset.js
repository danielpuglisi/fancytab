var cachedImages = JSON.parse(localStorage["photoCache"]);
var whichImage = Math.round(Math.random() * (cachedImages.length - 1));
var cached = cachedImages[whichImage];

document.body.style.backgroundImage = "url(" + cached.src + ")";
document.body.style.backgroundSize = "cover";
// var keys = Object.keys(cached);

var byline = document.getElementById("wrapper");
byline.href =
'http://www.flickr.com/photos/' + cached.owner + '/' + cached.id;

if (false && localStorage['showTitle']) {
  var title = document.createElement("span");
  title.setAttribute("class", "title");
  if (cached.title) {
    var escapedTitle = cached.title.replace(
        '&', '&amp;').replace(
          '<', '&lt;').replace(
            '>', '&gt;');
    title.innerHTML = escapedTitle;
  } else {
    title.innerHTML = "untitled";
  }
  byline.appendChild(title);

  if (localStorage['showOwner']) {
    var owner = document.createElement("span");
    owner.setAttribute("class", "owner");
    var escapedOwnername = cached.ownername.replace(
        '&', '&amp;').replace(
          '<', '&lt;').replace(
            '>', '&gt;');
    owner.innerHTML = " by " + escapedOwnername;
    byline.appendChild(owner);
  }
} else {
  byline.innerHTML = "view in photostream";
}

window.onbeforeunload = function () {
  document.body.onmousemove = null;
}

window.setTimeout(function () {
  var mouseX = 0;
  document.body.onmousemove = function (evt) {
    if (mouseX == 0) {
      mouseX = evt.pageX;
    }
    if (!mouseX != evt.pageX) {
      byline.style.opacity = 0.6;
      document.body.onmousemove = null;
    }
  }
}, 200);

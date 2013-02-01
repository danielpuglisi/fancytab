function save_options() {
  var set = document.getElementById("input_flickr_set").value;
  localStorage["flickr_set"] = set;
	
	// Re-init Background Page
	var bg = chrome.extension.getBackgroundPage();
	bg.init();
	
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

function restore_options() {
  var val = localStorage["flickr_set"];
  if (!val) {
    return;
  }  
  document.getElementById("input_flickr_set").value = val;
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
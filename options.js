'use strict';

let tripleClickEnabledCheckbox = document.getElementById('tripleClickEnabled');

chrome.storage.sync.get('tripleClickEnabled', function(data) {
  tripleClickEnabledCheckbox.checked = data.tripleClickEnabled;
});

tripleClickEnabledCheckbox.addEventListener('click', function() {
  var tripleClickEnabled = tripleClickEnabledCheckbox.checked;
  chrome.storage.sync.set({'tripleClickEnabled': tripleClickEnabled}, function() {
    console.log('tripleClickEnabled is ' + tripleClickEnabled);
  })
});

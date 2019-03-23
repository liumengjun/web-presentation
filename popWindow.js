function showPopDiv(content) {
  document.getElementById('popWindow').style.display = 'block';
  document.getElementById('popWindowClose').style.display = 'block';
  document.getElementById('popContent').style.display = 'block';
  document.getElementById('popContentInner').innerHTML = content;
}
function closePopDiv() {
  document.getElementById('popWindow').style.display = 'none';
}
var popWindow = document.getElementById('popWindow');
// alert(popWindow);
if (!popWindow) {
  var domStr = '<div id="popWindow" class="popWindow" style="display: none;">' +
    '  <div id="popContent" class="popContent">' +
    '    <table style="width: 100%;height: 100%;"><tr><td id="popContentInner"></td></tr></table>' +
    '  </div>' +
    '  <div id="popWindowClose" class="popWindowClose" onclick="document.getElementById(\'popWindow\').style.display = \'none\'" style="display: none;cursor:pointer;text-decoration: none;">' +
    '    ╳' +
    '  </div>' +
    '</div>';
  document.body.innerHTML += (domStr);
  popWindow = document.getElementById('popWindow');
}
// alert(document.getElementById('popWindow'));

function popShowSelectedContent() {
  var selObj = window.getSelection();
  if (!selObj.anchorNode) {
    return;
  }
  var childNodes = selObj.anchorNode.childNodes;
  var img = null;
  for (var ele of childNodes) {
    if (ele.tagName == 'IMG') {
      img = ele;
      break;
    }
  }
  if (img) {
    // console.log(img.outerHTML);
    showPopDiv(img.outerHTML);
    return;
  }
  var text = selObj.toString().trim();
  if (text) {
    // console.log(text);
    showPopDiv(text);
    return;
  }
}

window.addEventListener('click', function (evt) {
  if (evt.detail === 3) {
    // alert("triple click!");
    // console.log('triple click!');
    popShowSelectedContent();
  }
});

/**
 * 键盘监听事件
 * Alt + P: pop show selected content
 * Esc: close pop div
 */
var lastAltKey = false;
var altKeyTimeStamp = 0;
window.addEventListener('keyup', function (evt) {
  // console.log(evt);
  if (evt.target.tagName !== 'BODY') {
    return;
  }
  if (evt.keyCode === 27) { // Esc
    if (popWindow.style.display !== 'none') {
      closePopDiv();
    }
    return;
  }
  if (evt.keyCode === 18) { // Alt
    lastAltKey = true;
    altKeyTimeStamp = evt.timeStamp;
    return;
  }
  if (evt.keyCode === 80) { // p
    if (lastAltKey && (evt.timeStamp - altKeyTimeStamp < 300)) {
      if (popWindow.style.display !== 'none') {
        closePopDiv();
      } else {
        popShowSelectedContent();
      }
    }
  }
  lastAltKey = false;
  altKeyTimeStamp = 0;
});

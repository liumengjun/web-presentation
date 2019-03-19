function showPopDiv(content) {
  document.getElementById('popWindow').style.display = 'block';
  document.getElementById('popWindowClose').style.display = 'block';
  document.getElementById('popContent').style.display = 'block';
  document.getElementById('popContentInner').innerHTML = content;
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
}
// alert(document.getElementById('popWindow'));

window.addEventListener('click', function (evt) {
  if (evt.detail === 3) {
    // alert("triple click!");
    console.log('triple click!');
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
      console.log(img.outerHTML);
      showPopDiv(img.outerHTML);
      return;
    }
    var text = selObj.toString().trim();
    if (text) {
      console.log(text);
      showPopDiv(text);
      return;
    }
  }
});

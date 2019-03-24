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

let allBodyEles = document.body.children;
var slideLevel = 1;
var toSlideElementList = [];
var currentSlideShowIndex = 0;
if (allBodyEles.length <= 3) {
  slideLevel = 2;
}
for (var i = 0; i < allBodyEles.length; i++) {
  var curEle = allBodyEles[i];
  if (curEle.classList.contains('popWindow')) {
    break;
  }
  if (slideLevel == 2) {
    if (curEle.childElementCount) {
      concatToSlideElementList(curEle.children);
    } else {
      pushToSlideElementList(curEle);
    }
  } else {
    pushToSlideElementList(curEle);
  }
}

function concatToSlideElementList(elements) {
  for (var ele of elements) {
    pushToSlideElementList(ele);
  }
}

function pushToSlideElementList(ele) {
  if (ele.tagName === 'UL' || ele.tagName === 'OL' || ele.tagName === 'DL') {
    concatToSlideElementList(ele.children);
  } else {
    toSlideElementList.push(ele);
  }
}

function showSlideContent() {
  showPopDiv(toSlideElementList[currentSlideShowIndex].outerHTML);
}

function showNextSlideContent() {
  if (currentSlideShowIndex >= toSlideElementList.length - 1) {
    return;
  }
  currentSlideShowIndex++;
  showSlideContent();
}

function showPreviousSlideContent() {
  if (currentSlideShowIndex <= 0) {
    return;
  }
  currentSlideShowIndex--;
  showSlideContent();
}

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
    chrome.storage.sync.get('tripleClickEnabled', function(data) {
      if(data.tripleClickEnabled){
        popShowSelectedContent();
      }
    });
  }
});

/**
 * 鼠标滚轮事件
 */
window.addEventListener('mousewheel', function (evt) {
  // console.log(evt);
  if (popWindow.style.display !== 'none') {
    if (evt.deltaY < 0) {
      showPreviousSlideContent();
    } else {
      showNextSlideContent();
    }
  }
});

/**
 * 键盘监听事件
 * Alt + P: pop show selected content
 * Alt + S: start slide show
 * Esc: close pop div
 */
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
  if (evt.altKey && evt.keyCode === 80) { // Alt + P
    if (popWindow.style.display !== 'none') {
      closePopDiv();
    } else {
      popShowSelectedContent();
    }
  }
  if (evt.altKey && evt.keyCode === 83) { // Alt + S
    if (popWindow.style.display === 'none') {
      showSlideContent();
    }
  }
});

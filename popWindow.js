function showPopDiv(content) {
  document.getElementById('popWindow').style.display = 'block';
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
    '    <div id="popContentInner" class="popContentInner"></div>' +
    '  </div>' +
    '  <div id="popWindowClose" class="popWindowClose" onclick="document.getElementById(\'popWindow\').style.display = \'none\'" style="cursor:pointer;text-decoration: none;">' +
    '    ╳' +
    '  </div>' +
    '</div>';
  document.body.innerHTML += (domStr);
  popWindow = document.getElementById('popWindow');
}
// alert(document.getElementById('popWindow'));

var slideLevel = 1;
if (document.body.childElementCount <= 3) {
  slideLevel = 2;
}
var toSlideElementList = [];
collectToSlideContents(slideLevel, 0, document.body.childNodes);

function collectToSlideContents(maxLevel, curLevel, nodeList) {
  for (var i = 0; i < nodeList.length; i++) {
    var curNode = nodeList[i];
    if (curNode.nodeType === 3) { // #text
      var text = curNode.textContent.trim();
      if (text !== '') {
        toSlideElementList.push(curNode);
      }
      continue;
    }
    if (curNode.nodeType !== 1) {
      continue;
    }
    // now curNode is Element
    if (curNode.tagName === 'BR' || curNode.tagName === 'HR') {
      continue;
    }
    if (curNode.classList.contains('popWindow')) {
      break;
    }
    if (curLevel >= maxLevel) {
      pushToSlideElementList(curNode);
    } else {
      var childNodes = curNode.childNodes;
      if (childNodes && childNodes.length) {
        collectToSlideContents(maxLevel, curLevel + 1, childNodes);
      } else {
        pushToSlideElementList(curNode);
      }
    }
  }
}

function pushToSlideElementList(ele) {
  if (ele.tagName === 'UL' || ele.tagName === 'OL' || ele.tagName === 'DL') {
    collectToSlideContents(0, 0, ele.childNodes);
  } else {
    var hasImg = false;
    for (var childEle of ele.children) {
      if (childEle.tagName === 'IMG') {
        hasImg = true;
        break;
      }
    }
    if (hasImg) {
      collectToSlideContents(0, 0, ele.childNodes);
    } else {
      toSlideElementList.push(ele);
    }
  }
}

var currentSlideShowIndex = 0;

function showSlideContent() {
  var node = toSlideElementList[currentSlideShowIndex];
  showPopDiv(node.outerHTML || node.textContent.trim());
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
    updateSlideIndex(img);
    return;
  }
  var text = selObj.toString().trim();
  if (text) {
    // console.log(text);
    showPopDiv(text);
    updateSlideIndex(selObj.anchorNode);
    return;
  }
}

function updateSlideIndex(targetNode) {
  var idx = toSlideElementList.findIndex(function (n) {
    return n === targetNode;
  });
  if (idx !== -1) {
    currentSlideShowIndex = idx;
  } else if (targetNode.parentNode) {
    updateSlideIndex(targetNode.parentNode);
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

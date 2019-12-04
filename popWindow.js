const popWindowId = 'popWindowLmj1e9q2hVy';
const containerKeyPrefix = 'show_container:';
function showPopDiv(content) {
  document.getElementById(popWindowId).style.display = 'block';
  document.getElementById(popWindowId+'ContentInner').innerHTML = content;
}
function closePopDiv() {
  document.getElementById(popWindowId).style.display = 'none';
}
var popWindow = document.getElementById(popWindowId);
if (!popWindow) {
  var domStr = '  <div id="'+popWindowId+'Content" class="'+popWindowId+'Content">' +
    '    <div id="'+popWindowId+'ContentInner" class="'+popWindowId+'ContentInner"></div>' +
    '  </div>' +
    '  <div id="'+popWindowId+'Close" class="'+popWindowId+'Close" onclick="document.getElementById(\''+popWindowId+'\').style.display = \'none\'" style="cursor:pointer;text-decoration: none;">' +
    '    ╳' +
    '  </div>';
  // create element such as '<div id="popWindow" class="popWindow" style="display: none;">' + domStr + '</div>'
  var newDiv = document.createElement('div');
  newDiv.id = popWindowId;
  newDiv.className = popWindowId;
  newDiv.style.display = 'none';
  newDiv.innerHTML = domStr;
  document.body.appendChild(newDiv);
  popWindow = document.getElementById(popWindowId);
}

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
    if (curNode.tagName === 'BR' || curNode.tagName === 'HR' || curNode.tagName === 'SCRIPT') {
      continue;
    }
    if (curNode.classList.contains(popWindowId)) {
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

function _getContentNode() {
  let innerCon = document.getElementById(popWindowId + 'ContentInner');
  let innerNodes = innerCon.childNodes;
  if (!innerNodes || innerNodes.length != 1 || !innerNodes[0].style) {
    return innerCon;
  }
  return innerNodes[0];
}

function _getFontSize(node) {
  let fontSize = node.style.fontSize || node.computedStyleMap().get('font-size');
  return fontSize.value || parseInt(fontSize);
}

function increaseFontSize() {
  let innerNode = _getContentNode();
  innerNode.style.fontSize = (_getFontSize(innerNode) + 1) + 'px';
}

function decreaseFontSize() {
  let innerNode = _getContentNode();
  innerNode.style.fontSize = (_getFontSize(innerNode) - 1) + 'px';
}

function getCustomizedContainer(conf) {
  var id = conf.id;
  var tagName = conf.tagName;
  var classes = conf.classes;
  if (id) {
    return document.getElementById(id);
  }
  if (!tagName) {
    console.log('select none');
    return false;
  }
  var elements = document.getElementsByTagName(tagName);
  if (!elements.length) {
    console.log('select none');
    return false;
  }
  if (!classes) {
    return elements[0];
  }
  var classesArr = classes.split(' ').filter(c => c.toLowerCase());
  var matchedEles = [];
  for (var ele of elements) {
    var classList = [];
    for (var val of ele.classList) {
      classList.push(val.toLowerCase());
    }
    var matchClasses = true;
    for (var c of classesArr) {
      matchClasses = matchClasses && classList.includes(c);
    }
    if (matchClasses) {
      matchedEles.push(ele);
    }
  }
  if (!matchedEles.length) {
    console.log('select none');
    return false;
  }
  return matchedEles[0];
}

function reCollectSlideElementsByContainer(container) {
  if (!container) {
    console.log('select none');
    return false;
  }
  console.log('set container{id: ' + container.id + ', tag: ' + container.tagName + ', classes: ' + container.className + '}');
  toSlideElementList.length = 0;
  collectToSlideContents(slideLevel, 0, container.childNodes);
  currentSlideShowIndex = 0;
  return true;
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

// 根据之前设置的 show container 配置，初始化 slide 内容
let containerKey = containerKeyPrefix + location.host;
chrome.storage.sync.get(containerKey, function (data) {
  let conf = data[containerKey];
  console.log('get', containerKey, 'is', conf);
  if (!conf) return;
  let container = getCustomizedContainer(conf);
  reCollectSlideElementsByContainer(container);
});

window.addEventListener('click', function (evt) {
  if (evt.detail === 3) {
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
  if (evt.shiftKey && evt.keyCode === 38 || evt.keyCode === 37) { // (Shift + ↑) || ←
    if (popWindow.style.display !== 'none') {
      showPreviousSlideContent();
    }
  }
  if (evt.shiftKey && evt.keyCode === 40 || evt.keyCode === 39) { // (Shift + ↓) || →
    if (popWindow.style.display !== 'none') {
      showNextSlideContent();
    }
  }
  if (evt.altKey && evt.keyCode === 187) { // Alt + '+'
    if (popWindow.style.display !== 'none') {
      increaseFontSize();
    }
  }
  if (evt.altKey && evt.keyCode === 189) { // Alt + '-'
    if (popWindow.style.display !== 'none') {
      decreaseFontSize();
    }
  }
});

/**
 * CustomEvent('set_container'), 设置 show container
 */
window.addEventListener('set_container', function (evt) {
  // console.log(evt);
  console.log(evt.detail);
  let container = getCustomizedContainer(evt.detail);
  return reCollectSlideElementsByContainer(container);
});

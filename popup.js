'use strict';

console.log("popup.js");

let inContainerId = document.getElementById('in_container_id');
let inContainerTag = document.getElementById('in_container_tag');
let inContainerClasses = document.getElementById('in_container_classes');
let btnContainerConfirm = document.getElementById('btn_container_confirm');

btnContainerConfirm.onclick = function (e) {
    let id = inContainerId.value.trim();
    let tagName = inContainerTag.value.trim();
    let classes = inContainerClasses.value.trim();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: 'var event = new CustomEvent("set_container", { detail:'
                    + ' {id:"' + id + '",tagName:"' + tagName + '",classes:"' + classes + '"}});'
                    + 'window.dispatchEvent(event);'
            },
            function (results) {
                console.log(results);
            }
        );
    });
};

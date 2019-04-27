'use strict';

console.log("popup.js");

const containerKeyPrefix = 'show_container:';

let inContainerId = document.getElementById('in_container_id');
let inContainerTag = document.getElementById('in_container_tag');
let inContainerClasses = document.getElementById('in_container_classes');
let btnContainerConfirm = document.getElementById('btn_container_confirm');

chrome.tabs.getSelected(function (tab) {
    if (!tab) return;
    let containerKey = containerKeyPrefix + new URL(tab.url).host;
    chrome.storage.sync.get(containerKey, function (data) {
        let conf = data[containerKey];
        console.log('get', containerKey, 'is', conf);
        if (!conf) return;
        inContainerId.value = conf.id || '';
        inContainerTag.value = conf.tagName || '';
        inContainerClasses.value = conf.classes || '';
    });
});

btnContainerConfirm.onclick = function (e) {
    let id = inContainerId.value.trim();
    let tagName = inContainerTag.value.trim();
    let classes = inContainerClasses.value.trim();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let conf = { 'id': id, 'tagName': tagName, 'classes': classes };
        chrome.tabs.executeScript(
            tabs[0].id,
            {
                code: 'var event = new CustomEvent("set_container", { detail:' + JSON.stringify(conf) + '});'
                    + 'window.dispatchEvent(event);'
            },
            function (results) {
                console.log(results);
            }
        );
        let containerKey = containerKeyPrefix + new URL(tabs[0].url).host;
        chrome.storage.sync.set({ [containerKey]: conf }, function () {
            console.log('set', containerKey, 'is', conf);
        });
    });
};

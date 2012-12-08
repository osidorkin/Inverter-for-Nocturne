function cssCode() {
    return localStorage.disabled ?
        "img, video, embed {  -webkit-filter: none; } ":
        "img, video, embed {  -webkit-filter: invert(100%) grayscale(100%); } ";
}
function insertCSS(tabId) {
    chrome.tabs.insertCSS(tabId, {
        code: cssCode(),
        allFrames: true,
        runAt: "document_start"
    });
}
function menuTitle() {
    return localStorage.disabled ? "Switch to Night" : "Switch to Day";
}
function switchMode(info, tab) {
    localStorage.disabled = localStorage.disabled ? "" : "disabled";
    chrome.contextMenus.update(menu, {title: menuTitle()});
    updateTabs();
}
menu = chrome.contextMenus.create({"title": menuTitle(), id: "nocturn"});
chrome.contextMenus.onClicked.addListener(switchMode);

chrome.tabs.onUpdated.addListener(function(tabId, info) {
//  if (info.status && info.status == "complete")
        insertCSS(tabId);
//  else if (info.url && info.url.slice(0,4) == "http") 
//      insertCSS(tabId);
});
function updateTabs() {
    chrome.tabs.query({}, function (tabs) {
        for (var i=0; i<tabs.length; ++i) {
            var tab = tabs[i];
            if (tab.url && tab.url.slice(0,4) == "http")
                insertCSS(tab.id);
        }
    })
}
updateTabs();


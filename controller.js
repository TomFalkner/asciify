function sayHi(info, tab){
    //var myString = 'var impliedglobal = "howdy ' + info.srcUrl + '";';
    var myString = 'var impliedglobal = "howdy"';

    chrome.tabs.executeScript({
        "code": myString 
    }, function() {
        chrome.tabs.executeScript({"file": "alert.js"});
    });
}

chrome.contextMenus.onClicked.addListener(sayHi);
chrome.contextMenus.create({"title": "ASCII-fy", "contexts":["image"], "id": "temp"});

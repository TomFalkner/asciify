function sayHi(info, tab){
    console.log('click url = ' + info.srcUrl);
}

//chrome.contextMenus.onClicked.addListener(sayHi);
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var imgsrc = info.srcUrl;
    chrome.tabs.executeScript({
        code:'var myColor = "yellow"; var mySource = "' + imgsrc + '";' 
    }, function(){
        chrome.tabs.executeScript({
            file:'alert.js'
        });
    });
});
chrome.contextMenus.create({"title": "ASCII-fy", "contexts":["image"], "id": "temp"});

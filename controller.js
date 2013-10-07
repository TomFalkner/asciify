chrome.contextMenus.onClicked.addListener(function(info, tab) {
    var imgsrc = info.srcUrl;
    console.log(imgsrc);
    chrome.tabs.executeScript({
        code:'var target = "' + imgsrc + '";' 
    }, function(){
        chrome.tabs.executeScript({
            file:'ascii-apocalypse.js'
        });
    });
});
chrome.contextMenus.create({"title": "ASCII-fy", "contexts":["image"], "id": "temp"});

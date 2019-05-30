   /**
     * @function firstDataLoad
     * @description Loads First Default Sites Data 
     * Special sites that user can be visit more often
     * This list for init and grows while users add new sites 
     */
function firstDataLoad(){
    const storageAppKey = "page-align-sites";
    let siteActionLibDATA = {
      googleSearch: {
        keysForMatch: ['https://www.google', '/search?'],
        marginValue: "15",
        name: "googleSearch"
      },
      bingSearch: {
        keysForMatch: ['https://www.bing', '/search?'],
        marginValue: "15",
        name: "bingSearch"
      }
    };
    chrome.storage.sync.set({
        "page-align-sites": siteActionLibDATA
    });
}
/**
 * LISTENER
 * @description Shows popup when contentjs loaded
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo == "showPageAction")
    {   var tabID=sender.tab.id;
        chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
            //chrome.pageAction.show(tabs[0].id); 
            chrome.pageAction.show(tabID);
        });
    }
});
/**
 * LISTENER
 * @description Loads the first default site datas to the storage 
 * when extention installed
 */
chrome.runtime.onInstalled.addListener(function() {
    firstDataLoad();
});
/**
 * LISTENER
 * @description Triggers popupJS when url changed
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status==="complete"&&tab.url.substring(0,4)==="http"){
        chrome.runtime.sendMessage({todo: "urlChangedActions",urlNew:tab.url});
    }
});   







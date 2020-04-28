
     /**
      * @function doMarginAndSaveSite
      * @description Trigering Margin listener with values in content.js 
      * And Save current site margin value to its object
      * 
      * Getting main site saved data list
      * Checkin the site, Did configure for use
      * If it is  checking is there new value  or run with save data about current site
      * Triggers listener with {todo:"giveMargin"} in context.js and Manipulates DOM
      * At the final method save the used value into the saved data list
      * @global storageAppKey = "page-align-sites" is saved data list holder key on storage.
      * @param {string} marginValueNew 
      */    
     function doMarginAndSaveSite(tab,marginValueNew) {
         chrome.storage.sync.get('page-align-sites', function (saveSitesDatas) {
                      // Main storage name 
                     const storageAppKey = "page-align-sites";
                     var urlCurrent = tab.url;
                    //Tight doMarginAndSaveSite()                     
                    function sendMarginToListenerGiveMargin(valueMargin) {
                        chrome.tabs.sendMessage(tab.id, {
                            todo: "giveMargin",
                            marginValue: valueMargin + "%"
                        })
                    }
                     var isResultItemOrFalse = takeSiteItemOnList(saveSitesDatas[storageAppKey], urlCurrent);
                     if (isResultItemOrFalse.result === true) {
                         //Tight doMarginAndSaveSite() 
                         function decideMarginSavedOrNewValue(valueNew) {
                             var result = "15";
                             if (valueNew !== undefined && valueNew !== null) {
                                 result = valueNew;
                             } else {
                                 var marginFromStore = isResultItemOrFalse.item.marginValue;
                                 result = marginFromStore;
                             }
                             return result;
                         }                     
                         //Tight doMarginAndSaveSite()
                         function saveChangedValueToList() {
                             var siteList = Object.assign({}, (saveSitesDatas[storageAppKey]));
                             var siteItem = Object.assign({}, (isResultItemOrFalse.item));
                             siteItem.marginValue = actionMarginValue;
                             siteList[siteItem.name] = Object.assign({}, (siteItem));
                             chrome.storage.sync.set({
                                 'page-align-sites': Object.assign({}, (siteList))
                             });
                         }


                         // RUN FLOW
                         var actionMarginValue = decideMarginSavedOrNewValue(marginValueNew);
                         sendMarginToListenerGiveMargin(actionMarginValue);
                         saveChangedValueToList();
                     }
                     else{
                        sendMarginToListenerGiveMargin(marginValueNew)
                     }
                 });
     }

     /**
      * TODO will move to helperCommon
      * Checks List of booleans, Are they all true
      * @param {Array-Boolean} boolValuesAr ["siteURLKeyword1","siteURLKeyword2"]
      * @returns boolean
      */
     function isBoolListAllTrue(boolValuesAr) {
         let res = true;
         boolValuesAr.forEach(value => {
             if (value === false) {
                 res = false;
             }
         });
         return res;
     }
     /**
      * TODO will move to helperCommon
      * Checks Site added or not
      * @param {string} siteUrl 
      * @returns {item:item/null,result:true/false}
      */
     function takeSiteItemOnList(dataListSites, urlCurrent) {
         let resultz = {
             item: null,
             result: false
         };
         _.each(dataListSites,
             function (item) {
                 let cond = [];
                 item.keysForMatch.forEach(kFM => {
                     let res = urlCurrent.includes(kFM);
                     cond.push(res);
                 });
                 var matchRes = isBoolListAllTrue(cond);
                 if (matchRes === true) {
                     resultz = {
                         item: item,
                         result: true
                     };
                 }
             });
         return resultz;
     }

     /**
      * @function firstDataLoad
      * @description Loads First Default Sites Data 
      * Special sites that user can be visit more often
      * This list for init and grows while users add new sites 
      */
     function firstDataLoad() {
         const storageAppKey = "page-align-sites";
         const storageAppKeyConfig = "page-align-sites-config";
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
         let config={
           animate:true
         };
         chrome.storage.sync.set({
             "page-align-sites": siteActionLibDATA,
             "page-align-sites-config":config
         });
     }
     /**
      * LISTENER
      * @description Shows popup when contentjs loaded
      */
     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
         if (request.todo == "showPageAction") {
             var tabID = sender.tab.id;
             chrome.tabs.query({
                 active: true,
                 currentWindow: true
             }, function (tabs) {
                 //chrome.pageAction.show(tabs[0].id); 
                 chrome.pageAction.show(tabID);
             });
         }
         if (request.todo == "doMarginAndSaveSite") {
             doMarginAndSaveSite(
                 request.tab,
                 (request.marginNew === undefined) ? null : request.marginNew
             );
         }
         //When URL changed eventpagejs trigger this 
         if (request.todo === "urlChangedActions") {
             doMarginAndSaveSite( request.tab);
         }
        
     });
     /**
      * LISTENER
      * @description Loads the first default site datas to the storage 
      * when extention installed
      */
     chrome.runtime.onInstalled.addListener(function () {
         firstDataLoad();
     });
     /**
      * LISTENER
      * @description Triggers popupJS when url changed
      */
     chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
         if (changeInfo.status === "complete" && tab.url.substring(0, 4) === "http") {
             doMarginAndSaveSite(tab);           
         }
     });
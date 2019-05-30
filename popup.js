/**
 * @class Page Align Center PopupJS
 * @description The extention makes center the page that added/configured in saved site data list
 * At First extension works with default loaded sites like goole and bing at beginning
 * user can add and specify more site to the extension
 * Main action is giving margin left and right ratio
 * Difference is working diffent margins on different site that user can configure dynamicly
 */
$(function () {
    // Main storage name 
    const storageAppKey = "page-align-sites";
    // When user click the extension icon this method will load latest info and do configuration 
    doMarginAndSaveSite();
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
    function doMarginAndSaveSite(marginValueNew){
        chrome.storage.sync.get('page-align-sites', function (saveSitesDatas) {
                chrome.tabs.query({
                  active: true,
                  currentWindow: true
                },
                function (tabs) {
                        var urlCurrent=tabs[0].url;
                        var isResultItemOrFalse = takeSiteItemOnList(saveSitesDatas[storageAppKey],urlCurrent);
                        if (isResultItemOrFalse.result === true) {   
                          //Tight doMarginAndSaveSite() 
                          function decideMarginSavedOrNewValue(valueNew){
                              var result="15";
                              if(valueNew!==undefined){
                                result=valueNew;
                                setRangeSliderValue(valueNew);                            
                              }else{             
                                var marginFromStore=isResultItemOrFalse.item.marginValue; 
                                result=marginFromStore;
                                setRangeSliderValue(marginFromStore);                        
                              }  
                              return result; 
                          }
                          //Tight doMarginAndSaveSite()                     
                          function sendMarginToListenerGiveMargin(valueMargin){
                            chrome.tabs.sendMessage(tabs[0].id, {
                              todo: "giveMargin",   
                              marginValue:valueMargin+"%"
                            })
                          }
                          //Tight doMarginAndSaveSite()
                          function saveChangedValueToList(){
                            var siteList=  Object.assign({}, (saveSitesDatas[storageAppKey]));
                            var siteItem=Object.assign({}, (isResultItemOrFalse.item));
                            siteItem.marginValue=actionMarginValue;
                            siteList[siteItem.name]=Object.assign({}, (siteItem));
                            console.log("up to date version");
                            console.log(siteList);
                            chrome.storage.sync.set({'page-align-sites':Object.assign({}, (siteList))});
                          }


                          // RUN FLOW
                          var actionMarginValue=decideMarginSavedOrNewValue(marginValueNew);
                          sendMarginToListenerGiveMargin(actionMarginValue);
                          saveChangedValueToList();
                        }
                });
        }) ;
    }
    /**
     * LISTENER
     * Popup Listener for contentjs and eventPage(background)js
     * Currently listens first showingPage and  urlChangedActions-updated 
     * and calling the method name doMarginAndSaveSite with NO values.
     * @param {object} request.todo  ["urlChangedActions","showPageAction"] listens
     */
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      //When URL changed eventpagejs trigger this 
      if (request.todo === "urlChangedActions") {
        doMarginAndSaveSite();
      }
      //When first page complete on content.js eventpage trigger this
      if (request.todo === "showPageAction") {      
        doMarginAndSaveSite();
      }
    });
    /**
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
    /**SLIDER Initialize*/
    var elem = document.querySelector('input[type="range"]');
    var rangeValue = function () {
      var newValue = elem.value;
      var target = document.querySelector('.value');
      target.innerHTML = newValue;
    }
    elem.addEventListener("input", rangeValue);
    /**
     * @function SliderRangeChange
     * @description Listens slider and when it's changed triggers doMarginAndSaveSite with New Value of margin
    */
    $('input[type="range"]').on('change keyup', function (valueMargin) {
      var marginVal = $('#range-value-id').html();
      var styleMargin = marginVal;
      doMarginAndSaveSite(styleMargin);
    });  
    /**
     * @function setRangeSliderValue
     * @description Changes Range Slider Value
     * WARN updates div html text and input value
     * @param {string} value contains numbers for margin like "15"
     */
    function setRangeSliderValue(value) {
      $('#range-value-id').html(value);
      $('input[type="range"]').val(value);
    }
});
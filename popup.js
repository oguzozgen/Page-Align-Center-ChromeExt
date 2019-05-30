
/**
 * @class Page Align Center PopupJS
 * @description The extention makes center the page that added/configured in saved site data list
 * At First extension works with default loaded sites like goole and bing at beginning
 * user can add and specify more site to the extension
 * Main action is giving margin left and right ratio
 * Difference is working diffent margins on different site that user can configure dynamicly
 */
$(function () {
    function sendOnMessageSiteMenuItem(){
      chrome.storage.sync.get('page-align-sites', function (saveSitesDatas) {
        chrome.tabs.query({
          active: true,
          currentWindow: true
      }, function (tabs) {
      
              // Main storage name 
              const storageAppKey = "page-align-sites";
              var urlCurrent = tabs[0].url;
              var isResultItemOrFalse = takeSiteItemOnList(saveSitesDatas[storageAppKey], urlCurrent);
              if (isResultItemOrFalse.result === true) {
                setRangeSliderValue(isResultItemOrFalse.item.marginValue);
              }
          });
      });
    }
    sendOnMessageSiteMenuItem();
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


  /**
   * LISTENER
   * Popup Listener for contentjs and eventPage(background)js
   * Currently listens first showingPage and  urlChangedActions-updated 
   * and calling the method name doMarginAndSaveSite with NO values.
   * @param {object} request.todo  ["urlChangedActions","showPageAction"] listens
   */
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //When first page complete on content.js eventpage trigger this
    if (request.todo === "updateSliderWithSiteItem") {
      setRangeSliderValue(request.updateSliderValue)
      //doMarginAndSaveSite();
    }
  });
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
    chrome.tabs.query({
      active: true,
      currentWindow: true
    },
    function (tabs) {
      var marginVal = $('#range-value-id').html();
      var styleMargin = marginVal;
      chrome.runtime.sendMessage({
        todo: "doMarginAndSaveSite",
        marginNew: styleMargin,
        tab:tabs[0]
      });
    });
  
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
//Common methods class defining
// Page Change-Route inside the Helper
var helperCommon = new helperCommon();
//Contains Adding New Site Methods
var addNewSiteLibIns = new addNewSiteLib();
/**
 * @class Page Align Center PopupJS
 * @description The extention makes center the page that added/configured in saved site data list
 * At First extension works with default loaded sites like goole and bing at beginning
 * user can add and specify more site to the extension
 * Main action is giving margin left and right ratio
 * Difference is working diffent margins on different site that user can configure dynamicly
 */
$(function () {
  let animateFirstMissBool=false;
  $('[name="settings-view-animate-switch"]').bootstrapSwitch({
  onSwitchChange: function(e, state) {
      //$('#hideableDiv').toggle(state);
      chrome.storage.sync.get('page-align-sites-config', function (configDatas) {
        configDatas["page-align-sites-config"].animate=state;
        chrome.storage.sync.set({"page-align-sites-config":  Object.assign({}, (configDatas["page-align-sites-config"]))});
        if(animateFirstMissBool){
          helperCommon.notify('Animate Changed','success');
        }
        animateFirstMissBool=true;
      });
    }

  });
  chrome.storage.sync.get('page-align-sites-config', function (configDatas) {
    $('[name="settings-view-animate-switch"]').bootstrapSwitch('state',configDatas['page-align-sites-config'].animate);
  });

  /**
   * TODO waiting to get current body margin value and assign to popup values
   * @param {object} tabs 
   */
  function useCurrentBodyMarginToSlider(tabs) {

  }
  /**
   * Runs When popup clicked, updates popup inside slider values-texts
   * if site saved before fills with saved values
   * otherwise using current body margin-left/right value
   */
  function sendOnMessageSiteMenuItem() {
    chrome.storage.sync.get('page-align-sites', function (saveSitesDatas) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function (tabs) {
        // Main storage name 
        const storageAppKey = "page-align-sites";
        var urlCurrent = tabs[0].url;
        var isResultItemOrFalse = helperCommon.takeSiteItemOnList2(saveSitesDatas[storageAppKey], urlCurrent);
        if (isResultItemOrFalse.result === true) {
          var bestMatchResult= helperCommon.takeBestMatchResult(isResultItemOrFalse);
          setRangeSliderValue(isResultItemOrFalse.item[bestMatchResult.index].marginValue);
        } else {
          useCurrentBodyMarginToSlider()
        }
      });
    });
  }
  //Runs When popup clicked, updates popup inside slider values-texts
  sendOnMessageSiteMenuItem();
  /**
   * LISTENER
   * @param {object} request.todo  ["urlChangedActions","showPageAction"] listens
   */
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  });
  /**SLIDER Initialize onChange*/
  var elem = document.querySelector('input[type="range"]');
  var rangeValue = function () {
    var newValue = elem.value;
    var target = document.querySelector('.value');
    target.innerHTML = newValue;
  }
  elem.addEventListener("input", rangeValue);
  /**
   * @function SliderRangeChange
   * @description Listens slider and when it's changed triggers sendMessage->doMarginAndSaveSite with New Value of margin
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
          tab: tabs[0]
        });
      });
  });
  /**
   * @function setRangeSliderValue slider&text update
   * @description Changes Range Slider Value
   * WARN updates div html text and input value
   * @param {string} value contains numbers for margin like "15"
   */
  function setRangeSliderValue(value) {
    $('#range-value-id').html(value);
    $('input[type="range"]').val(value);
  }
  /**
   * LISTENER
   * Main Page Action
   * Listens "Add New Site" button on main/main-view-id page
   * WARN pages listed in helperCommon 
   */
  $('#add-site-btn-id').on('click', function () {
    helperCommon.pageChanger("addNew");
    addNewSiteLibIns.loadAddSiteAutoValues();
  });
  /**
   * LISTENER
   * Adding Page Action
   * Listens "Add New Site" button on addNew/add-site-view-id page
   * WARN pages listed in helperCommon 
   */
  $('#add-site-submit-id').on('click', function () {
    helperCommon.pageChanger("main");
    helperCommon.notify('Saved','success');
    addNewSiteLibIns.addNewSiteOnList();
  });
    /**
   * LISTENER
   * Adding Page Action
   * adds new keyword record input into the list 
   */
  $('#add-site-new-keyword-button-id').on('click', function () {
    addNewSiteLibIns.addSiteAppendNewKeywordListItem()
  });
    /**
   * LISTENER
   * Adding Page Action
   *  Listens "Back" button on addNew/add-site-view-id page
   * Clears inputs and turnin back to Main page
   */
  $('#add-site-view-back-btn-id').on('click', function () {   
    helperCommon.pageChanger("main");
    addNewSiteLibIns.clearAddSiteForm();
  });   
  /**
  *LISTENER
  * opens settings view
  */
  $('#main-settings-btn-id').on('click', function () {   
    helperCommon.pageChanger("settings");
  }); 
  /**
  *LISTENER
  * return settings view to main view
  */
  $('#settings-view-back-btn-id').on('click', function () {   
    helperCommon.pageChanger("main");
  });   
});
  
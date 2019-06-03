/**
 * @class addNewSiteLib
 * @description This clas contains Adding New Page 
 * used methods that are only for  adding page 
 */
function addNewSiteLib() {

}

addNewSiteLib.prototype.constructor = addNewSiteLib;
/**
 * @function loadAddSiteAutoValues loads defaults
 * @description when user clicked the add new site on main page
 * this method runs after the show "Add New Site" page.
 * And assigns site url
 *  WARN if there are parameters in url, this method crop domain
 * and parameters into the url then imports the resukt as a new keyword
 * 
 */
addNewSiteLib.prototype.loadAddSiteAutoValues = function () {
  var self = this;
  chrome.tabs.query({
      active: true,
      currentWindow: true
    },
    function (tabs) {
      var url = tabs[0].url;
      var urlSplittedBySlash = url.split('/', );
      var websiteWithoutRoutes = urlSplittedBySlash[2];
      var websiteAfterTheDomain = urlSplittedBySlash[3];
      var keyWithOutParams = websiteAfterTheDomain.indexOf('?');
      if (keyWithOutParams > 0) {
        var autoSiteFirtsKeyWord = websiteAfterTheDomain.substring(0, keyWithOutParams);
        self.addSiteAppendNewKeywordListItem(autoSiteFirtsKeyWord);
        self.addSiteAppendNewKeywordListItem();
        $('#add-new-site-form-input-name-id').val(websiteWithoutRoutes);
        $('#add-new-site-form-input-url-id').val(websiteWithoutRoutes);
      } else {
        self.addSiteAppendNewKeywordListItem();
        $('#add-new-site-form-input-name-id').val(websiteWithoutRoutes);
        $('#add-new-site-form-input-url-id').val(websiteWithoutRoutes);
      }
    });
};
/**
 * @function addSiteAppendNewKeywordListItem list item and appending
 * @description Basic list item and appending to the list for add new site page's 
 * keywords list.
 * if there is value, this method adds value to its inside input's value then append to the list
 * @param {string} value keyword text
 */
addNewSiteLib.prototype.addSiteAppendNewKeywordListItem = function (value) {
  if (value === undefined) {
    value = "";
  }
  var html = `
        <li class="list-group-item no-margin no-padding ul-li-list-group-item-keyword">
          <div class="col-md-10 input-group ul-li-list-keyword-input-group-style">
            <input type="text" class="form-control ul-li-list-keyword-input-class " name="keyword" placeholder="New Keyword" value="${value}">
          </div>
        </li>`;
  $('#add-site-keyword-list-id').prepend(html);
};
/**
 * @function saveNewSiteToStorage Saves the new Site values into the storage
 * @descriptionSaves the new Site values into the storage
 */
addNewSiteLib.prototype.saveNewSiteToStorage = function (saveSiteItem) {
  var self=this;
  chrome.storage.sync.get('page-align-sites', function (saveSitesDatas) {
    // Main storage name 
    const storageAppKey = "page-align-sites";
    var siteList = Object.assign({}, (saveSitesDatas[storageAppKey]));
    var siteItem = Object.assign({}, (saveSiteItem));
    siteList[siteItem.name] = Object.assign({}, (siteItem));
    chrome.storage.sync.set({
      'page-align-sites': Object.assign({}, (siteList))
    }, function () {
      chrome.storage.sync.get('page-align-sites', function (dada) {
    
      });
    });
  })
};
/**
 * @function  addNewSiteOnList Manager function, parse, filter,save,clear the form
 * @description This method parses the data from add site form and takes values of
 * configured margin than saves the data with named methods.
 * At the final, clears the form that filled with save data
 */
addNewSiteLib.prototype.addNewSiteOnList = function () {
  var self = this;
  var datasJson = $('#add-new-site-form-id').serializeArray();
  var saveSiteItem = {
    name: "",
    marginValue: "",
    keysForMatch: []
  };
  saveSiteItem.name = (_.findWhere(datasJson, {
    name: "name"
  })).value;
  var keywordsObjectList = _.where(datasJson, {
    name: "keyword"
  });
  _.each(keywordsObjectList, function (item) {
    if(item.value!==""&&item.value!==null&&item.value!==" "){
    saveSiteItem.keysForMatch.push(item.value);
    }
  });
  saveSiteItem.marginValue = $('#range-value-id').html();
  self.saveNewSiteToStorage(saveSiteItem);
  self.clearAddSiteForm();
};
/**
 * @function clearAddSiteForm Clears the Add New Site inputs
 * @description Clears the Add New Site inputs
 */
addNewSiteLib.prototype.clearAddSiteForm=function(){
  $('#add-site-keyword-list-id').html("");
  $('#add-site-view-id input').each(function(k,v){
    $(this).val("");
  });  
};


/**
 * NOT USING
 * Unused cuz of html intellisense block
 *  */
addNewSiteLib.prototype.addSiteViewHTMLTemplate = function () {
  return (    `
    <div class="row">
    <div class="col-sm-12 text-center">
          <div class="header-title">ADD</div>
        </div>
    </div>
    <form id="add-new-site-form-id">
      <div class="form-group">
        <label for="name">Alias: </label>
        <input type="name" name="name" class="form-control" id="add-new-site-form-input-name-id">
      </div>
      <div class="form-group">
        <label for="url">URL:</label>
        <input type="text" id="add-new-site-form-input-url-id" name="keyword" class="form-control">
      </div>  
      <ul class="list-group" id="add-site-keyword-list-id">      
      </ul>
      <li class="list-group-item">
          <div id="add-site-new-keyword-button-id" class="btn btn-default full-width" style="font-size:24px;">
                +
          </div>
        </li>    
    </form>
    <div class="row" style="margin-top:10%;">
      <div class="col-sm-12 text-center ">
        <div class="btn btn-success full-width" id="add-site-submit-id">Add New Site</div>
      </div>
    </div>
    `
  );
};

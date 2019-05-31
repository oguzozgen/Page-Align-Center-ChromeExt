
    /**
 * @class helperCommon
 * @description Contains methods that used many times on different JS files.
 */
function helperCommon(){
    /**
     * Page list and alias for changing pages
     */
    this.pagesIdsToRoute={
      "main":"main-view-id",
      "addNew":"add-site-view-id"  
    };
}
helperCommon.prototype.constructor=helperCommon;
/**
 * Changes to extension pages
 * All pages at one HTML. Did not use mustache template binding
 * because of restrictions.
 * Working like wrote changing display none to selected one
 * @param {string} value destination page key value on this.pagesIdsToRoute=
 */
helperCommon.prototype.pageChanger=function(value){
   var pageDOMId=this.pagesIdsToRoute[value];
    $('.page-class-to-route').each(function(k,v){
      var isPageHidden=  $(this).hasClass("display-none");
      if(isPageHidden===false){
        $(this).addClass('display-none');
      }
    });
    $("#"+pageDOMId).removeClass('display-none');
}
/**
 * Checks List of booleans, Are they all true
 * @param {Array-Boolean} boolValuesAr ["siteURLKeyword1","siteURLKeyword2"]
 * @returns boolean
 */
helperCommon.prototype.isBoolListAllTrue=function(boolValuesAr) {
    let res = true;
    boolValuesAr.forEach(value => {
        if (value === false) {
            res = false;
        }
    });
    return res;
};
/**
 * Checks Site added or not
 * WARN if more that one record for one site, 
 * latest one on list will work
 * @param {string} siteUrl 
 * @returns {item:item/null,result:true/false}
 */
helperCommon.prototype.takeSiteItemOnList=function(dataListSites, urlCurrent) {
    var self=this;
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
            var matchRes = self.isBoolListAllTrue(cond);
            if (matchRes === true) {
                resultz = {
                    item: item,
                    result: true
                };
            }
        });
    return resultz;
};


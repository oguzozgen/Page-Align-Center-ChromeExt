
    /**
 * @class helperCommon
 * @description Contains methods that used many times on different JS files.
 */
function helperCommon(){
    this.countNotify=0;
    /**
     * Page list and alias for changing pages
     */
    this.pagesIdsToRoute={
      "main":"main-view-id",
      "settings":"settings-view-id",
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
helperCommon.prototype.takeSiteItemOnList2=function(dataListSites, urlCurrent) {
    let resultz = {
        item: null,
        result: false
    };
    var urlSplittedBySlash = urlCurrent.split('/');
    var websiteWithoutRoutes = urlSplittedBySlash[2];
    if(dataListSites[websiteWithoutRoutes]!==undefined)
    {
        resultz = {
            item: dataListSites[websiteWithoutRoutes],
            result: true
        };
    }
    return resultz;
 }
 helperCommon.prototype.takeBestMatchResult=function(resultZ){
    let counter =0;
    let raceMatch=[];
    resultZ.item.forEach(siteKeywordSet=>{
        raceData={index:counter,matched:0};
        let matchedCounter=0;
        siteKeywordSet.keysForMatch.forEach(keyword=>{
           let isIncluded=urlCurrent.includes(keyword);
           if(isIncluded===true)
           {
                matchedCounter=matchedCounter+1; 
           }
        });
        if(matchedCounter<siteKeywordSet.keysForMatch.length){
            matchedCounter=0;
        }
        raceData={index:counter,matched:matchedCounter};
        raceMatch.push(raceData);
        counter=counter+1;
    });
    let maxMatch=_.where(raceMatch, {matched: _.max(_.pluck(raceMatch, 'matched'))});
    let highestIndex = _.max(maxMatch, function(o){return o.index;});
    return highestIndex;

 }
helperCommon.prototype.notify=function(message,type){
    var self=this;
   var html = '<div class="alert alert-' + type + ' alert-dismissable page-alert" id="notify-close-'+this.countNotify+'">';    
    html += '<button type="button" class="close" ><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
    html += message;
    html += '</div>';    
    $(html).hide().prependTo('#noty-holder').slideDown();

    $('#notify-close-'+this.countNotify).click(function(e) {
        e.preventDefault();
        $(this).slideUp();
    });
    setTimeout(function(){
        $('#notify-close-'+self.countNotify).slideUp();
    },4000);
};

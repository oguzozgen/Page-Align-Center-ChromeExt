
    /**
 * @class helperCommon
 * @description Contains methods that used many times on different JS files.
 */
function helperCommon(){

}
helperCommon.prototype.constructor=helperCommon;
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

helperCommon.prototype.addNewSite=function(){
    
}
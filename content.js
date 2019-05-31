//Activates the tab
chrome.runtime.sendMessage({todo: "showPageAction"});

/**
 * LISTENER
 * Main Event Manupulatin DOM with Margin Left and Right
 * Triggering with on todo:"giveMargin"
 * @params {string} marginValue - ratio value in string like "15"
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.todo === "giveMargin"){ 
        var  marginValues=""+request.marginValue;
        $('body').css(  "-webkit-transition","0.7s" );
        $('body').css("transition","0.7s");
        $('body').css('margin-left',marginValues);
        $('body').css('margin-right',(marginValues));
    }
});
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
    	 chrome.storage.sync.get('page-align-sites-config',function (configDatas) {
    	 	if (configDatas['page-align-sites-config'].animate) {
    	 		 $('body').css(  "-webkit-transition","0.7s" );
       		     $('body').css("transition","0.7s");
    	 	}else{
	 			 $('body').css(  "-webkit-transition","0s" );
       		     $('body').css("transition","0s");
    	 	}
            var  marginValues=""+request.marginValue;
            $('body').css('margin-left',marginValues);
            $('body').css('margin-right',marginValues);
    
    	 });
       }
});
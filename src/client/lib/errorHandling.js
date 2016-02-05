var gOldOnError = window.onerror;

//Override previous handler.
window.onerror = function myErrorHandler(errorMsg, url, lineNumber, colno, error) {
	//alert('On Error:'+errorMsg+" @"+url+":"+lineNumber);
	d('On Error:'+errorMsg+" @"+url+":"+lineNumber);
	if(error) d(error.stack);
	// logger.log('error', 'On Error:'+errorMsg+" @"+url+":"+lineNumber);
	if (gOldOnError)
		// Call previous handler.
		return gOldOnError(errorMsg, url, lineNumber);

// Just let default handler run.
return false;
}

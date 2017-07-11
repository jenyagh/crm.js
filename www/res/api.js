var serverAPI = new function()
{
	function apiCall(url, method, data, callback)
	{
		$.ajax(
		{
			url: url,
			method: method,
			data: data
		}).done(callback);
	}

	this.contact=function(method, data, callback)
	{
		apiCall("/api/contact", method, data, callback);
	}

	this.customer = function(method, data, callback)
	{
		apiCall("/api/customer", method, data, callback);
	}
}

var crmControllers = angular.module("crmControllers", []);

crmControllers.controller("CustomersController", ["$scope", "$http", function($scope, $http) 
{
	var req = $http.get("/api/customers");
	req.then(function (response) 
	{
		$scope.customers = response.data;

		$scope.$create = function()
		{
			fnCustomers.loadDialog(this, null);
		}

		$scope.$update = function(id)
		{
			for(var i=0; i < this.customers.length; i++)
			{
				if ( this.customers[i]._id == id )
				{
					fnCustomers.loadDialog(this, this.customers[i]);
					break;
				}
			}
		}
		
		$scope.$delete = function(id)
		{
			fnCustomers.delete(this, id, null);
		}	


	}, function (response) 
	{
		alert("error: " + response.statusText);
	});
}]);

crmControllers.controller("ContactsController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) 
{
	var req = $http.get("/api/contacts/" + $routeParams.customerId);
	req.then(function (response) 
	{
		$scope.customer = $routeParams.customerId;
		$scope.contactsOrder = "lname";
		$scope.contacts = response.data;

		$scope.$create = function()
		{
			fnContacts.loadDialog(this, null);
		}

		$scope.$update = function(id)
		{
			for(var i=0; i < this.contacts.length; i++)
			{
				if ( this.contacts[i]._id == id )
				{
					fnContacts.loadDialog(this, this.contacts[i]);
					break;
				}
			}
		}
		
		$scope.$delete = function(id)
		{
			fnContacts.delete(this, id, null);
		}		

		$scope.$getPhone = function(phones)
		{
			if ( phones && phones.length && phones.length > 0)
			{
				return phones[0].number + " (" + phones[0].type + ")";
			}
			return "";
		}

	}, function (response) 
	{
		alert("error: " + response.statusText);
	});
}]);

crmControllers.controller("DetailsController", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) 
{
	var req = $http.get("/api/contact/" + $routeParams.contactId);
	req.then(function(response) 
	{                   
		$scope.contact = response.data;
		$scope.customer = $scope.contact.customer;
		
		$scope.$update = function()
		{
			fnContacts.loadDialog(this, this.contact);
		}

		$scope.$delete = function()
		{
			var backURL = "#!/contacts/" + this.contact.customer;
			fnContacts.delete(null, this.contact._id, function()
			{
				window.location = backURL;
			});
		}
	}, function (response) 
	{
		alert("error: " + response.statusText);
	}); 
}]);      

crmControllers.controller("EventsController", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) 
{
	var req = $http.get("/api/events/10");
	req.then(function(response) 
	{                   
		$scope.events = response.data;
		$scope.$cssDisplay = function(eventName)
		{
			return	eventName == "deleted" ? "none" : "";
		}

	}, function (response) 
	{
		alert("error: " + response.statusText);
	});
}]);     

crmControllers.controller("SettingsController", ["$scope", "$http","$routeParams", function($scope, $http, $routeParams) 
{
	var req = $http.get("/api/settings");
	req.then(function(response) 
	{                   
		$scope.settings = response.data;
	}, function (response) 
	{
		alert("error: " + response.statusText);
	}); 
}]);     
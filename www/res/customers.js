var fnCustomers = new function()
{
	function getDialog(sender)
	{
		return sender ? $(sender).parents(".modal-dialog") : $("#createCustomerDialogBox").find(".modal-dialog");
	}

	function getDialogData(dialog, id)
	{
		var customer = {
			name:$(dialog).find("#txtName").val(),
			email:$(dialog).find("#txtEMail").val(),
			phone:$(dialog).find("#txtPhone").val(),
			address:$(dialog).find("#txtAddress").val(),
		};
		
		if (id) customer._id = id;

		return customer;
	}

	this.save = function(sender, callback)
	{
		var dialog = getDialog(sender);
		var $scope = $(dialog).data("scope-element");
		if ($scope && fnCheckMandatory(dialog) == true)
		{
			var customerId = $(dialog).attr("customer-id");
			var customerData = getDialogData(dialog, customerId);
			var method = customerId && customerId.length > 0 ? "PUT" : "POST";
			serverAPI.customer(method, customerData, function(data) 
			{
				$(dialog).parent().modal("toggle");
				
				var serverCustomer = JSON.parse(data);
				if (serverCustomer)
				{
					if ($scope.customers)
					{
						if (method == "PUT")
						{
							for(var i=0; i < $scope.customers.length; i++)
							{
								if ( $scope.customers[i]._id == serverCustomer._id )
								{
									$scope.customers[i] = serverCustomer;
									break;
								}
							}
						}
						else
						{
							$scope.customers.push(serverCustomer);
						}
					}
					else if ($scope.customer)
					{
						$scope.customer = serverCustomer;
					}

					$scope.$apply();
					if (callback != null) callback();
				}
			});		
		}
	}

	this.delete = function($scope, id, callback)
	{
		serverAPI.customer("DELETE", {id:id}, function(result)
		{
			if ($scope && $scope.customers)
			{
				for (var i=0; i < $scope.customers.length; i++ )
				{
					if ( $scope.customers[i]._id == id )
					{
						$scope.customers.splice(i, 1);
						$scope.$apply();
						break;
					}
				}
			}

			if (callback != null) callback();			
		});						
	}

	this.loadDialog = function(scope, customer)
	{
		
		var dialog = getDialog(null);
		$(dialog).data("scope-element", scope);

		$(dialog).find("input").val("");
		$(dialog).find(".mandatory-alert").css({display:"none"});
		
		if (customer)
		{
			$(dialog).find("#txtName").val(customer.name);
			$(dialog).find("#txtEMail").val(customer.email);
			$(dialog).find("#txtPhone").val(customer.phone);
			$(dialog).find("#txtAddress").val(customer.address);
			
			$(dialog).attr("customer-id", customer._id);
			$(dialog).find(".modal-title").html("Update Contact");
		}
		else
		{
			$(dialog).attr("customer-id", "");
			$(dialog).find(".modal-title").html("Create Customer");
		}
		
		$(dialog).parent().modal();
	}

}



var fnContacts = new function()
{
	var phoneFormat = function(type, number)
	{
		if ( number != null && number !== "")
		{
			return {
				type: type,
				number: number,

				getString : function()
				{
					return type + ": " + number;
				}
			};
		}

		return null;
	}

	function getDialog(sender)
	{
		return sender ? $(sender).parents(".modal-dialog") : $("#createContactDialogBox").find(".modal-dialog");
	}

	function getDialogData(dialog, id)
	{
		var contact = {
			email:$(dialog).find("#txtEMail").val(),
			lname:$(dialog).find("#txtLastName").val(),
			fname:$(dialog).find("#txtFirstName").val(),
			
			phones:[]
		};
		
		if (id) contact._id = id;

		$(dialog).find("#txtPhonesList").find("option").each(function() 
		{
			contact.phones.push({number:$(this).attr("number"), type: $(this).attr("type")});
		});

		return contact;
	}

	function getPhoneData(dialog)
	{
		var num = $(dialog).find("#txtPhoneNumber").val();
		var type = $(dialog).find("#txtPhoneNumberType").find(":selected").text();
		
		return phoneFormat(type, num);
	}

	this.addPhone = function(sender, numberData)
	{
		var dialog = getDialog(sender);
		
		if (!numberData)
			numberData = getPhoneData(dialog);

		if  (numberData)
		{
			var option = $('<option>', numberData);
			$(option).text(numberData.getString());
			$(dialog).find("#txtPhonesList").append($(option));
		}
	}

	this.editPhone = function(sender)
	{
		var dialog = getDialog(sender);
		var numberData = getPhoneData(dialog);
		if  (numberData != null)
		{
			var option = $(dialog).find("#txtPhonesList").find(":selected");
			$(option).attr(numberData);
			$(option).text(numberData.getString());
		}

	}

	this.removePhone = function(sender)
	{
		var dialog = getDialog(sender);
		$(dialog).find("#txtPhonesList").find(":selected").remove();
	}

	this.selectPhone = function(sender)
	{
		var dialog = getDialog(sender);
		
		var selected = $(dialog).find("#txtPhonesList").find(":selected");

		var type = $(selected).attr("type");
		var text = $(selected).attr("number");

		$(dialog).find("#txtPhoneNumber").val(text);
		$(dialog).find("#txtPhoneNumberType").val(type);

	}

	this.save = function(sender, callback)
	{
		var dialog = getDialog(sender);

		var $scope = $(dialog).data("scope-element");
		if ($scope && fnCheckMandatory(dialog) == true)
		{
			var contactId = $(dialog).attr("contact-id");
			var contactData = getDialogData(dialog, contactId);

			if ($scope.customer) contactData.customer = $scope.customer;
			var method = contactId && contactId.length > 0 ? "PUT" : "POST";
			serverAPI.contact(method, contactData, function(data) 
			{
				$(dialog).parent().modal("toggle");

				var serverContact = JSON.parse(data);
				if (serverContact)
				{
					if ($scope.contacts)
					{
						if (method == "PUT")
						{
							for(var i=0; i < $scope.contacts.length; i++)
							{
								if ( $scope.contacts[i]._id == serverContact._id )
								{
									$scope.contacts[i] = serverContact;
									break;
								}
							}
						}
						else
						{
							$scope.contacts.push(serverContact);
						}
					}
					else if ($scope.contact)
					{
						$scope.contact = serverContact;
					}

					$scope.$apply();
					if (callback != null) callback();
				}
			});		
		}
	}

	this.delete = function($scope, id, callback)
	{
		serverAPI.contact("DELETE", {id:id}, function(result)
		{
			if ($scope && $scope.contacts)
			{
				for (var i=0; i < $scope.contacts.length; i++ )
				{
					if ( $scope.contacts[i]._id == id )
					{
						$scope.contacts.splice(i, 1);
						$scope.$apply();
						break;
					}
				}
			}

			if (callback != null) callback();			
		});						
	}

	this.loadDialog = function(scope, contact)
	{
		var dialog = getDialog(null);
		$(dialog).data("scope-element", scope);

		$(dialog).find("input").val("");
		$(dialog).find("#txtPhonesList").children().remove();
		$(dialog).find(".mandatory-alert").css({display:"none"});

		if (contact)
		{
			$(dialog).find("#txtEMail").val(contact.email);
			$(dialog).find("#txtLastName").val(contact.lname);
			$(dialog).find("#txtFirstName").val(contact.fname);
			if (contact.phones)
			{
				for(var i=0; i < contact.phones.length; i++)
				{
					var phoneData = phoneFormat(contact.phones[i].type, contact.phones[i].number);
					if ( phoneData ) this.addPhone(null, phoneData);
				}
			}
			$(dialog).attr("contact-id", contact._id);
			$(dialog).find(".modal-title").html("Update Contact");
		}
		else
		{
			$(dialog).attr("contact-id", "");
			$(dialog).find(".modal-title").html("Create Contact");
		}
		
		$(dialog).parent().modal();
	}

}
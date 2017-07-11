var crmApp = angular.module("crmApp", 
[
	"ngRoute",
	"crmControllers"
]);

crmApp.config(['$routeProvider', function($routeProvider) 
{
	$routeProvider.when('/all', 
	{
		templateUrl: '/views/customers.html',
		controller: 'CustomersController'
	}).when('/contacts/:customerId', 
	{
		templateUrl: '/views/contacts.html',
		controller: 'ContactsController'
	}).when('/details/:contactId', 
	{
		templateUrl: '/views/details.html',
		controller: 'DetailsController'
	}).when('/events', 
	{
		templateUrl: '/views/events.html',
		controller: 'EventsController'
	}).when('/settings', 
	{
		templateUrl: '/views/settings.html',
		controller: 'SettingsController'
	}).when('/about', 
	{
		templateUrl: '/views/about.html',
		controller: 'AboutController'
	}).otherwise(
	{
		redirectTo: '/about'
	});
}]);     
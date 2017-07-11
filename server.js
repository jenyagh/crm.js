var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var database = require('./database');
var config = require('./server.config.json');

var app = express();

app.use(cookieParser());
app.use(express.static(__dirname + "/www"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", function (req, res)  
{ 
	res.sendFile( __dirname + "/www/" + "crm.html" );
});

/*
app.get("/demo-database", function (req, res)  
{ 
	var demoDB = require('./demo.data.json');
	if ( demoDB && demoDB.length)
	{
		for(var i=0; i < demoDB.length; i++)
		{
			database.createContact(demoDB[i]);
		}
		res.end(`Created ${demoDB.length} records`);
	}
	else
		res.end(`template doesn't exist`);
});
*/
app.get("/api/settings", function (req, res)  
{ 
	res.end(JSON.stringify(config));
});

app.get("/api/events/:limit", function (req, res)  
{ 
	database.getEvents(req.params.limit, (list)=>
	{
		list.forEach((element) =>
		{
			element.date = 	moment(element.date).format("hh:mm / MMM DD, YYYY");
		});

 		res.end(JSON.stringify(list));
	});   
});

/*------------------- CUSTOMERS -------------------------*/
app.get("/api/customers", function (req, res)  
{ 
	database.getCustomers(null, (contact)=>
	{
		res.end(JSON.stringify(contact));
	});   
});

app.put("/api/customer", function (req, res)  
{
	var customer = req.body;
	database.updateCustomer(customer._id, customer, (dbCustomer) =>
	{
		res.end(JSON.stringify(dbCustomer));
	});   
});

app.post("/api/customer", function (req, res)  
{ 
	var customer = req.body;
	database.createCustomer(customer, (dbCustomer) =>
	{
		res.end(JSON.stringify(dbCustomer));
	});   
});

app.delete("/api/customer", function (req, res)  
{ 
	database.deleteCustomer(req.body.id, (result) =>
	{
		res.end(JSON.stringify(result > 0));
	});   
});

/*------------------- CONSTACTS ------------------------*/
app.get("/api/contact/:id", function (req, res)  
{ 
	database.getContact(req.params.id, (contact)=>
	{
		res.end(JSON.stringify(contact));
	});   
});

app.get("/api/contacts/:id", function (req, res)  
{ 
   database.getContacts({customer:req.params.id}, (contacts)=>
   {
		res.end(JSON.stringify(contacts));
   });
});

app.put("/api/contact", function (req, res)  
{
	var contact = req.body;
	database.updateContact(contact._id, contact, (dbContact) =>
	{
		res.end(JSON.stringify(dbContact));
	});   
});

app.post("/api/contact", function (req, res)  
{ 
	var contact = req.body;
	database.createContact(contact, (dbContact) =>
	{
		res.end(JSON.stringify(dbContact));
	});   
});

app.delete("/api/contact", function (req, res)  
{ 
	database.deleteContact(req.body.id, (result) =>
	{
		res.end(JSON.stringify(result > 0));
	});   
});


var server = app.listen(8081, () =>
{
   var host = server.address().address;
   var port = server.address().port;
   
})


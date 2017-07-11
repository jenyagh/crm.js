var mongo = require('mongodb');

var ObjectId = mongo.ObjectID;
var MongoClient = mongo.MongoClient;

var config = require('./server.config.json');



module.exports = new function()
{
	var _db = null;

	MongoClient.connect(config.db.connection, function(err, db) 
	{
		if ( err )
			console.log(err);

		_db = db;
	});

	function getCollection(name, callback)
	{
		_db.collections((err, collections)=>
		{
			if ( collections.find(c => c.collectionName == name) === undefined)
			{
				_db.createCollection(name, (err, collection) =>
				{
					if (err)
					{
						_db.collection(name, (err, collection) =>
						{
							callback(collection, err);        
						});
					}
					else
					{
						callback(collection, err);
					}
				});
			}
			else
			{
				_db.collection(name, (err, collection) => 
				{
					callback(collection, err);
				});
			}
		});
	}



	this.eventLog = function(eventName, id)
	{
		var logDocument = {
			"date":Date.now(),
			"event": eventName,
			"contactId": id
		}				

		getCollection(config.db.contactsLogCollection, collection =>
		{
			collection.insert(logDocument);
		});		
	}

	this.getEvents = function(limit, callback)
	{
		var limitNumber = Number(limit);
		if ( isNaN(limitNumber) ) limitNumber = 10;

		getCollection(config.db.contactsLogCollection, collection =>
		{
			collection.find({}).sort({"date":-1}).limit(limitNumber).toArray((err, list) =>
			{
				callback(list);
			});
		});		
	}

	/*-------------------- CONTACTS -------------------- */

	this.getContact = function(id, callback)
	{
		getCollection(config.db.contactsCollection, collection =>
		{
			collection.find({"_id":new ObjectId(id)}).toArray((err, list)=>
			{
				callback(list && list.length > 0 ? list[0] : null);
			});
		});
	}

	this.getContacts = function(filter, callback)
	{
		getCollection(config.db.contactsCollection, collection =>
		{
			collection.find(filter ? filter : {}).toArray((err, list)=>
			{
				callback(list);
			});
		});
	}

	this.createContact = function(contact, callback)
	{
		getCollection(config.db.contactsCollection, collection =>
		{
			collection.insert(contact, (err, mongoCB) =>
			{
				var dbContact = mongoCB.ops && mongoCB.ops.length ? mongoCB.ops[0] : null;

				if (dbContact != null) 
					this.eventLog("created", dbContact._id);

				if (callback) callback(dbContact);
			});
		});
	}

	this.updateContact = function(id, contact, callback)
	{
		getCollection(config.db.contactsCollection, collection =>
		{
			delete contact._id;
			collection.update({"_id": new ObjectId(id)}, contact, {upsert:false}, (err, mongoCB) =>
			{
				this.eventLog("updated", id);

				contact._id = id;
				callback(contact);
			});
		});		
	}

	this.deleteContact = function(id, callback)
	{
		getCollection(config.db.contactsCollection, collection =>
		{
			collection.deleteOne({_id:new ObjectId(id)}, (err, mongoCB) =>
			{
				this.eventLog("deleted", id);
				callback(mongoCB.deleteContact);
			});
		});
	}
	
	/*-------------------- CUSTOMERS -------------------- */
	this.getCustomers = function(filter, callback)
	{
		getCollection(config.db.customersCollection, collection =>
		{
			collection.find({}).toArray((err, list)=>
			{
				callback(list);
			});
		});
	}

	this.createCustomer = function(contact, callback)
	{
		getCollection(config.db.customersCollection, collection =>
		{
			collection.insert(contact, (err, mongoCB) =>
			{
				var dbContact = mongoCB.ops && mongoCB.ops.length ? mongoCB.ops[0] : null;

				if (callback) callback(dbContact);
			});
		});
	}

	this.updateCustomer = function(id, contact, callback)
	{
		getCollection(config.db.customersCollection, collection =>
		{
			delete contact._id;
			collection.update({"_id": new ObjectId(id)}, contact, {upsert:false}, (err, mongoCB) =>
			{
				contact._id = id;
				callback(contact);
			});
		});		
	}

	this.deleteCustomer = function(id, callback)
	{
		getCollection(config.db.customersCollection, collection =>
		{
			collection.deleteOne({_id:new ObjectId(id)}, (err, mongoCB) =>
			{
				getCollection(config.db.contactsCollection, contactsCollection =>
				{
					contactsCollection.deleteMany({customer:id});
				});

				callback(mongoCB.deleteContact);
			});
		});
	}
}
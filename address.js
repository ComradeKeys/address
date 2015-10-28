Uploads = new FS.Collection('uploads', {
    stores:[new FS.Store.FileSystem ('uploads', {path:'./uploads'})]
});
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
	tasks: function () {
	    // Show newest tasks at the top
	    return Tasks.find({}, {sort: {createdAt: -1}});
	},
	uploads:function() {
	    return Uploads.find();
	}
    });

    //Asks for the username rather than the password
    Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
    });
    
    Template.body.events({
	"submit .new-task": function (event) {
	    // Prevent default browser form submit
	    event.preventDefault();

	    // Get value from form element
	    var text = event.target.text.value;

	    // Insert a task into the collection
	    Tasks.insert({
		text: text,
		createdAt: new Date() // current time
	    });

	    // Clear form
	    event.target.text.value = "";
	}
    });

    Template.task.events({
	"click .toggle-checked": function () {
	    // Set the checked property to the opposite of its current value
	    Tasks.update(this._id, {
		$set: {checked: ! this.checked}
	    });
	},
	"click .delete": function () {
	    Tasks.remove(this._id);
	}
    });

    Template.upload.events({
	'change .fileInput' :function(event, template) {
	    FS.Utility.eachFile(event, function() {
		var fileObj = new FS.File(file);
		Uploads.insert(fileObj, function(err) {
		    console.log(err);
		});
	    })
	}
    });

}

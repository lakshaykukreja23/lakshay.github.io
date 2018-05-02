var express = require('express');
var blog = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

blog.use(bodyParser.json({limit:'10mb',extended:true}));
blog.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
//using the middleware js
var middleware = require('./myMiddleWare.js');

        //calling the middleware for checking the age//
blog.get('/normal/route',function(req, res)
{
	var dateOfBirth = new Date(req.query.dob);
	res.send("all are acessible to this file"+dateOfBirth);
});


blog.get('/restricted/route',middleware.ageFilter,function(req,res)
{
	var dateOfBirth = new Date(req.query.dob);
	res.send("Your Age is "+req.age+" so you can access the files");
});
            // end of middleware//

     //configure the database
var dbPath ="mongodb://localhost/blogApp";
     //connecting to the database
db = mongoose.connect(dbPath);
mongoose.connection.once('open',function()
{
	console.log ('now we are connected with mongodb')
});

     //getting the model
var Blog = require('./blogModel.js');
var blogApp = mongoose.model('Blog');


//getting first document page
blog.get('/',function(req,res)
{
 res.send('This is a blog page \n these are the following base url\n 1) Method = Get , add in Url :( /allBlogs ) this show all the blogs \n 2) Method = Get ,add in Url:( /singleBlog/:id ) this will show the single block \n 3) Method = post, add in url :( /blog/create ) this is used to create the url \n 4) Method = put , add in url :( /blog/:id/edit ) this is used to edit the blog \n 5) Method = post ,add is url:( /blog/:id/delete ) this is used to delete the blog \n 6)Method = get , add in url:( /normal/route ) to know you are allowed to use or not \n 7)Method = get, add in url:( /restricted/route )check your age if above 18 then allowed otherwise not allowed');
});

// getting all the blogs 
blog.get('/allBlogs',function(req,res)
{
 blogApp.find(function(err,result)
 {
 	if(err)
 	{
 		res.send(err);
 	}
 	else
 	{
 		res.send(result);
 	}
 });
});

// finding blog by its id
blog.get('/singleBlog/:id',function(req,res)
{
	blogApp.findOne({'_id':req.params.id},function(err,result)
	{
		if(err)
		{
			res.send(err);
		}
			else
		{
			res.send(result);
		}
	});
});

//creating the blog 
blog.post('/blog/create',function(req,res)
{
	var newBlog = new blogApp
	({
		title: req.body.title,
		subtitle:req.body.subtitle,
		blogBody:req.body.blogBody,
		authorName:req.body.authorName,
		authorEmail:req.body.authorEmail,
		authorNumber:req.body.authorNumber
	});

	// entering the tags in the array
	var tags = (req.body.tags!=undefined && req.body.tags != null)	? req.body.tags.split(',') : '';
	newBlog.tags = tags;
	//getting todays date
	var today = Date.now();
	newBlog.created = today;
 	
	// saving the data
 		newBlog.save(function(error)
	{
		if(error)
		{
			console.log(error);
			res.send(error);
		}
		else
		{
			res.send(newBlog);
		}
	});
});
 //editing the existing block by its id 
blog.put('/blog/:id/edit',function(req,res)
{
	var update = req.body;
	blogApp.findOneAndUpdate({'_id':req.params.id},update,function(err,result)
	{
		if(err)
		{
			console.log('some error occured');
			res.send(err);
		}
		else
		{
			res.send(result);
		}
	});
});

//removing the block 
blog.post('/blog/:id/delete', function(req,res)
{
	blogApp.remove({'_id':req.params.id},function(err,result)
	{
		if(err)
		{
			console.log('error occured while deleting');
			res.send(err);
		}
		else
		{
			res.send(result);
		}
	});
});

// handling the error with the help of error handling middleware for get request 
blog.get('*', function(request, response,next) {

    response.status = 404;
    next("Error Occured. Please, Check your Path");
});

// handling the error with the help of error handling middleware for put request 
blog.put('*', function(request, response,next) {

    response.status = 404;
    next("Error Occured. Please, Check your Path");
});

// handling the error with the help of error handling middleware for post request 
blog.post('*', function(request, response,next) {

    response.status = 404;
    next("Error Occured. Please, Check your Path");
});

//Error handling Middleware 
//application level middleware
blog.use(function(err, req, res,next) {

    console.log("Connection Closed");
    
    if (res.status == 404) {
        res.send("Check your Path ,I think you wrote the wrong path ");
    } else {
        res.send(err);
    }
});

//listening the port 
blog.listen(3000, function()
{
	console.log("listening to port 3000");
});
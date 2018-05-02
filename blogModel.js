var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema
({
	title       :    {type:String,default:'',require:true},
	subtitle    :    {type:String, default:''},
	blogBody    :    {type:String,default:'',require:true},
	tags		:    [],
	created		: 	 {type:Date},
	authorName	:    {type:String,default:'not mentioned',require:true },
	authorEmail	:    {type:String,default:''},
	authorNumber:    {type:Number,default:''}
});
mongoose.model('Blog',blogSchema);
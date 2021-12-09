// ####     ####
/* PACKAGE IMPORTS */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


/* EJS REQUIREMENTS  */
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); ///to solve add error
app.use(express.static("public"));

/* MONGODB WITH MONGOOSE  */
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

/* MONGOOSE DATABASE SCHEMA */
const postSchema = {
    title: String,
    content: String
  };
  
/* CREATING A MODEL OBJECT */
const Post = mongoose.model("Post", postSchema);
// TODO : Add CRUD operations

/* GET ROUTES */
// STARING CONTENT
const homeStartingContent = "This is an implementation of MongDB NoSQL database. Here all the post in this blog are stored in the data base and retrived to display";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// home route
// TODO: reverse the order of post being displayed on home page
app.get("/", function(req, res){
  // find all posts to display on home page
    Post.find({}, function(err, posts){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
  });

// insert posts page 
app.get("/compose", function(req, res){
  res.render("compose");
});

// different post on different page
app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
    // find post according to _id 
  Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
});

// edits route
app.get("/edit", function(req, res){
  // find all posts to display on home page
    Post.find({}, function(err, posts){
      res.render("edit", {
        startingContent: homeStartingContent,
        posts: posts
        });
    });
  });

//update post page
app.get("/update/:postId", function(req, res){

  const requestedPostId = req.params.postId;
    // find post according to _id 
  Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("update", {
        title: post.title,
        content: post.content,
        postId: requestedPostId
      });
    });
  
});

// deleting a post
app.get("/delete/:postId", function (req, res) {
  
  const requestedPostId = req.params.postId;
  const deleteDocument = async (requestedPostId) => {
    try {
      const result = await Post.findByIdAndDelete({ _id: requestedPostId });
      res.redirect("/edit");
    } catch (error) {
      console.log(error);
      
    }
  }
  
  deleteDocument(requestedPostId);

});

  
/* TODO : host this on the internet (heroku) add about and contact me pages */
// about page
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});
// contact page
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


/* POST ROUTES */
// display compose page to enter post title and content on page
app.post("/compose", function (req, res) {
  
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

//update post 
app.post("/updatepost/:postId", function (req, res) {
  
  const requestedPostId = req.params.postId;
  const updateDocument = async (requestedPostId) => {
    try {
      const result = await Post.findByIdAndUpdate({ _id: requestedPostId }, {
        $set: {   title: req.body.postTitle,
                content: req.body.postBody
              }
      },
        {
          new : true,
          useFindAndModify : false
      });
      res.render("post", {
        title: result.title,
        content: result.content
      });
    } catch (error) {
      console.log(error);
    }
  }
  updateDocument(requestedPostId);
});





/* SERVER INIT */
portnumber=3001
app.listen(portnumber, function () {
    console.log(`server started at port ${portnumber}`)
});

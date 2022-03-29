// ####     ####
/* PACKAGE IMPORTS */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

/* User Login */
const bcrypt = require("bcrypt");
const saltRounds = 2;

/* Google Auth */
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const res = require("express/lib/response");

/* EJS REQUIREMENTS  */
const app = express();
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
); ///to solve add error
app.use(express.static("public"));

/* MONGODB WITH MONGOOSE  */
try {
  mongoose.connect("mongodb://localhost:27017/blogDB", {
  useNewUrlParser: true,
  });
  console.log("DataBase Connected : Collection blogdb");
} catch (error) {
  console.log(`DataBase COnnection Error \n ${error}`);
}


/* MONGOOSE DATABASE SCHEMA */
const postSchema = {
  title: String,
  content: String,
};

const userSchema = {
  username: String,
  password: String,
  secret: Object,
};

/* CREATING A MODEL OBJECT */
const Post = mongoose.model("Post", postSchema);

const User = new mongoose.model("User", userSchema);

// TODO : Add CRUD operations

/* GET ROUTES */
// STARING CONTENT
const homeStartingContent =
  "This is an implementation of MongDB NoSQL database. Here all the post in this blog are stored in the data base and retrived to display";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var loggedIn = { user: false, username: null };
console.log(loggedIn);
// home route
// TODO: reverse the order of post being displayed on home page
app.get("/", function (req, res) {
  // find all posts to display on home page
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
      user: loggedIn.user,
    });
  });
});

// insert posts page
app.get("/compose", function (req, res) {
  if (loggedIn.user) {
    res.render("compose", {
      user: loggedIn.user,
    });
  }else {
    res.render("login", {
      count: 0,
      message: "Login First",
      foundUser: false,
      user: loggedIn.user,
    });
  }
});

// different post on different page
app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  // find post according to _id
  Post.findOne(
    {
      _id: requestedPostId,
    },
    function (err, post) {
      res.render("post", {
        title: post.title,
        content: post.content,
        user: loggedIn.user,
      });
    }
  );
});

// edits route
app.get("/edit", function (req, res) {
  // find all posts to display on home page
  if (loggedIn.user) {
    Post.find({}, function (err, posts) {
      res.render("edit", {
        posts: posts,
        user: loggedIn.user,
      });
    });
  } else {
    res.render("login", {
      count: 0,
      message: "Login First",
      foundUser: false,
      user: loggedIn.user,
    });
  }
});

//update post page
app.get("/update/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  // find post according to _id
  Post.findOne(
    {
      _id: requestedPostId,
    },
    function (err, post) {
      if (loggedIn.user) {
        res.render("update", {
          title: post.title,
          content: post.content,
          postId: requestedPostId,
          user: loggedIn.user,
        });
      } else {
        res.render("login"),
          {
            count: 0,
            message: "Login First",
            foundUser: false,
            user: loggedIn.user,
          };
      }
    }
  );
});

// deleting a post
app.get("/delete/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  if (loggedIn.user) {
    const deleteDocument = async (requestedPostId) => {
      try {
        const result = await Post.findByIdAndDelete({
          _id: requestedPostId,
        });
        if (loggedIn.user) {
          Post.find({}, function (err, posts) {
            res.render("edit", {
              posts: posts,
              user: loggedIn.user,
            });
          });
        } else {
          res.render("login", {
            count: 0,
            message: "Login First",
            foundUser: false,
            user: loggedIn.user,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    deleteDocument(requestedPostId);
    
  }else {
    res.render("login", {
      count: 0,
      message: "Login First",
      foundUser: false,
      user: loggedIn.user,
    });
  }
});

app.get("/login", function (req, res) {
  if (loggedIn.user) {
    res.render("logout", {
      username: loggedIn.username,
      user: loggedIn.user,
    });
  } else {
    res.render("login", {
      count: 1,
      user: loggedIn.user,
    });
  }
});

app.get("/register", function (req, res) {
  res.render("register", {
    count: 1,
    user: loggedIn.user,
  });
});

app.get("/authcode", function (req, res) {
  res.render("authcode", {
    count: 1,
    user: loggedIn.user,
  });
});

/* TODO : host this on the internet (heroku) add about and contact me pages */
// about page
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
    user: loggedIn.user,
  });
});
// contact page
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
    user: loggedIn.user,
  });
});

/* POST ROUTES */
// display compose page to enter post title and content on page

app.post("/register", function (req, res) {
  // checking if user exists
  const username = req.body.Username;

  // Secrete
  const secret = speakeasy.generateSecret({
    name: "CIS - 2FA",
  });
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      username: req.body.Username,
      password: hash,
      secret: secret.ascii,
    });
    // console.log(newUser.username);
    // console.log(newUser.password);
    // console.log(newUser.secret);
    // TODO done: if user already exist condition
    User.findOne(
      {
        username: username,
      },
      function (err, foundUser) {
        if (foundUser) {
          res.render("register", {
            eflag: true,
            count: 0,
            message: "User Already Exist in the database",
            user: loggedIn.user
          });
        } else {
          newUser.save(function (err) {
            if (err) {
              res.send(err);
              res.status(500).json({
                message: "Error saving user to db",
                count: 0,
                eflag: true,
                user: loggedIn.user
              });
            } else {
              qrcode.toDataURL(secret.otpauth_url, function (err, data) {
                if (err) {
                  res.render("register", {
                    eflag: true,
                    count: 0,
                    message: "Error in generating qrcode",
                    user: loggedIn.user
                  });
                } else {
                  res.render("qrcode", {
                    data: data,
                    user: loggedIn.user
                  });
                }
              });
            }
          });
        }
      }
    );
  });
});

app.post("/login", function (req, res) {
  const username = req.body.Username;
  const password = req.body.password;
  // console.log("called post login");
  User.findOne(
    {
      username: username,
    },
    function (err, foundUser) {
      console.log("called find user");
      if (!foundUser || err) {
        // console.log("called user nf");
        res.render("login", {
          message: "User not found in DB , Register instead",
          foundUser: false,
          count: 0,
          user: loggedIn.user
        });
      } else {
        if (foundUser) {
          console.log("called user found");
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result == true) {
              console.log("called pas match");
              res.render("authcode", {
                message: "user exist and password match",
                user: foundUser,
                foundUser: true,
                password: true,
                count: 0,
              });
            } else {
              console.log("called pass not match");
              res.render("login", {
                message: "The Password you entered is wrong",
                foundUser: true,
                password: false,
                count: 0,
                user: loggedIn.user
              });
            }
          });
        }
      }
    }
  );
});

app.post("/authcode", function (req, res) {
  // get secret from db
  const token = req.body.code;
  User.findOne(
    {
      username: req.body.Username,
    },
    function (err, foundUser) {
      if (!err) {
        const verified = speakeasy.totp.verify({
          secret: foundUser.secret,
          encoding: "ascii",
          token: token,
        });
        if (verified) {
          res.redirect("/edit");
          loggedIn.user = true;
          loggedIn.username = req.body.Username;
        } else {
          res.render("authcode", {
            message: "Code expired or Wrong",
            user: foundUser,
            count: 0,
          });
        }
      }
    }
  );
  // get code from user
  // verify code
  // if verified send to edit else retry on same page
});

app.post("/logout", function (req, res) {
  loggedIn = { user: false, username: null };
  res.render("login", {
    count: 1,
    user: loggedIn.user,
  });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

//update post
app.post("/updatepost/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  if (loggedIn.user) {
    const updateDocument = async (requestedPostId) => {
      try {
        const result = await Post.findByIdAndUpdate(
          {
            _id: requestedPostId,
          },
          {
            $set: {
              title: req.body.postTitle,
              content: req.body.postBody,
            },
          },
          {
            new: true,
            useFindAndModify: false,
          }
        );
        res.render("post", {
          title: result.title,
          content: result.content,
          user: loggedIn.user,
        });
      } catch (error) {
        console.log(error);
      }
    };
    updateDocument(requestedPostId);
    
  }else {
    res.render("login", {
      count: 0,
      message: "Login First",
      foundUser: false,
      user: loggedIn.user,
    });
  }
});

/* Functions */
// function GenSecret() {}
function update(post_id) {
  window.location.href = "/update/" + post_id;
}

/* SERVER INIT */
portnumber = 3001;
app.listen(portnumber, function () {
  console.log(`server started at port ${portnumber}`);
});

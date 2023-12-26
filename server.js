'use strict';

// load package
const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql')
var cors = require('cors')

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
 
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// create connection to mysql

var connection = mysql.createConnection({
  host     : 'mysql',
  user     : 'root',
  password : 'admin',
  database: 'projectdb'
 });
 
 connection.connect();

 app.get('/init', (req, res) => 
{
    console.log("init");

    connection.query(`CREATE DATABASE IF NOT EXISTS projectdb`, function(error, result){
        if(error) console.log(error);
    });

    connection.query(`USE projectdb`, function (error, results) {
        if (error) console.log(error);
       });
    
    connection.query(`DROP TABLE IF EXISTS users`, function(error, result){
    if(error) console.log("error while droping the users table ", error);
    });
    
    connection.query(`CREATE TABLE IF NOT EXISTS users
    (
        id int unsigned NOT NULL auto_increment,
        username varchar(51) NOT NULL,
        firstName varchar(51) NOT NULL,
        lastName varchar(51) NOT NULL,
        password varchar(64) NOT NULL,
        contribution int DEFAULT 0,
        badge varchar(51) DEFAULT NULL,
        isAdmin int DEFAULT 0,
        PRIMARY KEY (id),
        UNIQUE KEY (username)
    )`, function(error, result){
        if(error) console.log("error while creating the users table", error);
    });


    connection.query(`DROP TABLE IF EXISTS channels`, function(error, result){
  if(error) console.log("error while droping the channels table ", error);
});

connection.query(`CREATE TABLE IF NOT EXISTS channels
( id int unsigned NOT NULL auto_increment,
createdBy varchar(51) NOT NULL,
name varchar(51) NOT NULL,
description varchar(300) NOT NULL,
PRIMARY KEY (id)
)`, function (error,result) {
  if(error) console.log("error while creating the channels table ", error);
 });

// Drop the table posts if the table already exists
connection.query(`DROP TABLE IF EXISTS posts`, function(error, result){
  if(error) console.log("error while droping the posts table ", error);
});

connection.query(`CREATE TABLE IF NOT EXISTS posts
( id int unsigned NOT NULL auto_increment,
createdBy varchar(51) NOT NULL,
topic varchar(100) NOT NULL,
data varchar(1000) NOT NULL,
channel_id int unsigned NOT NULL,
PRIMARY KEY (id)
)`, function (error,result) {
  if(error) console.log("error while creating the posts table ", error);
 });

 // Drop the table comments if the table already exists
connection.query(`DROP TABLE IF EXISTS comments`, function(error, result){
  if(error) console.log("error while droping the comments table ", error);
});

connection.query(`CREATE TABLE comments
(
  c_id int unsigned NOT NULL auto_increment,
  createdBy varchar(51) NOT NULL,
  comment varchar(1000),
  post_id int unsigned DEFAULT 0,
  parent_id int unsigned DEFAULT 0,
  number_of_child_comments int unsigned DEFAULT 0,
  PRIMARY KEY (c_id)
)`, function(error, result){
  if(error) console.log("error while creating the comments table ", error);
});



// Drop the table likes if the table already exists
connection.query(`DROP TABLE IF EXISTS likes`, function(error, result){
  if(error) console.log("error while droping the likes table ", error);
});


connection.query(`CREATE TABLE likes
(
  id int unsigned NOT NULL auto_increment,
  post_id int unsigned NOT NULL,
  username varchar(51) NOT NULL,
  comment_id int DEFAULT 0,
  PRIMARY KEY (id)
)`, function(error, result){
  if(error) console.log("error while creating the likes table ", error);
});


// Drop the table dislikes if the table already exists
connection.query(`DROP TABLE IF EXISTS dislikes`, function(error, result){
  if(error) console.log("error while droping the likes table ", error);
});


connection.query(`CREATE TABLE dislikes
(
  id int unsigned NOT NULL auto_increment,
  post_id int unsigned NOT NULL,
  username varchar(51) NOT NULL,
  comment_id int DEFAULT 0,
  PRIMARY KEY (id)
)`, function(error, result){
  if(error) console.log("error while creating the dislikes table ", error);
});

  // insert the adminAccount into database
  connection.query(`INSERT INTO users (username, firstName, lastName, password, contribution) VALUES ('adminAccount', 'Devam', 'Patel', 'password', 10000)`, function(error, result){
    if(error){console.log(error)}
    else
    {
      console.log("adminAccount created!");
    }
  });

    
    res.send("ok");
});

// a route to create a user (sign up)
app.post('/addUser', (req, res) =>
{
    var username = req.body.username;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var hashedPassword;
    // Hashing the password
    // bcrypt.hash(password, saltRounds, (err, hash) => {
    //     if (err) {
    //     console.error(err);
    //     } else {
    //         hashedPassword = hash;
    //     }
    // });

    connection.query(`USE projectdb`, function (error, results) {
        if (error) console.log(error);
      });

    var query = `INSERT INTO users (username, firstName, lastName, password) VALUES ('${username}', '${firstName}', '${lastName}', '${password}')`;
    console.log(query);

    connection.query(query, function (error,result) { if(error) {console.log(error);}; });
    res.send({status: 'ok'}); 

});

// a route to get user id from username and password (login)
app.post('/getUser', async(req, res)=>
{
    var username = req.body.username;
    var password = req.body.password;
    // console.log(username);
    // console.log(password);

    connection.query(`USE projectdb`, function (error, results) {
        if (error) console.log(error);
      });

    var query = `SELECT * FROM users WHERE username = '${username}'`;

    connection.query(query, function (error,result) { if(error) {console.log(error);}; 
    if(result.length > 0)
    {
        // var hashedPassword = result[0].password;
        // bcrypt.compare(password, hashedPassword, (err, res) => {
        //     if (err) {
        //       console.error(err);
        //     } else {
        //       if (res) {
        //         res.send(result[0].id);
        //       } else {
        //         res.send("Incorrect password!");
        //       }
        //     }
        // });
        // console.log(result);
        console.log(result);
        if(password === result[0].password)
        {
            res.status(200).json(result[0].username);
        }
        else
        {
            res.status(401).json("Incorrect password!");
        }
    }
    else
    {
        res.status(401).json("Incorrect username!");
    }});
    

});


 app.post('/addChannel', (req,res) => {
  
  var username = req.body.username;
  var name = req.body.name;
  var description = req.body.description;
  if(name === "") // I am allowing channels without description for now
  {
    res.send("Format of name not valid");
  }
  else
  {

    connection.query(`USE projectdb`, function (error, results) {
      if (error) console.log(error);
    });



    var query = `INSERT INTO channels (createdBy, name, description) VALUES ('${username}', '${name}', '${description}')`;
  console.log(query);

    connection.query(query, function (error,result) { if(error) {console.log(error);}; });
    res.send({status: 'ok'}); 
    }
});


app.post('/addPost', (req,res) => 
{
  var username = req.body.username;
  var topic = req.body.topic;
  var data = req.body.data;
  var channelId = req.body.channelId;
  if(topic === "" || data === null)
  {
    res.send("Format of data or topic not expected");
  }
  else
  {

    connection.query(`USE projectdb`, function (error, results) {
      if (error) console.log(error);
    });


    // Make a user query to increase users contributions
    var userQuery = `SELECT * FROM users WHERE username = '${username}'`;
    
    connection.query(userQuery, function(error, result){
      if(error){console.log(error)}
      else
      {
        // increase the contribution points by 10 for every post added
        var newContribution = result[0].contribution + 10;

        // Update the user
        var newUserQuery = `UPDATE users SET contribution = ${newContribution} WHERE username = '${username}'`;

        connection.query(newUserQuery, function(error, newResult)
        {
          if(error){console.log(error)}
        });
      }
    })

    var query = `INSERT INTO posts (createdBy, topic, data, channel_id) VALUES ('${username}', '${topic}', '${data}', '${channelId}')`;
  console.log(query);

    connection.query(query, function (error,result) { if(error) {console.log(error);}; });
    res.send({status: 'ok'}); 
    }
});


app.post('/addComment', (req, res) =>
{
  var username = req.body.username;
  var comment = req.body.comment;
  var postId = req.body.postId;
  if(comment === "" || postId === null)
  {
    res.send("Incorrect format of comment or postId");
  }
  else
  {
    connection.query(`USE projectdb`, (error, results) =>
    {
      if(error) console.log(error);
    });


    // Make a user query to increase users contributions
    var userQuery = `SELECT * FROM users WHERE username = '${username}'`;
    
    connection.query(userQuery, function(error, result){
      if(error){console.log(error)}
      else
      {
        // increase the contribution points by 5 for every comment added
        var newContribution = result[0].contribution + 5;

        // Update the user
        var newUserQuery = `UPDATE users SET contribution = ${newContribution} WHERE username = '${username}'`;

        connection.query(newUserQuery, function(error, newResult)
        {
          if(error){console.log(error)}
        });
      }
    })


    // console.log(postId);

    var query = `INSERT INTO comments (createdBy, comment, post_id) VALUES ('${username}', '${comment}', '${postId}')`;

    console.log(query);

    connection.query(query, function (error,result) { if(error) {console.log(error);}; });
    res.send({status: 'ok'}); 
  }
});

// A route to add a child comment on a comment
app.post('/addChildComment', async(req, res)=>
{
  var username = req.body.username;
  var comment = req.body.comment;
  var parent_id = req.body.parentId;

  if(comment === "")  // Because parent_id ot username wont be null I am assuming as they are sent by the frontend itself and user has nothing to do with it
  {
    res.send("Incorrect format of comment");
  }
  else
  {
    connection.query(`USE projectdb`, (error, results) =>
    {
      if(error) console.log(error);
    });


    // Make a user query to increase users contributions
    var userQuery = `SELECT * FROM users WHERE username = '${username}'`;
    
    connection.query(userQuery, function(error, result){
      if(error){console.log(error)}
      else
      {
        // increase the contribution points by 5 for every comment added
        var newContribution = result[0].contribution + 5;

        // Update the user
        var newUserQuery = `UPDATE users SET contribution = ${newContribution} WHERE username = '${username}'`;

        connection.query(newUserQuery, function(error, newResult)
        {
          if(error){console.log(error)}
        });
      }
    })

    var query = `INSERT INTO comments (createdBy, comment, parent_id) VALUES ('${username}', '${comment}', '${parent_id}')`;

    console.log(query);

    connection.query(query, function (error,result) { if(error) {console.log(error);}});

    var newQuery = `SELECT * FROM comments WHERE c_id = ${parent_id}`;
    connection.query(newQuery, function(error, results) 
    {
      if(error) 
        {console.log(error)}
      else
      {
        console.log("reached here");
        // Now have to update the childrens in result
        var newChildNo = results[0].number_of_child_comments + 1;  // assuming there will only be 1 entry in results
        console.log(newChildNo);
        var updateQuery = `UPDATE comments SET number_of_child_comments = ${newChildNo} WHERE c_id = ${parent_id}`

        connection.query(updateQuery, function (error,result) { if(error) {console.log(error);}; });
        res.send({status: 'ok'});
      }})
  };

});


app.get('/getChannels', (req,res) => { 

  connection.query(`USE projectdb`, function (error, results) {
    if (error) console.log(error);
   });

  connection.query(`SELECT * FROM channels`, function (error, results) {
  if (error) console.log(error);
  res.send(results); });
 });
 

 app.get('/getPosts', (req, res)=>
 {
  var channel_id = req.query.channelId;

  connection.query(`USE projectdb`, function (error, results) {
    if (error) console.log(error);
   });

   connection.query(`SELECT * FROM posts WHERE channel_id = '${channel_id}'`, function (error, results) {
    if (error) console.log(error);
    res.send(results); });

 });
 

 app.get('/getPost', (req, res)=>
 {
  var postId = req.query.postId;

  connection.query(`USE projectdb`, function (error, results) {
    if (error) console.log(error);
   });

   connection.query(`SELECT * FROM posts WHERE id = '${postId}'`, function (error, results) {
    if (error) console.log(error);
    res.send(results); });

 });
 

app.get('/getComments', (req, res)=>
{
  var postId = req.query.postId;
  if(postId === null)
  {
    res.send("Incorrect format of postId");
  }
  else
  {
    connection.query(`USE projectdb`, (error, results) =>
    {
      if(error) console.log(error);
    });

    var query = `SELECT * FROM comments WHERE post_id = '${postId}'`;
    // console.log("reached here");
    
    connection.query(query, function (error,result) { if(error) {console.log(error); }
  else
  {
    // console.log("I am here");
    // console.log(result);
    res.send(result);
  }});
  }
});


app.get('/getChildComments', (req, res)=>
{
  var parent_id = req.query.parentId;
  if(parent_id === null)
  {
    res.send("Incorrect format of postId");
  }
  else
  {
    connection.query(`USE projectdb`, (error, results) =>
    {
      if(error) console.log(error);
    });

    var query = `SELECT * FROM comments WHERE parent_id = '${parent_id}'`;
    // console.log("reached here");
    
    connection.query(query, function (error,result) { if(error) {console.log(error); }
  else
  {
    console.log(result);
    res.send(result);
  }});
  }
});


// A route to add a like to a post
app.post('/addLikePost', async(req, res)=>
{
  var username = req.body.username;
  var post_id = req.body.postId;
  // see if there is already a like by the current user
  var query = `SELECT * FROM likes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error)
    {
      console.log(error);
    }
    else
    {
      if(result.length > 0)
      {
        // This means there is a like by the current user
        res.send("already liked");
      }
      else
      {
        // This means there isn't a like by the current user so we can add a like
        var newQuery = `INSERT INTO likes (post_id, username) VALUES (${post_id}, '${username}')`;

        connection.query(newQuery, function(error, newResult) {if(error) {console.log(error)};})

        res.send("ok");
      }
    }
  })

});

// A route to unlike a post
app.post('/removeLikePost', async(req, res)=>
{
  var username = req.body.username;
  var post_id = req.body.postId;
  // see if there is a like by the user
  var query = `SELECT * FROM likes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error)
    {
      console.log(error);
    }
    else
    {
      if(result.length > 0)
      {
        // This means there is a like by the  user
        var newQuery = `DELETE FROM likes where username = '${username}' AND post_id = ${post_id}`;
        connection.query(newQuery, function(error, newResult) {if(error) {console.log(error)};})

        res.send("ok");
      }
      else
      {
        // This means there isn't a like by the current user so we can just send a response no like
        res.send("no like");
      }
    }
  })

});


// A route to add a dislike to a post
app.post('/addDislikePost', async(req, res)=>
{
  var username = req.body.username;
  var post_id = req.body.postId;
  console.log(username);
  // see if there is already a dislike by the current user
  var query = `SELECT * FROM dislikes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error)
    {
      console.log(error);
    }
    else
    {
      if(result.length > 0)
      {
        // This means there is a dislike by the current user
        res.send("already disliked");
      }
      else
      {
        // This means there isn't a dislike by the current user so we can add a like
        var newQuery = `INSERT INTO dislikes (post_id, username) VALUES (${post_id}, '${username}')`;

        connection.query(newQuery, function(error, newResult) {if(error) {console.log(error)};})

        res.send("ok");
      }
    }
  })

});

// A route to remove dislike from a post
app.post('/removeDislikePost', async(req, res)=>
{
  var username = req.body.username;
  var post_id = req.body.postId;
  // see if there is a dislike by the user
  var query = `SELECT * FROM dislikes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error)
    {
      console.log(error);
    }
    else
    {
      if(result.length > 0)
      {
        // This means there is a dislike by the  user
        var newQuery = `DELETE FROM dislikes where username = '${username}' AND post_id = ${post_id}`;
        connection.query(newQuery, function(error, newResult) {if(error) {console.log(error)};})

        res.send("ok");
      }
      else
      {
        // This means there isn't a dislike by the current user so we can just send a response no like
        res.send("no dislike");
      }
    }
  })

});


// A route to get likes on a post
app.get('/getLikesPost', async(req, res)=>
{
  var post_id = req.query.postId;

  var query = `SELECT * FROM likes WHERE post_id = ${post_id}`;

  connection.query(query, function(error, result){
    if(error)
    {
      console.log(error);
    }
    else
    {
      var query2 = `SELECT * FROM dislikes WHERE post_id = ${post_id}`;

      connection.query(query2, function(error, results)
      {
        if(error)
        {
          console.log(error);
        }
        else
        {
          // Total likes on a post is it's likes - dislikes = length of result (which is an array of all the likes)- results(which is an array of all the dislikes)
          var likes = result.length - results.length;
          res.json({likes});
        }

      })
      
    }
  })
});

// routes to check if a user has liked or disliked a post
app.get('/checkLiked', async(req, res)=>
{
  var post_id = req.query.postId;

  var username = req.query.username;

  var query = `SELECT * FROM likes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error){console.log(error)}
    else
    {
      res.send(result);
    }
  })
});


app.get('/checkDisliked', async(req, res)=>
{
  var post_id = req.query.postId;

  var username = req.query.username;

  var query = `SELECT * FROM dislikes WHERE username = '${username}' AND post_id = ${post_id}`;

  connection.query(query, function(error, result)
  {
    if(error){console.log(error)}
    else
    {
      res.send(result);
    }
  })
});


// A route for searching content
app.get('/searchContent', async(req, res)=>
{
  var searchTerm = req.query.searchTerm;
  console.log(searchTerm);

  // will have to do wildcard search in posts topic and data and in comments to find out the posts that have content we are searching for

  // first search in posts

  var postQuery = `SELECT * FROM posts WHERE topic LIKE '%${searchTerm}%' OR data LIKE '%${searchTerm}%'`;     // search for any topic or data where there is anything about searchterm

  connection.query(postQuery, function(error, result){
    if(error){console.log(error)}
    else
    {
      console.log("result: ", result);
      if(result.length > 0)
      {
        res.send(result);
      }
      else
      {
        // if there are no posts about it look into comments if there is something
        var commentQuery = `SELECT * FROM comments WHERE comment LIKE '%${searchTerm}%'`;

        connection.query(commentQuery, function(error, results)
        {
          if(error){console.log(error)}
          else
          {
            // first I thought I would check the length here but then decided we don't have the content if the results array is empty after comments query
            // so decided to just return the result and check it in the frontend
            res.send(results);
          }
        })
      }
    }
  })
});


// A route to get the most popular user in the database
// To do this we first search the most liked post and then we search the user who created it
app.get('/mostLikedUser', async(req, res)=>
{
  // For it to work there has to be likes on post in the database
  var countQuery = `SELECT post_id, COUNT(post_id) AS count
  FROM likes
  GROUP BY post_id
  ORDER BY count DESC
  LIMIT 1;
  `;

  connection.query(countQuery, function(error, result){
    if(error){console.log(error)}
    else
    {
      // console.log(result);
      // that works now we eill need to fetch that post from the posts table to see who created it after which we can fetch the user
      var postQuery = `SELECT * FROM posts WHERE id = ${result[0].post_id}`;

      connection.query(postQuery, function(error, postResult)
      {
        if(error){console.log(error)}
        else
        {
          // console.log(postResult);
          // this works now we can fetch the user who created this post and return it
          // or we don't even need to fetch the user we can just return the username
          res.json(postResult[0].createdBy);
        }
      })
    }
  })
});

app.get('/mostDislikedUser', async(req, res)=>
{
  // For it to work there has to be dislikes on post in the database
  var countQuery = `SELECT post_id, COUNT(post_id) AS count
  FROM dislikes
  GROUP BY post_id
  ORDER BY count DESC
  LIMIT 1;
  `;

  connection.query(countQuery, function(error, result){
    if(error){console.log(error)}
    else
    {
      // console.log(result);
      // that works now we eill need to fetch that post from the posts table to see who created it after which we can fetch the user
      var postQuery = `SELECT * FROM posts WHERE id = ${result[0].post_id}`;

      connection.query(postQuery, function(error, postResult)
      {
        if(error){console.log(error)}
        else
        {
          // console.log(postResult);
          // this works now we can fetch the user who created this post and return it
          // or we don't even need to fetch the user we can just return the username
          res.json(postResult[0].createdBy);
        }
      })
    }
  })
});

// A route to get the most contributing user
app.get('/mostContributingUser', async(req, res)=>
{
  // query to get the user with maximum number of contributions
  var query = `SELECT *
  FROM users
  WHERE contribution = (SELECT MAX(contribution) FROM users);
  `;

  connection.query(query, function(error, result)
  {
    if(error){console.log(error)}
    else
    {
      res.json(result[0].username);
    }
  })
});


// A route to get the least contributing user
app.get('/leastContributingUser', async(req, res)=>
{
  // query to get the user with maximum number of contributions
  var query = `SELECT *
  FROM users
  WHERE contribution = (SELECT MIN(contribution) FROM users)
  LIMIT 1;`;

  connection.query(query, function(error, result)
  {
    if(error){console.log(error)}
    else
    {
      res.json(result[0].username);
    }
  })
});

// A route to get content created by a specific user
app.get('/contentByUser', async(req,res)=>
{
  var username = req.query.searchUsername;

  var query = `SELECT * FROM posts WHERE createdBy = '${username}'`;

  connection.query(query, function(error, result){
    if(error){console.log(error)}
    else
    {
      console.log(result);
      res.send(result);
    }
  })
});

app.get('/getProfile', async(req, res)=>
{
  var username = req.query.username;

  var query = `SELECT * FROM users WHERE username = '${username}'`;

  connection.query(query, function(error, result){
    if(error){console.log(error)}
    else
    {
      if(result[0].contribution > 1000)
      {
        result[0].badge = "champion";
      }
      else if(result[0].contribution < 1000 && result[0].contribution > 700)
      {
        result[0].badge = "master";
      }
      else if(result[0].contribution < 700 && result[0].contribution > 500)
      {
        result[0].badge = "intermediate";
      }
      else
      {
        result[0].badge = "beginner";
      }
      res.send(result[0]);
    }
  })
});

app.post('/changePassword', async(req, res)=>
{
  // console.log("changing password");
  var username = req.body.username;

  var newPassword = req.body.newPassword;

  var query = `UPDATE users SET password = '${newPassword}' WHERE username = '${username}'`;

  connection.query(query, function(error, result)
  {
    if(error){console.log(error)}
    else
    {
      // console.log("password updated");
      res.send("ok");
    }
  })
});


app.get('/deleteChannel', async(req, res)=>
{
  var channel_id = req.query.channelId;

  var deleteQuery = `DELETE FROM channels WHERE id = ${channel_id}`;

  connection.query(deleteQuery, (error, results, fields) => {
    if (error) {
      console.error('Error deleting channel:', error);
      res.status(401).json(error);
    } else {
      console.log("deleted channel successfully");
      var postQuery = `DELETE FROM posts WHERE channel_id = ${channel_id}`;
      connection.query(postQuery, (error, results, fields) => {
        if (error) {
          console.error('Error deleting channel:', error);
          res.status(401).json(error);
        } else {
          console.log('posts for channel deleted successfully');

          var commentsQuery = `DELETE FROM posts WHERE c_id = ${channel_id}`;
          connection.query(commentsQuery, (error, results, fields) => {
            if (error) {
              console.error('Error deleting channel:', error);
            } else {
              console.log('comments for channel deleted successfully');
              res.send("ok") ;
            }
          });
        }
      });
    }
  });
});


app.get('/deletePost', async(req, res)=>
{
  var channel_id = req.query.channelId;

  var post_id = req.query.postId;

  var postQuery = `DELETE FROM posts WHERE id = ${post_id} AND channel_id = ${channel_id}`;

  connection.query(postQuery, (error, results) => {
    if (error) {
      console.error('Error deleting posts:', error);
      res.status(401).json(error);
    } else {
      console.log("deleted posts successfully");
      var commentQuery = `DELETE FROM comments WHERE c_id = ${channel_id} AND post_id = ${post_id}`;
      connection.query(commentQuery, (error, results) => {
        if (error) {
          console.error('Error deleting channels:', error);
          res.status(401).json(error);
        } else {
          console.log('comments for posts deleted successfully');
          res.send("ok") ;
        }
      });
    }
  });
});

app.get('/getUsersList', async(req, res)=>{
  var query = `SELECT * FROM users`;

  connection.query(query, function(error, result){
    if(error){console.log(error)}
    else
    {
      res.send(result);
    }
  })
});


app.get('/deleteUser', async(req, res)=>
{
  var userId = req.query.userId;
  var username = req.query.username;

  if(userId !== 1 && username != 'adminAccount')
  {
    //because we are assigning userId 1 to adminAccount
    var query = `DELETE FROM users WHERE id = ${userId} AND username = '${username}'`;

    connection.query(query, function(error, result){
      if(error){console.log(error)}
      else
      {
        // delete all the channels created by user
        var channelQuery = `DELETE FROM channels WHERE createdBy = '${username}'`;
        connection.query(channelQuery, function(error, channelResult){
          if(error){console.log(error)}
          else
          {
            // delete all the posts created by the user
            var postsQuery = `DELETE FROM posts WHERE createdBy = '${username}'`;

            connection.query(postsQuery, function(error, postResult)
            {
              if(error){console.log(error)}
              else
              {
                var commentsQuery = `DELETE FROM comments WHERE createdBy = '${username}'`

                connection.query(commentsQuery, function(error, commentsResult)
                {
                  if(error){console.log(error)}
                  else
                  {
                    res.send("ok");
                  }
                })
              }
            })
          }
        })
      }
    })
  }
});
   
app.listen(PORT, HOST);

app.use('/', express.static('./pages'));

console.log('up and running');

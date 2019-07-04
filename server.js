const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('This is working!');
})

app.listen(3000, ()=>{
  console.log('App is running on port 3000');
})

/*
Router Planning:

We want to have a Route / that responds with 'This is working'
/ -> res = This is working

We want to have a signin route that will likely be a POST request,
Because we are posting some data, in JSON, the user information
and it is gonna to respond with either success or fail
/signing -> POST = success/fail

We'll have a register route that will be a POST request,
since we want to add the data to a database,
or in our case a variable in our server with our new user information
/register -> POST = new user obj

We want to have a profile of user with an optional parameter of userId
in this way each user has its own screen
This likely will be a GET request and it will return the user
/profile/:userId -> GET = user

And because we want to work with ranking, every time a user post a new photo
we want to make sure that their count of how many photo has been submitted
goes up, with a 'score' variable that goes up with every POST of a photo
and checks the other users to see who have submitted the most and give them a rank
/image -> PUT = updated user obj
(update on the user profile of the score) and this will return the updated user obj

*/
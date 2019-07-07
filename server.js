const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
//const saltRounds = 10;
//const salt = bcrypt.genSaltSync(saltRounds);

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'dvinci',
    password : '',
    database : 'facerecog'
  }
});

db.select('*').from('users')
  .then(data=> console.log(data));


const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => { res.send(database.users) })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, ()=>{
  console.log(`App is running on port ${ process.env.PORT }`);
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




// const database = {
//   users : [
//     {
//       id :'123',
//       name : 'John',
//       email : 'john@gmail.com',
//       password : 'cookies',
//       entries : 0,
//       joined : new Date()
//     },
//     {
//       id :'124',
//       name : 'Sally',
//       email : 'sally@gmail.com',
//       password : 'bananas',
//       entries : 0,
//       joined : new Date()
//     }
//   ]
// }
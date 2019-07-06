const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where( 'email', '=', req.body.email  )
    .then(data=> {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user=> {
            res.json(user[0])
          })
          .catch(err=>res.status(400).json('Unable to get user'))
      } else {
        res.status(400).json('Wrong credentials')
      }
    })
    .catch(err=> res.status(400).json('Wrong credentials'))
  // if (req.body.email === database.users[0].email &&
  //     req.body.password === database.users[0].password) {
  //       res.json(database.users[0]);
  //     } else {
  //       res.status(400).json('Error logging in');
  //     }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password, salt);
  // const hash = bcrypt.hash(password, saltRounds, function(err, hash) {});
  db.transaction(trx => {
    trx.insert({
      hash : hash,
      email : email
    })
    .into('login')
    .returning('email')
    .then(loginEmail=> {
      return trx('users')
      .returning('*')
      .insert({
        email: loginEmail[0],
        name : name,
        joined : new Date()
      })
      .then(user => {
        res.json(user[0]);
      })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err=>res.status(400).json('Unable to register...'))
})

app.get('/profile/:id', (req, res) => {
  // console.log(req.params);
  const { id } = req.params;
  db
    .select('*')
    .from('users')
    .where({
      id: id
    })
    .then(user=>{
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found!')
      }
    })
    .catch(err=>res.status(400).json('Error getting user!'))
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err=>res.status(400).json('Unable to get entries'))

  // let found = false;
  // database.users.forEach(user => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries ++;
  //     return res.json(user.entries);
  //   }
  // })
  // if (!found) {
  //   res.status(400).json('Not found!');
  // }
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
/*var http = require('http');

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'text/plain'});

  res.end('Hello World\n');

}).listen(3000, '127.0.0.1');

console.log('Server running at http://127.0.0.1:3000/');
*/


var express = require('express');

var MongoClient = require('mongodb').MongoClient;

const bodyParser= require('body-parser')

var path = require('path')

var ejs = require('ejs')

var cors = require('cors')

var db

const app = express();

var router = express.Router();

//console.log(router)

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())

//app.set('view engine', 'ejs')

//app.set('views', 'C:\\nodestu\\views')

//app.use(express.static('C:\\nodestu\\public'))

app.use(bodyParser.json())

//app.use(app.router)


MongoClient.connect('mongodb://localhost:27017/student', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})



app.get('/', function(req, res){

 // res.sendFile('index.html')

   //res.sendfile(path.resolve('index.html'))

   db.collection('personal_details').find().toArray(function(err, results) {

   if (err) return console.log(err)

  // res.render(view, locals)

 // res.render('index2.ejs', {istudent : results})

console.log(results)

res.header("Access-Control-Allow-Origin", "*");

res.header("Access-Control-Allow-Headers", "X-Requested-With");

res.json(results);
  // send HTML file populated with quotes here
})

});




app.get('/search/:rno',cors(), function(req, res){

 // res.sendFile('index.html')

  // res.sendfile(path.resolve('index.html'))

  rno = Number(req.params.rno)

//  console.log(rno)

   db.collection('personal_details').find({'rollno':rno}).toArray(function(err, results) {

   if (err) return console.log(err)

  // res.render(view, locals)

 // res.render('index2.ejs', {istudent : results})

  console.log(results)

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  res.json(results)

  // send HTML file populated with quotes here
})

});




app.post('/istudent', (req, res) => {

  console.log(req.body)

    db.collection('personal_details').insert(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')

	res.redirect('/')

  })

  })

app.post('/update/:sid', (req, res) => {

  console.log(req.params.sid);

  var rno  = Number(req.params.sid)

  var fn = req.body.fname

  var ln = req.body.lname

  var age = req.body.age

   db.collection('personal_details')
  .findOneAndUpdate(

  {'rollno': rno},

  {
    $set: {
	  'rollno' : rno,
	  'fname' : fn,
    'lname' : ln,
    'age' : age
  }
  }
,
  (err, result) => {
    if (err)
		return console.log('some error')

    console.log(result)

	res.send('{"status": "ok"}')

  }

)

});
//		res.redirect('/')

	//	res.send();
//});


/*
app.route('/delete/:sid')

.delete(function (req, res) {

  console.log(req.params.sid);

  db.collection('personal_details').findOneAndDelete

  (

  {'rollno':req.params.sid},

  (err, result) => {
    if (err)
    return console.log(err)

  //	res.send('A student got deleted')

  res.redirect('/')
  })
    //res.send('Get a random book')
  })
*/

app.delete('/delete/:sid', (req, res) => {

  console.log(req.params.sid);

  db.collection('personal_details').findOneAndDelete

  (

  {'rollno': Number(req.params.sid)},

  (err, result) => {
    if (err)
		return console.log('some error')

    console.log(result)

	res.send('{"status": "ok"}')

  })

	//res.send();
});



/*router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
*/


/*
router.route('/delete/:sid')

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {


      console.log(sid)

      db.collection('personal_details').findOneAndDelete

      (

      {'rollno':req.params.sid},

      (err, result) => {
        if (err)
    		return console.log(err)

    //	res.send('A student got deleted')

    	res.redirect('/')
      })

    	//res.send();
    });

    //});

module.exports = router
*/

app.put('/istudent',(req, res) => {
  // Handle put request

   db.collection('personal_details')
  .findOneAndUpdate(

  {rollno: req.body.rollno},

  {
    $set: {
	  rollno:req.body.rollno,
      fname: req.body.fname,
	  lname: req.body.lname,
	  age: req.body.age
    }
  },

  {
    sort: {_id: -1},
    upsert: true
  },

  (err, result) =>
  {
    if (err) return console.log(err)

	//res.send(result)

	console.log('modified record')

	res.redirect('/')

  })


})

/*
app.delete('/istudent', (req, res) => {

  db.collection('personal_details').findOneAndDelete

  (

  {rollno:req.body.rollno},

  (err, result) => {
    if (err)
		return console.log(err)

//	res.send('A student got deleted')

	res.redirect('/')
  })


})
*/

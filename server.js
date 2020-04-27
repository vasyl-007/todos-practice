// server.js

// BASE SETUP
// ==============================================

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

// Type 3: Persistent datastore with automatic loading
var Datastore = require('nedb')
    , db = new Datastore({ filename: './src/data/todos.db', autoload: true });

// This will help to load other included files in index.html
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.set('views', ['./src/assets']) // specify the views directory
//app.set("view options", { layout: false });
app.use(express.static(__dirname));

// ROUTES
// ==============================================

// Get all todo items
app.get('/api/todos', function (req, res) {
    // Find all documents in the collection
    db.find({}).sort({ today: -1 }).exec(function (err, docs) {
        if (err) {
            return err;
        }
        res.status(200).send(docs);
    });

});

app.post('/api/addTodo', function (req, res) {
    var doc = {
        title: req.body.title,
        status: req.body.status,
        isDone: req.body.isDone,
        description: req.body.description,
        dateCreated: req.body.dateCreated,
        dateUpdated: new Date(),
        today: new Date()
    };

    db.insert(doc, function (err, newDoc) {   // Callback is optional
        // newDoc is the newly inserted document, including its _id
        // newDoc has no key called notToBeSaved since its value was undefined
        if (err) {
            return err;
        }
        res.status(200).send(newDoc);
    });
});

app.put('/api/updateTodo', function (req, res) {
    // Set an existing field's value
    db.update({ _id: req.body.id }, { $set: { title: req.body.title, description: req.body.description, dateCreated: req.body.dateCreated, dateUpdated: new Date() } }, { multi: false }, function (err, numReplaced) {
        db.find({ _id: req.body.id }).sort({ today: -1 }).exec(function (err, docs) {
            if (err) {
                return err;
            }
            res.status(200).send(docs[0]);
        });
    });
});

app.put('/api/completeTodo', function (req, res) {
    // Set an existing field's value
    db.update({ _id: req.body.id }, { $set: { status: req.body.status, isDone: req.body.isDone } }, { multi: false }, function (err, numReplaced) {
        db.find({ _id: req.body.id }).sort({ today: -1 }).exec(function (err, docs) {
            if (err) {
                return err;
            }
            res.status(200).send(docs[0]);
        });
    });
});

app.delete('/api/removeTodo', function (req, res) {
    db.remove({ _id: req.body.id }, {}, function (err, numRemoved) {
        if (err) {
            return err;
        }
        res.status(200).send({ status: 'OK', message: 'Item removed successfully from database.' });
    });
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    });
});

// Handle 404 Error
app.use(function (req, res) {
    res.status(400).send({ error: '404: File Not Found', message: "Plese Go Back to Home page." });
});

// Handle 500 Error
app.use(function (error, req, res, next) {
    res.status(500).send({ error: '500: Internal Server Error', message: error });
});

// START THE SERVER
// ==============================================

app.listen(port, function () {
    console.log(`Server is listening at http://localhost:${port}/`);
});


/*
// server.js
// =====================================

// A simple node server using express.js to serve static files and content

const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// SET A FOLDER LOCATION FOR ANGULAR APP TO SERVE STATIC JS, CSS, IMAGES OTHER FILES
app.use(express.static(path.join(__dirname + '/dist/app1/')));


// 404 catch
app.get('*', (req, res) => {
	console.log("DIR :", __dirname);
	console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);

	res.status(200).sendFile(path.join(__dirname + '/dist/app1/' + 'index.html'));

});

app.listen(port, function () {
	console.log(`Server is listening at http://localhost:${port}/`);
});
 */

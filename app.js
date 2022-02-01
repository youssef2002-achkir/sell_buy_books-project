
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
var crypto = require('crypto');

//Creation du session sql
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "youssef_database"
});
//connexion aux bases de donnees
db.connect((err) => {
    if (err) {
        throw err;
    } else
        console.log('MySql Connected...'); // Successful connection console message
    /*db.query('SELECT username,password from customer', function(err, rows, fields) {
        var l = [];
        var users = [];
        if (err) throw err;
        for (let i = 0; i <= rows.length;i++){
            l[0] = rows[i].username;
            l[1] = rows[i].password;
            users.push(l);

        console.log(l[0]);
        }});*/


});





const app = express();
app.use(express.static(__dirname));
app.use(express.static(__dirname));

// Use Pug to render our HTML pages
app.set('view engine', 'pug');

// Body Parser for JSON-Encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Stores sessions

app.use(
    session({
        secret: "jd96x6c7v8bjasdjhkj8nfd4x3zkasd",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: false
        }
    })
);



//login
app.get('/', function (req, res) {
    /*if (req.session.managerusername) {
        res.redirect('/checkstock')
    } else if (req.session.customerusername) {
        res.render('customerportal', {
            firstName: req.session.customerfirstname,
            lastName: req.session.customerlastname
        });
    } else {
        res.sendFile(path.join(__dirname + '/Html/mainPage.html'));
    }*/
    res.sendFile(path.join(__dirname + '/Html/mainPage.html'));
});
//logout
app.get('/logout', function (req, res) {
    req.session.destroy(); // destroy all session variables
    res.sendFile(path.join(__dirname + '/Html/mainPage.html'));
});

// Customer Sign In
app.get('/customersignin', function (req, res) {
    res.sendFile(path.join(__dirname + '/Html/customerlogin.html'));
});

// Customer Register
app.get('/newuserlogin', function (req, res) {
    res.sendFile(path.join(__dirname + '/Html/newuserlogin.html'));
});

// Manager Sign In
app.get('/managersignin', function (req, res) {
    res.sendFile(path.join(__dirname + '/Html/administratorlogin.html'));
});
app.get('/mainPage', function (req, res) {
    res.sendFile(path.join(__dirname + '/Html/mainPage.html'));
});
//customer portal
app.get('/customerpage',function (req,res) {
    res.sendFile(path.join(__dirname) + '/Html/customerpage.html');
})
app.post('/customerlogin', function (req,res) {
    var Uname = req.body.username;
    var Upass = req.body.password;
    let sql = "SELECT * FROM customer WHERE username = '" + Uname + "' and password = '" + Upass + "';"
    let query = db.query(sql, (err, results) => {
        if (err || Object.keys(results).length === 0)
             res.redirect("/loginfailure");

        else {
            req.session.customerusername = results[0]["Username"];
            req.session.customerfirstname = results[0]["firstname"];
            req.session.customerlastname = results[0]["lastname"];
            req.session.customeremail = results[0]["email"];
            req.session.save(); // save session variables
            res.redirect("/customerpage");

        }
    });
});
//manager portal
app.get('/managerpage', function (req,res) {
    res.sendFile(path.join(__dirname + '/Html/managerpage.html'))
})
app.post('/administratorlogin',function (req,res) {
    var Mname = req.body.username;
    var Mpass = req.body.password;
    let sql = "SELECT * FROM manager WHERE username = '" + Mname + "' AND password = '" + Mpass + "';"
    let query = db.query(sql, (err, results) => {
        if (err || Object.keys(results).length === 0)
            res.redirect("/loginfailure");
        else {
            req.session.managerusername = results[0]["username"];
            req.session.managerfirstname = results[0]["firstname"];
            req.session.managerlastname = results[0]["lastname"];
            req.session.save(); //save session variables

            //Then render the check stock page once logged in
            res.redirect("/managerpage");
        }
    });

});
//New user registration
app.post("/registercustomer", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var last = req.body.last;
    var first = req.body.first;
    var email = req.body.email;
    var phone = req.body.phone;
    let sql = "INSERT INTO Customer VALUES('" + username + "', '" + password + "', '" + last + "', '" + first + "', '" + email + "', '" + phone +"');"
    let query = db.query(sql, (err, results) => {
        if (err) {
            res.send("loginfailure");
        }
        else {
            req.session.customerusername = username;
            req.session.customerfirstname = first;
            req.session.customerlastname = last;
            req.session.customeremail = email;
            req.session.save(); // save session variables
            res.redirect("/customerpage");
        }
    });
});

//Guest portal
app.get('/guestpage', function (req,res) {
    res.sendFile(path.join(__dirname + '/Html/guestpage.html'));
})
app.listen(3000);




var express = require('express'),
path = require('path'),
pug = require('pug'),
mongoose = require('mongoose'),
PollModel = require('polls'),
UserModel = require('users'),
bodyParser = require('body-parser'),
url = require('url'),
session = require('express-session'),
app = express();

var port = process.env.PORT || 8080

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/scripts'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'whatever',
    resave: false,
    saveUninitialized: false
  }));

app.get('/', function(req, res) {
    PollModel.find({}).sort({ time: -1 }).limit(8).exec(function(err, listpolls){
        if (err) throw err;
        res.render('homepage', { title: 'Poll List', poll_list: listpolls, userid: req.session.userID});
    });
});


app.get('/register', function(req, res) {
    res.render('regpage', { funcpage: true });
});

app.get('/login', function(req, res) {
    res.render('loginpage', { funcpage: true });
});

app.get('/logout', function(req, res, next) {
    if (req.session.userID) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                res.redirect('/');
            };
        });
    };
});

app.get('/usercheck*', function(req, res) {
    var name = url.parse(req.url).pathname.slice(20).toUpperCase();

    UserModel.findOne({ username: name }, { '_id': 0, 'username': 1 }).exec(function(err, user) {
        if (err) throw err;
        res.end(JSON.stringify(user));
    });
});

app.get('/emailcheck*', function(req, res) {
    var email = url.parse(req.url).pathname.slice(18).toUpperCase();

    UserModel.findOne({ email: email }, { '_id': 0, 'email': 1 }).exec(function(err, user) {
        if (err) throw err;
        res.end(JSON.stringify(user));
    });
});

app.get('/all', function(req, res) {
    PollModel.find({}).sort({ time: -1 }).exec(function(err, listpolls){
        if (err) throw err;
        res.render('allpage', { title: 'Poll List', poll_list: listpolls, userid: req.session.userID });
    });
});

app.post('/register', function(req, res){
    var userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        polls: [],
        votes: 0
    }

    UserModel.create(userData, function(err, user){
        if (err) {
            return next(err);
        } else {
            return res.redirect('/');
        }
    });
});

app.post('/login', function(req, res, next) {
    if (req.body.username && req.body.password) {
        UserModel.authenticate(req.body.username.toUpperCase(), req.body.password, function(err, user) {
            if (err | !user) {
                res.render('loginpage', { username: req.body.username, error: 'Invalid Password', funcpage: true })
            } else {
                if (req.session.redirect) {
                    req.session.userID = user._id;
                    var target = req.session.redirect;
                    delete req.session.redirect;
                    return res.redirect(target);
                }
                req.session.userID = user._id;
                PollModel.find({}).sort({ time: -1}).limit(8).exec(function(err, listpolls){
                    return res.render('homepage', { title: 'Poll List', poll_list: listpolls, userid: req.session.userID });
                });
            }
        })
    } else {
        var errmsg = new Error('All fields are required');
        errmsg.status = 401;
        return next(err);
    }
})


app.get('/create', auth, function(req, res, next) {
    res.render('createpoll', { userid: req.session.userID, funcpage: true });
})

app.post('/create', function(req, res) {
    UserModel.findOne({ _id: req.session.userID }).exec(function(err, user) {
        var pollData = {
            title: req.body.title,
            user: user.username.toLowerCase(),
            userid: req.session.userID,
            time: new Date().toISOString(),
            votes: {},
            total_votes: 0
        }

        var options = Object.values(req.body);

        while (options.indexOf('') > -1) {
            var index = options.indexOf('');
            options.splice(index, 1);
        }

        options = options.reverse();
        for (i=0; i<options.length; i++) {
            options[i] = options[i].replace(/\./g,'%2E')
        }

        for (i=0; i<options.length - 1; i++) {
            pollData.votes[options[i]] = 0;
        }

        PollModel.create(pollData, function(err, poll){
            if (err) {
                return next(err);
            } else {
                return res.render('pollcreated', {funcpage: true, userid: req.session.userID, pollid: poll._id });
            }
        });
    })
})

app.get('/mypolls', auth, function(req, res, next) {
    PollModel.find({ userid: req.session.userID}).sort({ time: -1 }).exec(function(err, listpolls) {
        if (err) throw err;
        res.render('mypolls', { title: 'Poll List', poll_list: listpolls, userid: req.session.userID});
    })
})

app.get('/polls*', function(req, res) {
    var parsed = url.parse(req.url);
    var pollid = parsed.search.slice(1);
    PollModel.find({ _id: pollid }, function(err, poll) {
        var options = Object.keys(poll[0].votes);
        for (i=0; i<options.length; i++) {
            options[i] = options[i].replace(/%2E/g,'.')
        }
        res.render('viewpoll', {funcpage: true, userid: req.session.userID, pollid: pollid, viewpoll: poll, option_list: options });
    })
})

app.post('/vote*', function(req, res) {
    var parsed = url.parse(req.url);
    var pollid = parsed.search.slice(1);
    var vote = req.body.optiongroup.replace(/\./g,'%2E');
    var voter = {};
    voter['votes.' + vote] = 1;
    voter['total_votes'] = 1;

    PollModel.findOneAndUpdate({_id: pollid}, {$inc : voter}).exec(function(err, poll) {
        if (err) throw err;
        res.redirect('/polls?' + pollid);
    })
})

app.get('/delete*', function(req, res) {
    var parsed = url.parse(req.url);
    var pollid = parsed.search.slice(1);
    PollModel.find({ _id: pollid}, function(err, poll) {
        if (err) return err;
        if (poll[0].userid === req.session.userID) {
            PollModel.findOneAndRemove({ _id: pollid}, function(err) {
                if (err) throw err;
                res.render('polldeleted', {funcpage: true, userid: req.session.userID })
            })
        } else {
            res.render('notyours', { funcpage: true, userid: req.session.userID })
        }
    })
})

app.post('/updateoption*', function(req, res) {
    var parsed = url.parse(req.url);
    pollid = parsed.pathname.slice(17)
    var adder = {};
    adder['votes.' + parsed.query.replace(/%20/g, " ")] = 0;

    PollModel.findOneAndUpdate({ _id: pollid }, adder).exec(function(err, poll) {
        if (err) throw err;
        res.redirect('/polls?' + pollid)
    })
})

app.get('/test', function(req, res) {
    PollModel.find({}, function(err, data) {
        res.render('test', { data: data })
    })
})

function auth (req, res, next) {
    if (req.session.userID) {
        return next();
    } else if (!req.session.userID) {
        req.session.redirect = req.path;
        res.render('loginpage', { funcpage: true })
        }
    };


app.listen(port, function(){
    console.log('app running on http://localhost:' + port);
})
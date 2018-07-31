const db = require('../models');
const deleteGame = require("./game").deleteGame;

exports.getAdmin = function (req, res) {
    /*
        req.params gives _id of admin
    */
    console.log("asdfasdfasdf");
    db.Admin.findById(req.params.id)
        .populate("users")
        .populate("games")
        .then(function (dbAdmin) {
            console.log("Admin:", dbAdmin);
            res.json(dbAdmin);
        })
        .catch(function (err) {
            return res.json(err);
        });
}

exports.saveAdmin = function (req, res) {
    /*req.body syntax:
    {
        username: {username of admin},
        password: {password of admin}
    }
    */
    db.Admin.create(req.body)
        .then(function (dbAdmin) {
            // If we were able to successfully update a Game, send it back to the client
            res.json(dbAdmin);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
}


exports.updateAdmin = function (req, res) {
    /*req.body syntax:
    {
        id: {_id of game to be updated}
        username: {username of admin},
        password: {password of admin}
        
    }*/
    db.Admin.findByIdAndUpdate(req.body.id,
        {
            username: req.body.username,
            password: req.body.password
        }, { new: true })
        .then(function (dbAdmin) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbAdmin);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
}


exports.deleteAdmin = function (req, res) {
    /*
        req.params gives _id of admin
    */
    db.Admin.findById(req.params.id, "users games")
        .then(function (dbAdmin) {
            console.log("target admin:", dbAdmin);
            dbAdmin.users.forEach(id => {
                db.User.findByIdAndRemove(id)
                    .then(function () {
                        console.log("removed user:", id);
                    })
                    .catch(function (err) {
                        // If an error occurred, send it to the client
                        return res.json(err);
                    });
            });
            dbAdmin.games.forEach(id => {
                deleteGame({ params: { id: id } }, res);
            });
        })
        .then(function () {
            db.Admin.findByIdAndRemove(req.params.id)
                .then(function (removed) {
                    console.log("Removed Admin:", removed);
                    res.json(removed);
                })
                .catch(function (err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
}
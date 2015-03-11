/**
 * Created by Maddie on 3/10/2015.
 */

var restify = require('restify'),
    mongoose = require('mongoose'),
    db_creds = require('./conf/db_conf.json');

var db = mongoose.connect(("mongodb://%username%:%password%@ds053300.mongolab.com:53300/solobuy".replace("%username%",
    db_creds.db.username).replace("%password%", db_creds.db.password)));  // Pulls username and password from conf file
console.log("Database connection initiated successfully!");

var server = restify.createServer({name: 'Solobuy_Server' });
server.pre(restify.pre.sanitizePath());

//var port = process.argv[2] != null ? process.argv[2] : 3000; //If parameter exists, use as port, if not port 300
server.listen(3000, function() {
    console.log("Server listening on port %d", 3000);
});

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/items', function(req, res, next) {
/* Gets list of all items
 *
 * Parameters:
 *  page (optional)
 *  query (optional)
 */
};

server.get('/items/:id', function(req, res, next) {
/* Gets item with id :id
 *
 * Parameters:
 *
 */
};

server.get('/auctions', function(req, res, next) {
/* Gets list of all upcoming auctions
 *
 * Parameters:
 *   page (optional)
 */
};

server.get('/auctions/current', function(req, res, next) {
/* Gets the current auction
 *
 * Parameters:
 *   NONE
 */
};

server.post('/create/item/:id', function(req, res, next) {
/* Creates item or auction with :id
 *
 * Parameters:
 *   ownerId (required)
 *   body (required)
 *   title (required)
 *   picture (required)
 *   suggestedPrice (required)
 */
};

server.post('/create/auction/:id', function(req, res, next) {
    /* Creates item or auction with :id
     *
     * Parameters:
     *   ownerId (required)
     *   body (required)
     *   title (required)
     *   picture (required)
     *   suggestedPrice (required)
     */
};

server.post('/create/comment/on/:type/:typeId', function(req, res, next) {

};

server.put('/vote/on/:type/:id', function(req, res, next) {

};




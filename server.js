
const express = require('express');
const morgan = require('morgan');

const app = express();

const blogPostsRouter = require('./blogPostsRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// when requests come into '/blog-posts`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/blog-posts', blogPostsRouter);



/////////////we are going to need to start and stop our server
function runServer() {
	const port = process.env.PORT || 8080; 
	return new Promise((resolve, reject) => {
		app.listen(port, ()=> {
			console.log(`Your app is listening on port ${port}`);
			resolve();
		})
		.on('error', err => {
			reject(err);
		});
	});
		
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
}

//////////we need to declare the variable server so that whent he server runs from above
/////////it assigns a value.

let server;

function runServer() {
	const port = process.env.Port || 8080;
	return new Promis((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`your app is listing on port ${port}`);
			resolve(server); 
		}).on('error', err => {
			reject(err)
		});

		});

}

////////////this function needs to  retunr a promise. server.close does not
/////////////return one on its own, so we manually create one.

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

//////////if the server is run directly from somewhere else, then we run an error
//////////// but we also exper the runServer command so the other code can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


//GET and POST requests should go to /blog-posts.
//DELETE and PUT requests should go to /blog-posts/:id.
//Use Express router and modularize routes to /blog-posts.

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');

const {BlogPosts} = require('./model');

const jsonParser = bodyParser.json();


// adding some blogs to `BlogPosts` so there's something
// to retrieve. Note that to create a new blog post, you need to supply a title, content, an author name, 
//and (optionally) a publication date.

BlogPosts.create(
  'What The Color Blue Means to Me', 'The color blue means calm, clear days, Jamaican waters, and cosy blankets', 'Darcy DeAngelo-Woolsey', '');


// send back JSON representation of all blogs
// on GET requests to root
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `BlogPosts.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.params.title,
    content: req.params.content,
    author: req.params.author,
    publishDate: req.params.publishDate
  });
  res.status(204).json(updatedItem);
});

// when DELETE request comes in with an id in path,
// try to delete that item from BlogPosts.
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog item \`${req.params.ID}\``);
  res.status(204).end();
});

module.exports = router;

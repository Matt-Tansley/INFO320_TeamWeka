const express = require("express"); // make sure we're using express!
const app = express(); // make our 'app' an express one.
const port = process.env.PORT || 3000; // Port that the server will run on. Will use a default available one, otherwise 3000.

app.use(express.static(__dirname + "/src")); // make sure we are getting stuff from the src folder.

app.get("/", (req, res) => res.sendFile(__dirname + "/src/index.html"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'dist');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// when going to an empty path like localhost:2000, the app will
// send you to the spacetime website
app.get('*', (req, res) => {
   res.sendFile(path.join(publicPath, 'index.html'));
});

// this allows us to access any file in the /client repo
app.use('/dist', express.static(__dirname + '/dist'));

// app.get('/metaverse/spawn-planet/', (req, res) => {
//     console.log("here");
//     res.sendFile(path.join(publicPath, 'metaverse/spawn-planet.html'))
// })

app.listen(port, () => {
   console.log(`Server is up on port: ${port}`);
});
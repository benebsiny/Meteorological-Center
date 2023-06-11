const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


app.use('/api', createProxyMiddleware({ target: 'http://backend:5000', changeOrigin: true }));


app.use(express.static('build'));


app.get('*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});


app.listen(3000, () => {
    console.log('Frontend is running on port 3000');
});

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 设置代理
app.use('/api', createProxyMiddleware({ target: 'http://backend:5000', changeOrigin: true }));

// 托管静态文件
app.use(express.static('build'));

// 重定向所有请求到 index.html
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
});

// 启动服务器
app.listen(3000, () => {
    console.log('Frontend is running on port 3000');
});

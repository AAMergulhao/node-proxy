const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));

app.use('/proxy/**', createProxyMiddleware({
    target: 'http://localhost:8080/',
    changeOrigin: true,
    pathRewrite: {
        [`^/proxy`]: '',
    },
    onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('x-added', 'foobar');
    }
}));

app.get('/test', (req, res) => {
    console.log("Headers:", req.headers);
    res.send(`P = ${req.query.p}`)
});

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server listening on port ${PORT}`);
        return;
    }
    console.log(`Error: ${err}`);
})
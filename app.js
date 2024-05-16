const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API',
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post Created...',
                authData
            });
        }
    });
    
});

app.post('/api/login', (req, res) => {
    // Mock user 
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com',
    }

    jwt.sign({user: user}, 'secretKey',{ expiresIn: '30s' }, (err, token) => {
        res.json({
            token: token
        });
    });
});

// FORMAT OF THE TOKEN
// Authorization: Bearer <access_token>

// verify token function middleware
function verifyToken(req, res, next) {
    // Get the auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space and use the second item in the array (token ONLY)
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        // Forbidden (You can send a res.json with your own error message)
        res.sendStatus(403);
    }
}

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}!`);
});


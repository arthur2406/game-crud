'use strict';

const https = require('https');
const http = require('http');
const { saveAndGroupGames } = require('./gameModel');

const { getGamesApi, updateGamesApi, deleteGamesApi } = require('./controllers/gamesController');

const server = http.createServer((req, res) => {
    if (req.url.match(/\/api\/games\/\w+/)) {
        const asin = req.url.split('/')[3];

        if (req.method === 'GET') {
            getGamesApi(req, res, asin);
        } else if (req.method === 'PUT') {
            updateGamesApi(req, res, asin);
        } else if (req.method === 'DELETE') {
            deleteGamesApi(req, res, asin);
        }

        return;
    } 

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route Not Found' }));
    
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Make initial GET request to third-party API.

    https.get('https://api.apify.com/v2/datasets/z0PzhOM8YnDpNxPLw/items?token=ioRdCccgWATA4qfSt4nASYxkH', (res) => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            console.error();
            throw new Error(`Request Failed. Status Code: ${statusCode}. Please try to restart server.`)
        }

        let data = '';

        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            const resultGames = JSON.parse(data);

            // Group games by ASIN and save.
            saveAndGroupGames(resultGames)
        });

        
    });
});

module.exports = server;
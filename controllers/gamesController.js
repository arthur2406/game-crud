const { findByAsin, updateByAsin, removeByAsin } = require('../models/gameModel');
const { getPostData } = require('../utils'); 

// @desc Get all games by ASIN
// @route GET /api/games/:asin
const getGamesApi = async (req, res, asin) => {
    try {
        const games = await findByAsin(asin);
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(games));
        
    } catch (error) {
        console.log(error);
    }
}


// @desc Update games by ASIN
// @route PUT /api/games/:asin
const updateGamesApi = async (req, res, asin) => {
    try {
        const games = await findByAsin(asin);

        if (!games) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ message: 'Games with such ASIN not found.' }));

            return;
        }

        const body = await getPostData(req);

        const gameData = JSON.parse(body);
        
        const { sellerName, fullPrice, title, url, keyword, description } = gameData;

        gamesData = [];

        games.forEach(game => {
            const gameData = {
                sellerName: sellerName || game.sellerName,
                fullPrice: fullPrice || game.fullPrice,
                title: title || game.title,
                url: url || game.url,
                description: description || game.description,
                keyword: keyword || keyword
            }
            gamesData.push(gameData);
        });
        
        const updatedGames = await updateByAsin(asin, gamesData);
        
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(updatedGames));
        
    }
     catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Error occurred during games updating.' }));
        console.log(error);
    }
}


// @desc Delete games by asin
// @route DELETE /api/games/:asin
const deleteGamesApi = async (req, res, asin) => {
    try {
        const games = await findByAsin(asin);

        if (!games) {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ message: 'Games with such ASIN not found.' }));
        }

        const deletedGames = await removeByAsin(asin);

        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify(deletedGames));
        
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Games with such ASIN not found.' }));
        console.log(error);
    }
}


module.exports = {
    getGamesApi,
    updateGamesApi,
    deleteGamesApi
}
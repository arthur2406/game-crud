// Main data storage.
let gamesGrouped = {};

const saveAndGroupGames = (gamesArr) => {
    gamesGrouped = gamesArr.reduce((acc, crrVal) => {
        acc[crrVal.ASIN] = acc[crrVal.ASIN] || [];
        acc[crrVal.ASIN].push((({ ASIN, ...o }) => o)(crrVal));
        return acc;
    }, {});
}

const findByAsin = (asin) => Promise.resolve(gamesGrouped[asin]);

const updateByAsin = (asin, gameData) => {
    return new Promise((resolve, reject) => {
        if (!gamesGrouped[asin]) reject(new Error('No games with such ASIN.'))
        gamesGrouped[asin] = gameData;
        resolve(gamesGrouped[asin]);
    });

}

const removeByAsin = (asin) => {
    return new Promise((resolve, reject) => {
        if (!gamesGrouped[asin]) reject(new Error('No games with such ASIN.'));
        const deleted = [ ...gamesGrouped[asin] ];
        delete gamesGrouped[asin];
        resolve(deleted);
    })
}

module.exports = {
    saveAndGroupGames,
    findByAsin,
    updateByAsin,
    removeByAsin
};
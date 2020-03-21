if (process.env.NODE_ENV === 'production') {
    module.exports = require('./productionDB');
} else {
    module.exports = require('./developmentDB');
}
var database = require('./database');
var timeago = require('timeago');

var stats;
var generated;
var bankrollOffset = parseInt(process.env.BANKROLL_OFFSET) || 0;

function getSiteStats() {
    database.getSiteStats(function(err, results) {
        if (err) {
            return new Error('Unable to get site stats: \n' + err);
        }

        stats = results;
        generated = new Date();
    });
}

setInterval(getSiteStats, 1000 * 60 * 20);
getSiteStats();

exports.index = function(req, res, next) {
    if (!stats) {
        return next('Stats are loading');
    }
    var user = req.user;

    stats.bankroll_offset = bankrollOffset;

    res.render('stats', { user: user, generated: timeago(generated), stats: stats });

};

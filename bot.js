var twit = require('twit');
var config = require('./config.js');
var reTweetHashtags = ['#codethisdesign', "#purecss", "#cssanimations", "#csstips", "#uidesign"];



var Twitter = new twit(config);
var params = {
    q: "",
    result_type: 'recent',
    lang: 'en',
    count: 10
}
var retweet = function() {
    reTweetHashtags.forEach(element => {
        params.q = element;
        Twitter.get('search/tweets', params, function(err, data) {
            // if there no errors
            if (!err) {
                if (data.statuses && data.statuses.length > 0) {
                    data.statuses.forEach(element => {
                        if (element.id_str) {
                            var retweetId = element.id_str;
                            // Tell TWITTER to retweet
                            Twitter.post('statuses/retweet/:id', {
                                id: retweetId
                            }, function(err, response) {
                                // if there was an error while tweeting
                                if (err) {
                                    if (err.allErrors && (err.allErrors[0].code === 187 || err.allErrors[0].code === 327)) { /*do nothing*/ } else console.log("Retweet error: ", err);
                                }
                            });
                        }
                    });

                }
            }
            // if unable to Search a tweet
            else {
                console.log('Search Error', err);
            }
        });
    });




};

setInterval(retweet, 60000);
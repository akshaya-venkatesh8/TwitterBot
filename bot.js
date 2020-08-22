var twit = require('twit');
var config = require('./config.js');
var reTweetHashtags = ['#codethisdesign', "#purecss", "#cssanimations", "#csstips", "#uidesign"];



var Twitter = new twit(config);
var params = {
    q: "",
    result_type: 'recent',
    lang: 'en',
    count: 30
}
var retweet = function() {
    reTweetHashtags.forEach(element => {
        params.q = element;
        Twitter.get('search/tweets', params, function(err, data) {
            // if there no errors
            if (!err) {
                if (data.statuses && data.statuses.length > 0) {
                    data.statuses.forEach(element => {
                        // Do not retweet - retweets
                        if (element.id_str && element.text && !element.text.startsWith("RT")) {
                            var retweetId = element.id_str;
                            // Tell TWITTER to retweet
                            Twitter.post('statuses/retweet/:id', {
                                id: retweetId
                            }, function(err, response) {
                                console.log("Retweet successful:", response);
                                if (err) {
                                    if (err.allErrors && (err.allErrors[0].code === 187 || err.allErrors[0].code === 327)) { /*do nothing*/ } else console.log("Retweet error: ", err);
                                }
                            });
                        }
                    });

                }
            }
            // In case of an error in Search
            else {
                console.log('Search Error', err);
            }
        });
    });




};
// retweet();
setInterval(retweet, 60000);
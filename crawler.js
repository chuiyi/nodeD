var Crawler = require('crawler');
var url = require('url');
var url_array = [];

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server

        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            if (toQueueUrl.indexOf('http') === 0 && toQueueUrl.indexOf('dmm.co.jp') > -1) {
                console.log('crawl url: ' + toQueueUrl);
                crawler_dmm_queue(toQueueUrl);
            }
        });
    }
});

function crawler_dmm() {
    c.queue('http://www.dmm.co.jp');
}

function crawler_dmm_queue(url) {
    c.queue([{
        uri: url,
        jQuery: true,

        callback: function (error, result, $) {
            if($) {
                $('a').each(function(index, a) {
                    var toQueueUrl = $(a).attr('href');
                    if (toQueueUrl && toQueueUrl.indexOf('http') === 0 && toQueueUrl.indexOf('dmm.co.jp') > -1 && crawler_parseUrl(toQueueUrl)) {
                        console.log('crawl url: ' + toQueueUrl);
                        crawler_dmm_queue(toQueueUrl);
                    }
                });
            }
        }
    }]);
}

function crawler_parseUrl(url) {
    var returnValue = url_array.indexOf(url) > -1;
    returnValue = !returnValue;
    if (!returnValue) {
    } else {
        url_array.push(url);
        console.log("crawl url length: " + url_array.length);
    }

    return returnValue;
}

crawler_dmm();
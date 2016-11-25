var url = require('url');
var Crawler = require('crawler');
var mongoose = require('mongoose');

var url_array = [];
var url_blacklist = [];

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        crawler_ParseElement($);
    }
});

function crawler_dmm_queue(url) {
    c.queue([{
        uri: url,
        jQuery: true,

        callback: function (error, result, $) {
            if($) {
                crawler_ParseElement($);
            }
        }
    }]);
}

function crawler_ParseElement($) {
    if($) {
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            if (toQueueUrl && toQueueUrl.indexOf('http') === 0 && toQueueUrl.indexOf('dmm.co.jp') > -1 && !crawler_CheckUrlExist(toQueueUrl)) {
                // console.log('crawl url: ' + toQueueUrl);
                crawler_dmm.ParseUrl_dmm(toQueueUrl);
                crawler_dmm_queue(toQueueUrl);
            }
        });

        // $('img').each(function(index, img) {
        //     var toQueueUrl = $(img).attr('src');
        //     if (toQueueUrl && toQueueUrl.indexOf('http') === 0 && toQueueUrl.indexOf('dmm.co.jp') > -1 && !crawler_CheckUrlExist(toQueueUrl)) {
        //         console.log('crawl url: ' + toQueueUrl);
        //         crawler_dmm_queue(toQueueUrl);
        //     }
        // });
    }
}

function crawler_CheckUrlExist(url) {
    var isUrlExist = url_array.indexOf(url) > -1;
    if (!isUrlExist) {
        url_array.push(url);
        // console.log("crawl url length: " + url_array.length);
    }

    return isUrlExist;
}



function crawler_CheckUrlInBlackList(url) {
}

var crawler_dmm = {
    url_array_video : [],
    Queue : function() {
        c.queue('http://www.dmm.co.jp');
    },
    ParseUrl_dmm : function(url) {
        if (url.indexOf('digital') > -1 && url.indexOf('videoa') > -1 && url.indexOf('detail') > -1) {
            // console.log(url);
            crawler_dmm.CheckUrlExist_dmm_Video(url);
        }
    },
    ParseImg_dmm : function(url) {

    },
    CheckUrlExist_dmm_Video : function(url) {
        var isUrlExist = crawler_dmm.url_array_video.indexOf(url) > -1;
        if (!isUrlExist) {
            crawler_dmm.url_array_video.push(url);
            // console.log("crawl video length: " + crawler_dmm.url_array_video.length);
            console.log("crawl video: " + url);
        }

        return isUrlExist;
    }
};

crawler_dmm.Queue();
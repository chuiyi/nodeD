// ================ require setting ================
var url = require('url');
var fs = require('fs');
var Crawler = require('crawler');
// var mongoose = require('mongoose');
var mongoose_js = require('./mongoose.js');

// ================ crawler setting ================
var crawler_dmm = {
    Queue : function() {
        c.queue('http://www.dmm.co.jp/');
        c.queue('http://www.dmm.co.jp/digital/videoa/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/list/=/sort=ranking/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/list/=/sort=saleranking_asc/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/list/=/sort=bookmark_desc/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/list/=/article=keyword/id=6565/sort=ranking/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/ranking/=/sort=ranking/term=daily/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/ranking/=/sort=ranking/term=weekly/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/ranking/');
        c.queue('http://www.dmm.co.jp/digital/videoa/-/ranking/=/sort=ranking/type=actress/');
        c.queue('http://actress.dmm.co.jp/-/top/');
    },
    ParseUrl : function(url) {
        if (url.indexOf('digital') > -1 && url.indexOf('videoa') > -1 && url.indexOf('detail') > -1) {
            crawler_dmm.CheckUrlExistVideo(url);
        }

        if (url.indexOf('actress.dmm.co.jp') > -1 && url.indexOf('detail') > -1 && url.indexOf('actress_id') > -1) {
            crawler_dmm.CheckUrlExistActress(url);
        }
    },
    CheckUrlExistVideo : function(url) {
        var str_cid = '';
        var array_href = url.split('/');
        for (var x = 0; x < array_href.length; x++) {
            if(array_href[x].indexOf('cid') > -1)
                str_cid = array_href[x].replace('cid=', '');
        }
        if (cid.length > 0) {
            Video.find({ cid: str_cid }, function (err, result) {
                if (err) return console.error(err);
                // console.log('video find successful!' + video_result);
                if (!result || result.length == 0) {
                    crawler_dmm.CrawlVideo.queue(url);
                }
            });
        }
    },
    CheckUrlExistActress : function(url) {
        // crawler_dmm.CrawlActress.queue(url);
    },
    CrawlVideo : new Crawler({
        maxConnections : 3,

        callback : function (error, result, $) {
            if ($.contains('このサービスはお住まいの地域からはご利用になれません')) {
                // console.log('video unaccessable');
                return;
            }

            var actress = {};
            var dmm_video = new Video();
            dmm_video.title = $('#title')[0].children ? $('#title')[0].children[0].data : '';
            dmm_video.url_image_cover = $('#sample-video').children('a').length > 0 ? $('#sample-video').children('a')[0].attribs.href : '';
            dmm_video.description = $('div.mg-b20.lh4')[0].children[0].data.replace(/\n/g, '');

            var td_nw = $('td.nw');
            for (var v = 0; v < td_nw.length; v++) {
                if (td_nw[v].children[0].data.indexOf('品番') > -1)
                    dmm_video.cid = td_nw[v].next.next.children[0].data.replace(/\n/g, '');
                if (td_nw[v].children[0].data.indexOf('配信開始日') > -1)
                    dmm_video.date_sale_online = td_nw[v].next.next.children[0].data.replace(/\n/g, '').replace('----', '').split(' ')[0];
                if (td_nw[v].children[0].data.indexOf('商品発売日') > -1)
                    dmm_video.date_sale_stock = td_nw[v].next.next.children[0].data.replace(/\n/g, '').replace('----', '').split(' ')[0];
                if (td_nw[v].children[0].data.indexOf('メーカー') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        dmm_video.maker = {};
                        dmm_video.maker.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                dmm_video.maker.id = array_href[x].replace('id=', '');
                        }
                    }
                }
                if (td_nw[v].children[0].data.indexOf('シリーズ') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        dmm_video.series = {};
                        dmm_video.series.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                dmm_video.series.id = array_href[x].replace('id=', '');
                        }
                    }
                }
                if (td_nw[v].children[0].data.indexOf('監督') > -1) {
                    if (td_nw[v].next.next.children[0].name == 'a') {
                        dmm_video.director = {};
                        dmm_video.director.name = td_nw[v].next.next.children[0].children[0].data;
                        var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                        for (var x = 0; x < array_href.length; x++) {
                            if(array_href[x].indexOf('id') > -1)
                                dmm_video.director.id = array_href[x].replace('id=', '');
                        }
                    }
                }
            }

            dmm_video.performer = [];
            var obj_performer = $('#performer')[0];
            if (obj_performer) {
                for (var v = 0; v < obj_performer.children.length; v++) {
                    if (obj_performer.children[v].name == 'a') {
                        if (obj_performer.children[v].children[0].data.indexOf('▼すべて表示する') > -1) {

                        } else {
                            var performer = {};
                            performer.name = obj_performer.children[v].children[0].data;
                            var array_href = obj_performer.children[v].attribs.href.split('/');
                            for (var x = 0; x < array_href.length; x++) {
                                if(array_href[x].indexOf('id') > -1)
                                    performer.id = array_href[x].replace('id=', '');
                            }
                            dmm_video.performer.push(performer);
                        }
                    }
                }
            }

            dmm_video.url_image_sample = [];
            for (var v = 1; v <= $('a[name="sample-image"]').length; v++) {
                dmm_video.url_image_sample.push('http://pics.dmm.co.jp/digital/video/' + dmm_video.cid + '/' + dmm_video.cid + 'jp-' + v + '.jpg');
            }
            dmm_video.url_video = 'http://www.dmm.co.jp/digital/videoa/-/detail/=/cid=' + dmm_video.cid + '/';

            // console.log('video ' + dmm_video.cid + ' parse successful!');
            Video.find({ cid: dmm_video.cid }, function (err, video_result) {
                if (err) return console.error(err);
                // console.log('video find successful!' + video_result);
                if (!video_result || video_result.length == 0) {
                    dmm_video.save(function (err2, video_result2) {
                        if (err2) return console.error(err2);
                        console.log(video_result2.cid + ' save successful!');
                    });
                }
            });

            //actress

            //series

            //maker

            //director

            // console.log(dmm_video);
        }
    }),
    CrawlActress : new Crawler({
        maxConnections : 3,

        callback : function (error, result, $) {
            if ($.contains('このサービスはお住まいの地域からはご利用になれません')) {
                // console.log('video unaccessable');
                return;
            }
        }
    }),
};

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        crawler_ParseElement($);
    }
});

function crawler_ParseElement($) {
    if($) {
        $('a').each(function (index, a) {
            var url = $(a).attr('href');
            if (url && url.indexOf('http') === 0 && url.indexOf('dmm.co.jp') > -1 && !crawler_CheckUrlExist(url)) {
                crawler_dmm.ParseUrl(url);
                c.queue(url);
            }
        });
    }
}

var url_array = [];
function crawler_CheckUrlExist(url) {
    var isUrlExist = url_array.indexOf(url) > -1;
    if (!isUrlExist) {
        url_array.push(url);
    }

    return isUrlExist;
}

function exitHandler(options, err) {
    fs.writeFileSync('url_history.json', JSON.stringify(url_array));

    if (options.cleanup) ;
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

function load() {
    fs.readFile('url_history.json', 'utf8', function (err, data) {
        if (err) {
            console.log('init history file url_history.json');
        } else {
            if (data) {
                url_array = JSON.parse(data);
            }
        }
    });

    process.stdin.resume();//so the program will not close instantly

    //do something when app is closing
    process.on('exit', exitHandler.bind(null,{cleanup:true}));

    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, {exit:true}));

    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
}

// ================ execute ================
load();
crawler_dmm.Queue();
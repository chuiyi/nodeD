var url = require('url');
var Crawler = require('crawler');
var mongoose = require('mongoose');


// ================ mongoose setting ================
mongoose.connect('mongodb://chuiyi:iyiuhc@ds163417.mlab.com:63417/love-machine');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var simpleItemSchema = mongoose.Schema({
    name: String,
    id: String,
});

var SimpleItem = mongoose.model('SimpleItem', simpleItemSchema);

var videoSchema = mongoose.Schema({
    title: String,
    url_video: String,
    url_image_cover: String,
    description: String,
    performer: [ { name: String, id: String } ],
    date_sale_online: Date,
    date_sale_stock: Date,
    director: { name: String, id: String },
    series: { name: String, id: String },
    maker: { name: String, id: String },
    cid: String,
    url_image_sample: [ String ],
});

var Video = mongoose.model('Video', videoSchema);



// ================ crawler setting ================

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        crawler_ParseElement($);
    }
});

var crawler_Video = new Crawler({
    maxConnections : 10,

    callback : function (error, result, $) {
        // console.log($);
        if ($.contains('このサービスはお住まいの地域からはご利用になれません')) {
            console.log('video unaccessable');
            return;
        }

        var actress = {};
        var dmm_video = new Video();
        dmm_video.title = $('#title')[0].children[0].data;
        dmm_video.url_image_cover = $('#sample-video').children('a')[0].attribs.href;
        dmm_video.description = $('div.mg-b20.lh4')[0].children[0].data.replace(/\n/g, '');

        var td_nw = $('td.nw');
        for (var v = 0; v < td_nw.length; v++) {
            if (td_nw[v].children[0].data.indexOf('品番') > -1)
                dmm_video.cid = td_nw[v].next.next.children[0].data.replace(/\n/g, '');
            if (td_nw[v].children[0].data.indexOf('配信開始日') > -1)
                dmm_video.date_sale_online = td_nw[v].next.next.children[0].data.replace(/\n/g, '').split(' ')[0];
            if (td_nw[v].children[0].data.indexOf('商品発売日') > -1)
                dmm_video.date_sale_stock = td_nw[v].next.next.children[0].data.replace(/\n/g, '').split(' ')[0];
            if (td_nw[v].children[0].data.indexOf('シリーズ') > -1) {
                if (td_nw[v].next.next.children[0].name == 'a') {
                    dmm_video.series = new SimpleItem();
                    dmm_video.series.name = td_nw[v].next.next.children[0].children[0].data;
                    var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                    for (var x = 0; x < array_href.length; x++) {
                        if(array_href[x].indexOf('id') > -1)
                            dmm_video.series.id = array_href[x].replace('id=', '');
                    }
                }
            }
            if (td_nw[v].children[0].data.indexOf('メーカー') > -1) {
                if (td_nw[v].next.next.children[0].name == 'a') {
                    dmm_video.maker = new SimpleItem();
                    dmm_video.maker.name = td_nw[v].next.next.children[0].children[0].data;
                    var array_href = td_nw[v].next.next.children[0].attribs.href.split('/');
                    for (var x = 0; x < array_href.length; x++) {
                        if(array_href[x].indexOf('id') > -1)
                            dmm_video.maker.id = array_href[x].replace('id=', '');
                    }
                }
            }
            if (td_nw[v].children[0].data.indexOf('監督') > -1) {
                if (td_nw[v].next.next.children[0].name == 'a') {
                    dmm_video.director = new SimpleItem();
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
                    var performer = new SimpleItem();
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
                dmm_video.save(function (err, video_result2) {
                    if (err) return console.error(err);
                    console.log(video_result2.cid + ' save successful!');
                });
            }
        });

        // console.log(dmm_video);
    }
});

function crawler_ParseElement($) {
    if($) {
        $('a').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            if (toQueueUrl && toQueueUrl.indexOf('http') === 0 && toQueueUrl.indexOf('dmm.co.jp') > -1 && !crawler_CheckUrlExist(toQueueUrl)) {
                crawler_dmm.ParseUrl_dmm(toQueueUrl);
                crawler_dmm_queue(toQueueUrl);
            }
        });
    }
}

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

var url_array = [];
function crawler_CheckUrlExist(url) {
    var isUrlExist = url_array.indexOf(url) > -1;
    if (!isUrlExist) {
        url_array.push(url);
        // console.log("crawl url length: " + url_array.length);
    }

    return isUrlExist;
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
            crawler_Video.queue(url);
            // console.log("crawl video length: " + crawler_dmm.url_array_video.length);
            // console.log("crawl video: " + url);
        }

        return isUrlExist;
    }
};



crawler_dmm.Queue();
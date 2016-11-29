var mongoose = require('mongoose');

// ================ mongoose setting ================
mongoose.connect('mongodb://chuiyi:iyiuhc@ds163417.mlab.com:63417/love-machine');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

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

var actressSchema = mongoose.Schema({
    id: String,
    name: String,
    url_image: String,
    video: [ String ],
});

var Actress = mongoose.model('Actress', actressSchema);

var makerSchema = mongoose.Schema({
    id: String,
    name: String,
    video: [ String ],
});

var Maker = mongoose.model('Maker', makerSchema);

var seriesSchema = mongoose.Schema({
    id: String,
    name: String,
    video: [ String ],
});

var Series = mongoose.model('Series', seriesSchema);

var directorSchema = mongoose.Schema({
    id: String,
    name: String,
    video: [ String ],
});

var Director = mongoose.model('Director', directorSchema);

var settingSchema = mongoose.Schema({
    url_history: [ String ],
});

var Setting = mongoose.model('Setting', settingSchema);

// ================ mongoose test ================
function mongoose_execute() {
    Video.find(function (err, video_result) {
        if (err) return console.error(err);
        // console.log('video find successful!' + video_result);
        if (!video_result || video_result.length == 0) {
            return;
        }
        // console.log(video_result[0]);
        for (var x = 0; x < video_result.length; x++) {
        // for (var x = 0; x < 1; x++) {
            var video = video_result[x];

            // console.log('video: ' + video.title + ' start processing');
            if(video.maker.id) {
                Maker.find({ id: video.maker.id }, function (err, result) {
                    if (err) return console.error(err);
                    if (!result || result.length == 0) {
                        console.log('[' + video.maker.name + '] not found');
                        // var maker_new = new Maker();
                        // maker_new.id = video.maker.id;
                        // maker_new.name = video.maker.name;
                        // maker_new.video.push(video.cid);
                        // maker_new.save(function (err2, result2) {
                        //     if (err2) return console.error(err2);
                        //     console.log('maker: ' + result2.name + ' create successful!');
                        // });
                    } else {
                        console.log('[' + video.maker.name + '] found!');
                        if(result[0].video.indexOf(video.cid) > -1) {
                        } else {
                            result[0].video.push(video.cid);
                            result[0].save(function (err2, result2) {
                                if (err2) return console.error(err2);
                            });
                        }
                    }
                });
            }

            // if(video.series.id) {
            //     Series.find({ id: video.series.id }, function (err, result) {
            //         if (err) return console.error(err);
            //         if (!result || result.length == 0) {
            //             var series_new = new Series();
            //             series_new.id = video.series.id;
            //             series_new.name = video.series.name;
            //             series_new.video.push(video.cid);
            //             series_new.save(function (err2, result2) {
            //                 if (err2) return console.error(err2);
            //                 console.log('series: ' + result2.name + ' create successful!');
            //             });
            //         } else {
            //             if(result.video.indexOf(video.cid) > -1) {
            //             } else {
            //                 result.video.push(video.cid);
            //                 result.save(function (err2, result2) {
            //                     if (err2) return console.error(err2);
            //                 });
            //             }
            //         }
            //     });
            // }

            // if(video.director.id) {
            //     Director.find({ id: video.director.id }, function (err, result) {
            //         if (err) return console.error(err);
            //         if (!result || result.length == 0) {
            //             var director_new = new Director();
            //             director_new.id = video.director.id;
            //             director_new.name = video.director.name;
            //             director_new.video.push(video.cid);
            //             director_new.save(function (err2, result2) {
            //                 if (err2) return console.error(err2);
            //                 console.log('director: ' + result2.name + ' create successful!');
            //             });
            //         } else {
            //             if(result.video.indexOf(video.cid) > -1) {
            //             } else {
            //                 result.video.push(video.cid);
            //                 result.save(function (err2, result2) {
            //                     if (err2) return console.error(err2);
            //                 });
            //             }
            //         }
            //     });
            // }

            // if(video.performer.length > 0) {
            //     for (var y = 0; y < video.performer.length; y++) {
            //         var actress = video.performer[y];

            //         Actress.find({ id: actress.id }, function (err, result) {
            //             if (err) return console.error(err);
            //             if (!result || result.length == 0) {
            //                 var actress_new = new Actress();
            //                 actress_new.id = actress.id;
            //                 actress_new.name = actress.name;
            //                 actress_new.video.push(video.cid);
            //                 actress_new.save(function (err2, result2) {
            //                     if (err2) return console.error(err2);
            //                     console.log('actress: ' + result2.name + ' create successful!');
            //                 });
            //             } else {
            //                 if(result.video.indexOf(video.cid) > -1) {
            //                 } else {
            //                     result.video.push(video.cid);
            //                     result.save(function (err2, result2) {
            //                         if (err2) return console.error(err2);
            //                     });
            //                 }
            //             }
            //         });
            //     }
            // }
        }
    });
}

// mongoose_execute();
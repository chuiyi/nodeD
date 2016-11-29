var mongoose = require('mongoose');

// ================ mongoose setting ================
mongoose.connect('mongodb://chuiyi:iyiuhc@ds163417.mlab.com:63417/love-machine');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// var simpleItemSchema = mongoose.Schema({
//     name: String,
//     id: String,
// });

// var SimpleItem = mongoose.model('SimpleItem', simpleItemSchema);

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

function execute() {
    // Video.find({ cid : 'h_1142np00001' }, function (err, video_result) {
    //     console.log(video_result);
    //     if (err) return console.error(err);
    //     // console.log('video find successful!' + video_result);
    //     if (!video_result || video_result.length == 0) {
    //         return;
    //     }
    // });

    Video.find({ 'performer.name' : '高橋しょう子' }, function (err, video_result) {
        console.log(video_result);
        if (err) return console.error(err);
        // console.log('video find successful!' + video_result);
        if (!video_result || video_result.length == 0) {
            return;
        }
        // for (var x = 0; x < video_result.length; x++) {
        //     var video = video_result[x];
        // }
    });
}

execute();
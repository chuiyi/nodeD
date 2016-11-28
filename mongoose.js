var mongoose = require('mongoose');
mongoose.connect('mongodb://chuiyi:iyiuhc@ds163417.mlab.com:63417/love-machine');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

var simpleItemSchema = mongoose.Schema({
    name: String,
    id, String,
});

var SimpleItem = mongoose.model('SimpleItem', simpleItemSchema);

var videoSchema = mongoose.Schema({
    title: String,
    url_image_cover, String,
    description: String,
    performer: [ SimpleItem ]
    date_sale_online: Date,
    date_sale_stock: Date,
    director: SimpleItem,
    series: SimpleItem,
    maker: SimpleItem,
    cid: String,
    url_image_sample: [ String ]
});

var Video = mongoose.model('Video', videoSchema);
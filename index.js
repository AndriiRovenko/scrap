const cheerio = require ('cheerio');
const rp = require ('request-promise');

const MongoClient = require ('mongodb').MongoClient;
const assert = require ('assert');
const ObjectId = require ('mongodb').ObjectID;
//const url = '';
//var elements = [];
rp('http://dominos.ua/ru/Pizza/')
    .then(function (htmlString) {
		let $ = cheerio.load(htmlString);

    let elements = [];
    $('body > div.main > div.products_grid > div.product_item').each(function(i, elem){
      let link = this; //is it really faster ??
      let tmp = {};
      tmp.id = $(link)
        .attr('data-osg-pk');
      tmp.name = cheerio.load(link)('p > a')
        .text()
        .replace(/\n/g,'');
      tmp.photo = cheerio.load(link)('div.product_img_holder > a > img')
        .attr('src');
      tmp.ingredients = cheerio.load(link)('div.product_img_holder > div.product_mix > p')
        .text()
        .replace(/\n/g,'')
        .split(',');
      elements[i] = tmp;
    });
    
    //------------------------------------------------------
var insertDocuments = function(db, callback) {
  var collection = db.collection('test');
  collection.insertMany(elements, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted documents into the collection");
    callback(result);
  });
}

MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db){
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    db.close();
  });
});
    //------------------------------------------------------

    })
    .catch(function (err) {
		console.log(err);
    });

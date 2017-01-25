const cheerio = require ('cheerio');
const rp = require ('request-promise');

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
    
    console.log(elements);

    })
    .catch(function (err) {
		console.log(err);
    });
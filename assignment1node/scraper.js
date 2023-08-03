const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

mongoose.connect('mongodb://devanshdvd07:devanshdvd@ac-zknxlow-shard-00-00.8au1fin.mongodb.net:27017,ac-zknxlow-shard-00-01.8au1fin.mongodb.net:27017,ac-zknxlow-shard-00-02.8au1fin.mongodb.net:27017/?ssl=true&replicaSet=atlas-bhie8w-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const countrySchema = new mongoose.Schema({
  name: String,
});
const Country = mongoose.model('Country', countrySchema);

const url = "https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3";

async function scrapeData() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const listItems = $(".plainlist ul li");
    const countries = [];
    listItems.each((idx, el) => {
      const country = { name: "", iso3: "" };
      country.name = $(el).children("a").text();
      countries.push(country);
    });
    console.dir(countries);
    await Country.insertMany(countries.map((obj) =>  obj ));

    console.log('Countries stored in the database.');
    
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}
scrapeData();
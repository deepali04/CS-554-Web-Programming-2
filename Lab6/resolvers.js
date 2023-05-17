const axios = require("axios");
const redis = require("redis");
const REDIS_PORT = process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const uuid = require("uuid");

(async () => {
  await client.connect();
})();

const md5 = require('blueimp-md5');
const publickey = '5bf72f4203737170690f2c24311880b0';
const privatekey = '8483f596b0b88897abe9beae317cd432806b1a3e';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

module.exports = {
  Query: { 
    singleCharacterInfo: async (_, args) => {

      let charData = {};
      let redisAdded = [];
      redisAdded = await client.get(`character_${args.id}`);
      if (redisAdded) {
        console.log("Data Retrieved from cache for single character");
        const redisImage = JSON.parse(redisAdded);
        return redisImage;
      }

      const { data } = await axios.get(baseUrl + "/"+ args.id + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash);
      console.log(data.data.results[0])
      let tempData = data.data.results[0];

      charData.id = tempData.id;
      charData.characterName = tempData.name;
      charData.description = tempData.description;
      charData.CharImage = tempData.thumbnail.path +  "." + tempData.thumbnail.extension;

      let comicsList = []
      tempData.comics.items.forEach(comic => {
        let comicInfo = {}
        comicInfo.url = comic.resourceURI
        comicInfo.name = comic.name
        comicsList.push(comicInfo)      
      });

      let seriesList = []
      tempData.series.items.forEach(series => {
        let seriesInfo = {}
        seriesInfo.url = series.resourceURI
        seriesInfo.name = series.name
        seriesList.push(seriesInfo)      
      });

      let eventsList = []
      tempData.stories.items.forEach(event => {
        let eventInfo = {}
        eventInfo.url = event.resourceURI
        eventInfo.name = event.name
        eventsList.push(eventInfo)      
      });
      charData.comics = comicsList;
      charData.events = eventsList;
      charData.series = seriesList;
      charData.collected = false;
        
      await client.set(`character_${args.id}`, JSON.stringify(charData));
      console.log("Data Stored from cache for single character");
      return charData;
    },

    characterList: async (_, args) => {
       let resultData = {};
       if(typeof(args.searchTerm) === 'undefined'){
        redisAdded = await client.get(`offset_${args.offset}`);
        if (redisAdded) {
          console.log("Data Retrieved from cache for list");
          const redisImage = JSON.parse(redisAdded);
          return redisImage;
        }
      }

      const wholeData = await axios.get(url);

      // // if(args.searchTerm){
      //   const { data } = await axios.get(url + "&nameStartsWith=" + args.searchTerm);
      //   tempData = data.data.results;

      // // }
     
      const { data } = await axios.get(url + "&offset="+ args.offset);
      
      let tempData = data.data.results;
      let searchedData = []
      if(typeof(args.searchTerm)==='string'){
        const { data } = await axios.get(url + "&nameStartsWith=" + args.searchTerm);
        tempData = data.data.results;
      }

       let allCharacters = []
      tempData.forEach(character => {
        let charData = {};
        charData.id = character.id;
        charData.characterName = character.name;
        charData.description = character.description;
        charData.CharImage = character.thumbnail.path +  "." + character.thumbnail.extension;

        let comicsList = []
        character.comics.items.forEach(comic => {
          let comicInfo = {}
          comicInfo.url = comic.resourceURI
          comicInfo.name = comic.name
          comicsList.push(comicInfo)      
        });

        let seriesList = []
        character.series.items.forEach(series => {
          let seriesInfo = {}
          seriesInfo.url = series.resourceURI
          seriesInfo.name = series.name
          seriesList.push(seriesInfo)      
        });

        let eventsList = []
        character.stories.items.forEach(event => {
          let eventInfo = {}
          eventInfo.url = event.resourceURI
          eventInfo.name = event.name
          eventsList.push(eventInfo)      
        });
              
        charData.comics = comicsList;
        charData.events = eventsList;
        charData.series = seriesList;
        charData.collected = false;
        allCharacters.push(charData)

      });

      resultData.charCount= data.data.total;
      resultData.charList=allCharacters
      await client.set(`offset_${args.offset}`, JSON.stringify(resultData));
      console.log("Data Stored in cache for list");
      return resultData;     
  }, 
}
}



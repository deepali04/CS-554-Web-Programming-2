const { ApolloServer, gql } = require('apollo-server');
const uuid  = require('uuid');
const axios = require('axios');
const redis = require('redis');
const redisClient = redis.createClient();


(async () => {
  await redisClient.connect();
})();

const FOURSQUARE_API_ACCESS_KEY = "fsq3Ae0jiosgLrWSHaEuM1gwM85A6DuIAELcLbsnfd/2FpM=";

const typeDefs = gql` 
  type Location{
    id: ID!
    image: String
    name: String
    address: String
    userPosted: Boolean
    liked: Boolean

  }
  
  type Query{
    locationPosts(pageNum: Int) : [Location]
    likedLocations : [Location]
    userPostedLocations : [Location]
  } 

  type Mutation{
    uploadLocation(image: String!, address: String!, name: String!) : Location
    updateLocation(id: ID!, image: String, name: String, address: String, userPosted: Boolean, liked: Boolean) : Location
    deleteLocation(id: ID!) : Location
  }
  `;  

  const getLocationPosts = async (pageNum) =>{    
    console.log("after pageNum " + pageNum);  
    const config = {
      headers:{
        Accept : 'application/json',
        Authorization : FOURSQUARE_API_ACCESS_KEY
      }
    };

    let data, link;

    if(pageNum===0 || pageNum===1){
      ({data} = await axios.get('https://api.foursquare.com/v3/places/search' ,config));
      //console.log(data)
    }
    else if(pageNum===2) {
      ({data}= await axios.get('https://api.foursquare.com/v3/places/search?cursor=c3I6MTA; rel="next"', config));
    }
    else if(pageNum===3) {
      ({data}= await axios.get('https://api.foursquare.com/v3/places/search?cursor=c3I6MTUw&%20rel=%22next%22&%20rel=%22next; rel="next"', config));
    }
    else if(pageNum===4) {
      ({data}= await axios.get('https://api.foursquare.com/v3/places/search?cursor=c3I6MjAw&%20rel=%22next%22&%20rel=%22next; rel="next"', config));
    }
    else{
      return [0]
    }

    let locationsList = [];

    for (i = 0; i < data.results.length; i++) {
      let imageData = await axios.get(`https://api.foursquare.com/v3/places/${data.results[i].fsq_id}/photos` ,config);
      let imageString= (imageData.data.length) ? (imageData.data[0].prefix+ 'original'+ imageData.data[0].suffix) : null

      let singleLocation = {
        id: data.results[i].fsq_id,
        image: imageString,
        name: data.results[i].name,
        address: data.results[i].location.formatted_address, 
        userPosted: false,
        liked: false
      };
    locationsList.push(singleLocation);
    console.log(locationsList);
    }   
    return locationsList; 

  };


  const getLikedLocations= async () =>{ 
    let LocationList =[];
    let locationIDList =  await redisClient.lRange("LocationList", 0, -1);
    console.log(locationIDList);
    for (let i = 0; i < locationIDList.length; i++){
      let location = await redisClient.HGET('locationSet', locationIDList[i]);
      LocationList.push(JSON.parse(location));
    }
    return LocationList;
  }


  const getUserPostedLocations = async() => {
    let LocationList = [];
    let locationIDList = await redisClient.lRange("userLocationList", 0, -1);
    for (let i = 0; i < locationIDList.length; i++){
      let location = await redisClient.HGET('userLocationSet',locationIDList[i]);
      LocationList.push(JSON.parse(location));
      //console.log(LocationList);
    }
    return LocationList;

  }

  async function uploadLocation (image, address, name) {
    let location = {
      id: uuid.v4(),
      image: image,
      address: address, 
      name: name,
      userPosted: true,
      liked: false
    }

    await redisClient.HSET('userLocationSet', location.id, JSON.stringify(location));
    await redisClient.LPUSH('userLocationList', location.id);
  }


  async function updateLocation(id, image, name, address, userPosted, liked) {
    let updatedLocation = {
      id: id,
      image: image,
      address: address, 
      name: name,
      userPosted: userPosted,
      liked: liked
    }

    let exists = await redisClient.HEXISTS('locationSet',updatedLocation.id);
    console.log("EXISTS", exists);

    if (exists === false) {
      console.log("adding entry");  
      await redisClient.HSET('locationSet', updatedLocation.id, JSON.stringify(updatedLocation));
      await redisClient.LPUSH('LocationList', updatedLocation.id);
    } else{
      console.log("removing entry");
      await redisClient.HDEL('locationSet', updatedLocation.id);
      await redisClient.LREM('LocationList', 0, updatedLocation.id);
    }
    return updatedLocation;
  }


  async function deleteLocation (id) {

    //let exists = await redisClient.HEXISTS('locationSet',updatedLocation.id);
    console.log(" Inside deleteLocation");
    console.log(id)
    await redisClient.HDEL('userLocationSet', id);  
    await redisClient.LREM('userLocationList', 0, id);
  }


  const resolvers = {
    Query: {
      locationPosts: async(_, args) => await getLocationPosts(args.pageNum),
      likedLocations: async () => await getLikedLocations(),
      userPostedLocations: async () => await getUserPostedLocations()
    
    },
  
    Mutation: {
      uploadLocation: async (_, args) => await uploadLocation(args.image, args.address, args.name),
      updateLocation: async (_, args) => await updateLocation(args.id, args.image, args.name, args.address, args.userPosted, args.liked),
      deleteLocation: async (_, args) => await deleteLocation(args.id)
    
    }
  };
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}🚀 `);
  });
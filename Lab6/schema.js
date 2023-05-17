const { gql } = require("apollo-server");

const typeDefs = gql`
  type SingleCharacter {
    id: Int
    characterName: String
    description: String
    CharImage: String
    comics: [Comics]
    series: [Series]
    events: [Events]
    collected: Boolean!
  }

  type Comics {
    name: String
    url: String
  }

  type Series {
    name: String
    url: String
  }

  type Events {
    name: String
    url: String
  }

  type CharacterList {
    charCount: Int
    charList: [SingleCharacter]
  }

  type Query {
    characterList(offset: Int, searchTerm: String): CharacterList
    singleCharacterInfo(id: Int): SingleCharacter
    collectorList: [SingleCharacter]
  }
`;

module.exports = typeDefs;

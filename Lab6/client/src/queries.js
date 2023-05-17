import { gql } from "@apollo/client";

const CHARACTER_LIST = gql`
    query characterList($offset: Int!, $searchTerm: String) {
      characterList(offset: $offset, searchTerm: $searchTerm) {
        charCount
        charList {
            id
            characterName
            CharImage
            description
            collected
            comics{name, url}
            series{name, url}
            events{name,url}
            collected
        } 
      }
    }
`;

const SINGLE_CHARACTER = gql`
    query SingleCharacter($id: Int!){
      singleCharacterInfo(id: $id) {
            id
            characterName
            description
            CharImage
            comics{name, url}
            series{name, url}
            events{name,url}
            collected
      }
    }
`;

let exported = {
  CHARACTER_LIST,
  SINGLE_CHARACTER,
};

export default exported;

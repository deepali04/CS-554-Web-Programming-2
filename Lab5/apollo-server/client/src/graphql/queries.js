import { gql } from '@apollo/client';

const LOAD_LOCATIONS = gql`   
    query locationPosts($pageNum: Int) {
        locationPosts(pageNum: $pageNum) {
            id
            image
            name
            address
            userPosted
            liked
        }
}`;

const ADD_TO_LIKED = gql`
    mutation updateLocation($id: ID!, $image: String, $name: String, $address: String, $userPosted: Boolean, $liked: Boolean) {
        updateLocation(id: $id, image: $image, name: $name, address: $address, userPosted: $userPosted, liked: $liked) {
            id
            image
            name
            address
            userPosted
            liked
    }
}
`;

const GET_LIKED_LOCATIONS = gql`
    query likedLocations {
        likedLocations {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`;

const REMOVE_FROM_LIKED = gql`
    mutation updateLocation($id: ID!, $image: String, $name: String, $address: String, $userPosted: Boolean, $liked: Boolean) {
        updateLocation(id: $id, image: $image, name: $name, address: $address, userPosted: $userPosted, liked: $liked) {
            id
            image
            name
            address
            userPosted
            liked
    }
}
`;

const UPLOAD_NEW_LOCATION = gql`
    mutation uploadLocation($image: String!, $address: String!, $name: String!) {
        uploadLocation(image: $image, address: $address, name: $name) {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`;

const GET_USER_POSTED_LOCATIONS = gql`
    query userPostedLocations {
        userPostedLocations {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`;


const DELETE_USER_LOCATION = gql`
    mutation deleteLocation($id: ID!) {
        deleteLocation(id: $id) {
            id
            image
            name
            address
            userPosted
            liked
        }
    }
`;

export default {
    LOAD_LOCATIONS,
    ADD_TO_LIKED,
    GET_LIKED_LOCATIONS,
    REMOVE_FROM_LIKED,
    UPLOAD_NEW_LOCATION,
    GET_USER_POSTED_LOCATIONS,
    DELETE_USER_LOCATION
};
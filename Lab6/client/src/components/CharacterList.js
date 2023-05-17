import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useNavigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCharacter, deleteCharacter } from "../redux/actions/characterActions";
import { useSelector } from "react-redux";
import PaginationButtons from "./PaginationButtons";
import ErrorPage from "./ErrorPage";

const CharacterList = () => {
  const LIMIT = 20;
  const dispatch = useDispatch();
  let { pageNum } = useParams();

  const regEx= new RegExp("^\d+(?![a-zA-Z]+\b)");
  // if(regEx.test(pageNum)){

  // }
  pageNum = parseInt(pageNum);
    

  const [offset, setOffset] = useState(pageNum * 20);
  const [page, setPage] = useState(pageNum);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  let collectorData = [];
  const { loading, error, data } = useQuery(queries.CHARACTER_LIST, {
    variables: { offset },
    onCompleted: () => setPage(pageNum),
    fetchPolicy: "cache-and-network",
  });
  console.log(data);

  const collectors = useSelector((state) => state.allCollectors);

  if (loading) {
    return (
      <div><h2>Loading...</h2></div>
    );
  } else if (pageNum < 0 || isNaN(pageNum) || pageNum >78) {
    return (
      <div><ErrorPage /></div>
    );
  } else if (error) {
    return (
      <div><ErrorPage /></div>
    );
  }
  if (collectors) {
    collectorData = collectors.filter((collector) => collector.selected === true);
  }

  let count = Math.ceil(data.characterList.charCount/ LIMIT);
  console.log(count);
  const handleChange = (event, value) => {
    pageNum = value - 1;
    navigate(`/characters/page/${pageNum}`);
    setOffset(pageNum * 20);
    setPage(pageNum);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    navigate(`/characters/page/0`);
    setOffset(0);
  };

  if (!loading && data.characterList.charList.length) {
    return (
      <>
        {
          <PaginationButtons
            count={count}
            handleChange={handleChange}
            page={page + 1}
          />
        }
        <div className="mx-auto col-10 col-md-8 col-lg-2">
        <form className="d-flex my-3" onSubmit={handleSearch}>
          <input
            className="form-group col-md-8"            
            type="search"
            placeholder="  Search Character"
            aria-label="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="buttonLink" type="submit">Search</button>
        </form>
        </div>
        <div className="row row-cols-1 row-cols-md-4 g-5 my-2 mx-4">
          {data.characterList.charList.filter((character) => {
              if (searchTerm === "") {
                return character;
              }
              else if (character.characterName.toLowerCase().includes(searchTerm.toLowerCase())) {
                return character;
              }
              return null;
            })
            .map((character) => {
              const { id, characterName, description, CharImage } = character;
              return (
                <div className="col" key={id}>
                  <div className="card text-white bg-maroon mb-3 border-light h-100">
                    <Link to={`/character/${id}`}>
                      <img
                        src={CharImage}
                        className="card-img-top img-thumbnail"
                        alt={id}
                        aria-label="Image logo"
                      />
                    </Link>
                    <div className="card-body">
                      <h2 className="card-title">{characterName}</h2>
                      <p> {description ? description : 'No description'} </p>                   
                      {collectorData.length > 0 ? (
                        collectorData[0].characterList.length > 9 ? (
                          <button className="btn btn-danger">Limit Reached!</button>
                        ) : collectorData[0].characterList.length > 0 &&
                          collectorData[0].characterList.filter(
                            (value) => value.id === id
                          ).length > 0 ? (
                          <button
                            className="buttonLink"
                            onClick={() => {
                              let characterList = {
                                id: id,
                                characterName: characterName,
                                description: description,
                                charImage: CharImage,
                              };

                              dispatch(
                                deleteCharacter(
                                  collectorData[0].id,
                                  characterList
                                )
                              );
                            }}
                          >
                            Give-Up
                          </button>
                        ) : (
                          <button
                            className="buttonLink"
                            onClick={() => {
                              let characterList = {
                                id: id,
                                characterName: characterName,
                                description: description,
                                charImage: CharImage,
                              };
                              dispatch(
                                addCharacter(
                                  collectorData[0].id,
                                  characterList
                                )
                              );
                            }}
                          >
                            Collect
                          </button>
                        )
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
  }
};
export default CharacterList;

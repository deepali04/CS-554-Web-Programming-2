import React from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addCharacter, deleteCharacter } from "../redux/actions/characterActions";
import ErrorPage from "./ErrorPage";

const SingleCharacter = () => {
  let { id } = useParams();
  id = parseInt(id);
  let collectorData = [];
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(queries.SINGLE_CHARACTER, {
    variables: { id },
    fetchPolicy: "cache-and-network",
  });

  console.log(data);

  const collectors = useSelector((state) => state.allCollectors);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <ErrorPage />
      </div>
    );
  }

  if (collectors) {
    collectorData = collectors.filter((collector) => collector.selected === true);
  }
  let tempData= data.singleCharacterInfo;
  if (!loading && data.singleCharacterInfo) {
    return (
      <>
        <div className="p-3 mb-2 bg-dark text-white">
          <div key={tempData.id} className="container">
            <div className="row">
              <div className="col-sm">
              <h2>{tempData.characterName}</h2>
                <img
                  className="img-thumbnail"
                  src={tempData.CharImage} alt=""/>
                <div className="card-body">
                    <h3>Character Description</h3>
                      <p> {tempData.description ? tempData.description : 'No description'} </p>  
                    <h3>Comics Information</h3>
                        {tempData.comics.length>0 ?  
                          tempData.comics.map(item => {
                          return <p>{item.name}</p>;
                        }):  'No Comic Info'}
                    <h3>Series Information</h3>
                        {tempData.series.length>0 ?  
                          tempData.series.map(item => {
                          return <p>{item.name}</p>;
                        }):  'No Series Info'}
                    <h3>Events Information</h3>
                        {tempData.events.length>0 ?  
                              tempData.events.map(item => {
                              return <p>{item.name}</p>;
                        }):  'No Event Info'}
                </div>                
                
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
                          id: tempData.id,
                          characterName: tempData.characterName,
                          charImage: tempData.CharImage,
                          description : tempData.description
                        };

                        dispatch(
                          deleteCharacter(
                            collectorData[0].id,
                            collectorData[0].collectorName,
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
                          id: tempData.id,
                          characterName: tempData.characterName,
                          charImage: tempData.CharImage,
                          description : tempData.description
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
        </div>
      </>
    );
  }
};

export default SingleCharacter;

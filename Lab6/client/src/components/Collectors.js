import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCollector, deleteCharacter, unSelectedCollector, deleteCollector, selectedCollector } 
from "../redux/actions/characterActions";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Collectors = () => {
  const [addCollector, setAddCollector] = useState({
    collectorName: "", characterList: [],
  });
  const collectors = useSelector((state) => state.allCollectors);
  const dispatch = useDispatch();
  let collectorData = [];
  

  const handleChange = (e) => {

    const input = e.target;
    const name = input.value.trim();

    if(name !== null || name || name.trim().length >0){
      setAddCollector((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        characterList: [],
      }));
    }

  };

  const handleUnSelect = (id) => {
    dispatch(unSelectedCollector(id));
  };


  const handleDelete = (id) => {
    dispatch(deleteCollector(id));
  };

  const handleSelect = (id, collectorName, characterList) => {
    dispatch(selectedCollector(id, collectorName, characterList));
  };

  // const handleUnSelect = (id) => {
  //   dispatch(unSelectedCollector(id));
  // };

  if (collectors) {
    collectorData = collectors.filter((Collector) => Collector.selected === true);
  }
  return (
    <div>
      <form method="POST" onSubmit={(e) => {
          e.preventDefault();
          dispatch(setCollector(addCollector.collectorName, addCollector.characterList));
          e.target.elements.collectorName.value = "";
        }}>
        <div className="container form-group col-sm-5 my-1">
          <label htmlFor="collectorName">Enter Collector Name</label>
          <input type="text" className="form-control" id="collectorName" name="collectorName"
                   placeholder="Enter Collector Name" onChange={(e) => handleChange(e)} required
          />
        </div>
        <button className="buttonLink">Add Collector</button>
      </form>
      {collectors
        ? collectors.map((Collector) => {
            const { id, collectorName, characterList, selected } = Collector;
            return (
              <div key={collectorName}>
                <h2>Collector Name: {collectorName}</h2>
                <div className="row row-cols-1 row-cols-md-4 g-5 my-2 mx-4">
                  {characterList.map((character) => {
                    const { id, charImage, characterName } = character;
                    return (
                      <div className="col" key={id}>
                        <div className="card text-white bg-dark mb-2 border-light h-30">
                          <Link to={`/character/${id}`}>
                            <img
                              src={charImage}
                              className="card-img-top img-thumbnail"
                              alt={id}
                              aria-label="Image logo"
                            />
                          </Link>
                          <div className="card-body">
                            <h3 className="card-title">{characterName}</h3>
                            {selected ? (
                              <button
                                className="buttonLink"
                                onClick={() => {
                                  let characterList = {
                                    id: id,
                                    characterName: characterName
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
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!selected ?
                (
                  <button className="buttonLink" onClick={(e) => {handleSelect(id, collectorName, characterList);}}> Select Collector </button>
                ) : 
                (
                  <button className="buttonLink" onClick={(e) => { handleUnSelect(id);}}> Unselect Collector </button>
                )}
                {!selected ? 
                (
                  <button className="buttonLink" onClick={(e) => { handleDelete(id); }}> Delete Collector </button>
                ) : null
                }
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Collectors;

import React from "react";

const SearchCharacter = (props) => {
  const handleChange = (e) => {
    props.searchValue(e.target.value);
  };

  return (
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault();
      }}
      name="formName"
      className="center"
    >
      <h3>
        <label>
          Search {props.callFrom} :<br></br>
          <input
            autoComplete="off"
            type="text"
            name="searchTerm"
            onChange={handleChange}
          />
        </label>
      </h3>
    </form>
  );
};

export default SearchCharacter;
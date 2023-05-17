import { Button } from "@material-ui/core";
import React from "react";


const Pagination = ({ pageNum, getMore, getPrevious }) => {
  return (
    <>
      <Button style={{ backgroundColor: "#134e51", color: '#a8a4a4' }} onClick={getMore} >
        Get More
      </Button>
    </>
  );
};

export default Pagination;



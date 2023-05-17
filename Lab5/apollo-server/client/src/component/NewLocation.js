import React from 'react'
//import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import queries from '../graphql/queries';
// import validator from "validator";

function NewLocation() {
    const [uploadLocation] = useMutation(queries.UPLOAD_NEW_LOCATION);
    //const navigate = useNavigate();

    return (
      <div>

              <div className="login-box">
        <form method="POST" onSubmit={(e) => {
            e.preventDefault();
            if (!e.target.elements.image.value) {
              alert("Provide a proper Image URL");
            } else if (!e.target.elements.name.value) {
              alert("Provide a proper name of location");
            } else {
              uploadLocation({
                variables: {
                  image: e.target.elements.image.value,
                  address: e.target.elements.address.value,
                  name: e.target.elements.name.value,
                },
              });
              alert("Location added");
              //navigate("/my-locations");
            }
            e.target.elements.image.value = "";
            e.target.elements.address.value = "";
            e.target.elements.name.value = "";
          }}
        >

        <div className="login-box">
          <h2>Add New Location</h2>
            <div className="user-box">
                {/* <label htmlFor="formGroupExampleInput">Image</label> */}
                <input type="text" className="form-control" id="image"  placeholder="Image" name="image" required />
            </div>
            <div className="user-box">
                {/* <label htmlFor="formGroupExampleInput2">Address</label> */}
                <input type="text" className="form-control" id="address" placeholder="Address" name="address" />             
            </div>
            <div className="user-box">
              {/* <label htmlFor="formGroupExampleInput2">Name</label> */}
              <input type="text" className="form-control" id="name" placeholder="Name" name="name" required />
            </div>
          <button className="navLink">Add Location</button>
        </div>
        </form>
      </div>
      </div>
    );
}

export default NewLocation
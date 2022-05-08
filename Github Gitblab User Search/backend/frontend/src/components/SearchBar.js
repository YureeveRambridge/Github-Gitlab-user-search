import React, {useState} from "react";
import PropTypes from "prop-types";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./SearchBar.css";

//Component displays a search bar for user input.
export function SearchBar (props) {

  //Sates for storing user input
  const [userInput, setUserInput] = useState("");

  //Takes stores user input when entered into search bar
  const handleUserInput = e =>{
    setUserInput(e.target.value);
  }

  //Once the form is submitted, execute the search
  const handleSubmit = e => {

    //Stops browser from refreshing
    e.preventDefault();

    //user input is passed into "findUser" function in App.js page
    props.findUsers(userInput);

    //"userInput" is set to default
    setUserInput("");
  }

    return (
      <div>
      {/* Search Bar GUI */}
        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">

            {/* Heading for search bar */}
            <Form.Label><h4>Finds user's by profile name on Github or/and Gitlab:</h4></Form.Label>

            {/* Search Bar */}
            <Form.Control 
            className='searchBar'
              type="text" 
              placeholder="Enter user profile name"
              value={userInput}
              onChange={handleUserInput}
            />
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit">Search</Button>
        </Form>
      </div>
    );
}

//The prop function required.
SearchBar.propTypes = {
  findUsers: PropTypes.func.isRequired,
};

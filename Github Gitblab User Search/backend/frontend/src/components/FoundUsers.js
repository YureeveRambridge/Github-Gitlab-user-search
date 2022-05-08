import React from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import "./FoundUsers.css";
import Card from 'react-bootstrap/Card';

//Component takes found users from the search results and displays it to the web page.
export function FoundUsers(props) {

  //Variable "prop.foundUsers" is simplified
  const foundUsers = props.foundUsers;

  //Event handler for when the "view user" button is clicked. The "viewUser" function will run from the prop data.
  const eventHandler = (e) => {

    //Function will take the website and the username variables and passes it into the function.
    props.viewUser(e.target.value);
  };

  //All found users that's stored in "foundUsers" are mapped, listed in order and displayed on the webpage.
  const usersFound = foundUsers.map((user) => {
    return (
      <div key={user.id} className="resultsDiv">

        <Card style={{ width: '18rem' }} >

          {/* Displays user profile picture */}
          <Card.Img variant="top" src={user.avatar} />

          <Card.Body className="userCard">

          {/* Shows if the username was found on github or gitlab */}
            <Card.Title>{user.vcsProvider}</Card.Title>

            {/* Displays the username */}
            <Card.Text >
              {user.login}
            </Card.Text>

            {/* View button so that the searched user's github/gitlab repositories can be viewed. 
                There are two values that need to be passed to the "viewUser" function. 
                They are passed in an array and will be split in the function it's passed in.
            */}
            <Button 
              value={[user.vcsProvider, user.login]}
              onClick={eventHandler}
              className="viewButton"
              variant="primary"
            >View User
            </Button>
            
          </Card.Body>
        </Card>
      </div>
    );
  });

  //Order list of users are returned
  return <ul>{usersFound}</ul>;
}

//Required props are defined. 
FoundUsers.propTypes = {
  foundUsers: PropTypes.array.isRequired,
  viewUser: PropTypes.func.isRequired,
};

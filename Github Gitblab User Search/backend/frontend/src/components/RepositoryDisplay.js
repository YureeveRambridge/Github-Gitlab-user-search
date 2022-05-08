import React from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

//Component takes the repository data and displays the list of repositories on the "UserProfile" component.

export function RepositoryDisplay(props) {
  //Extract the list of repos from the given props
  const apiData = props.apiData;

  //Event handler for when the view details button is clicked and runs the "repositoryData" function.
  const eventHandler = (e) => {
    //The vcsProvider and username from the userDetails data
    props.repositoryData(props.userDetails.vcsProvider, props.userDetails.login, e.target.value);
  };

  //User repositories are mapped to be displayed and assigned a view button.
  const repositoryList = apiData.map((repository) => {
    return (
      <ListGroup.Item className="listTable">
       {/* Map Key */}
      <li key={repository.id}>
        <div className="repositoryDisplayList">
          {/* Repository name */}
          <span><b>{repository.name}</b></span>

          {/* View Details Button */}
          <Button
            //When button is clicked the repository name and repository id is passed into repositoryData function.
            // This will bring up the repository's details
            value={[repository.name, repository.id]}
            onClick={eventHandler}
            variant="primary"
          >
            View details
          </Button>
        </div>
      </li>
      </ListGroup.Item>
    );
  });

  //Users repositories and view button are displayed. 
  return <ol className="repositoryList">{repositoryList}</ol>;
}

// The required props and function are set.
RepositoryDisplay.propTypes = {
  repository: PropTypes.array.isRequired,
  userDetails: PropTypes.object.isRequired,
  displayRepo: PropTypes.func.isRequired,
};

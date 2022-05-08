import React from "react";
import PropTypes from "prop-types";
import ListGroup from "react-bootstrap/ListGroup";
import dateFormat from 'dateformat';

//Component takes the users commits and displays them.
export function RepoCommits(props) {

  //"commitData" is mapped and displayed.
  const userCommits = props.commitData.map((commit) => {
    return (
      <ListGroup.Item className="listTable">

        {/* Ordered List layout */}
        <li key={commit.id}>
          
          {/* User's message for the commit is displayed */}
          {commit.message} 
          <br></br>

          {/* Date and time for commit is displayed and "dateFormat" function
          converts api date to a readable and time */}
          ({dateFormat(commit.committed_date, "mmmm dS yyyy, hh:mm tt")})
        </li>
      </ListGroup.Item>
    );
  });

  // List of user commits are returned
  return <ol>{userCommits}</ol>;
}

// The required prop is set.
RepoCommits.propTypes = {
  commitData: PropTypes.array.isRequired,
};

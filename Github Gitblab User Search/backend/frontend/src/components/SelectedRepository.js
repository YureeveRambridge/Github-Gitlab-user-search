import React, { useState, useEffect}from "react";
import { RepoCommits } from "./RepoCommits";
import PropTypes from "prop-types";
import { getJsonData } from "../Get Json Data Function/getJsonData.js";
import ListGroup from "react-bootstrap/ListGroup";
import dateFormat from 'dateformat';

//Component displays the details of a selected repository and calls the "UserCommits"
//component to show the commits of the repository as well.
export function SelectedRepository(props) {

  //Commits Variable is initialize
  const [commitData, setCommitData] = useState(null);

  //After rendering, the function will run and fetch the commit from the sever data
  useEffect(() => {

    //Nested async function for synchronous useEffect 
    const getCommitData = async () => {

      //url to get the data from the sever. 
      const url = `/api/repositorycommits?vcsProvider=${props.repositories.vcsProvider}&username=${props.repositories.owner}&repositoryname=${props.repositories.name}&repositoryid=${props.repositories.id}`;
      
      // Fetch the data
      const commitDetails = await getJsonData(url);

      //Update the state to contain the array of commits
      setCommitData(commitDetails);
    };

    //async function to execute the fetch
    getCommitData();
    //Run this effect every time the repo info changes
  }, [props.repositories]);

  return (
    // Displays the details of the repository
    <div className="commitDiv">
      <h2 className="repoName" >Repo Name: {props.repositories.name}</h2>
      <div>
        <p>
          <br></br>
          <b>Description:</b> {props.repositories.description}
          <br></br>
          <br></br>

          {/* Shows created date */}
          <strong>Date created: </strong>
          {/* Converts date to readable time */}
          {dateFormat(props.repositories.created_at, "mmmm dS yyyy, hh:mm tt")}
          <br></br>

          {/* Shows last updated date */}
          <strong>Date last updated: </strong>

          {/* Converts date to readable time */}
          {dateFormat(props.repositories.updated_at, "mmmm dS yyyy, hh:mm tt")}
          <br></br>
        </p>

        {/* Heading for commit display */}
        <h3>Latest commits:</h3>

        {/*Loading Icon displayed when data takes a long time to be retrieved*/}
        {!commitData ? (
          <img src="https://imgs.search.brave.com/UFRKZlEuTgIy4yfQ2eR6ZG0VL5E7cXsOx3w6ImUVKso/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAxLzgy/Ni8yNDgvbGFyZ2Vf/MngvcHJvZ3Jlc3Mt/bG9hZGluZy1iYXIt/YnVmZmVyaW5nLWRv/d25sb2FkLXVwbG9h/ZC1hbmQtbG9hZGlu/Zy1pY29uLXZlY3Rv/ci5qcGc" alt="loadingIcon" className="loadingIcon"></img>
        ) :

        /*If the user has no commits the following message is displayed */
        commitData.length === 0 ? (
          <p>Sorry no commits found</p>
        ) : (
          <ListGroup>

            {/* If the user has commits the "commitData" is pass into the "UserCommits" component */}
            <RepoCommits commitData={commitData}></RepoCommits>
          </ListGroup>
        )}
      </div>
    </div>
  );
}

//The props are required, and should be a repo object and a function.
SelectedRepository.propTypes = {
  repositories: PropTypes.object.isRequired,
  backToUser: PropTypes.func.isRequired,
};

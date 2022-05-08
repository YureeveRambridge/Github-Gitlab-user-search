import React, {useState, useEffect} from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { getJsonData } from "../Get Json Data Function/getJsonData.js";
import { RepositoryDisplay } from "./RepositoryDisplay";
import PropTypes from "prop-types";
import "./UserProfile.css";

//The Component takes the backend api data and displays the details of the users profile from github or gitlab.
// The users profile picture, linked name to his profile on the site are displayed and "RepositoryDisplay" component 
// is called to display the last five repositories of user.

export function UserProfile(props) {

  //Api data variable is initialize
  const [apiData, setApiData] = useState(null);

  //After rendering, the function will run and fetch the data from the sever
  useEffect(() => {

    //Nested async function for synchronous useEffect 
    const getApiData = async () => {

      //url to get the data from the sever. 
      const url = `/api/repositories?vcsProvider=${props.userDetails.vcsProvider}&username=${props.userDetails.login}`;

      // Fetches the data
      const fetchedData = await getJsonData(url);

      //Api data is set
      setApiData(fetchedData);
    };

    //"getApiData" function is called
    getApiData();

    //Effect runs every time the user info changes
  }, [props.userDetails]);

  return (
      <div className="latestRepos">
        <img src={props.userDetails.avatar} alt="userprofilepicture" className="avatar"></img>
        <p>

          {/* Link to user profile on github or gitlab */}
          <a href={props.userDetails.html_url}>
              <h2>{props.userDetails.login}</h2>
          </a>
        </p>

        {/* Heading for list of repositories */}
        <h3>Latest repositories:</h3>

        {/*Loading Display when api request takes long to load */}
        {!apiData ? (
          <img src="https://imgs.search.brave.com/UFRKZlEuTgIy4yfQ2eR6ZG0VL5E7cXsOx3w6ImUVKso/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAxLzgy/Ni8yNDgvbGFyZ2Vf/MngvcHJvZ3Jlc3Mt/bG9hZGluZy1iYXIt/YnVmZmVyaW5nLWRv/d25sb2FkLXVwbG9h/ZC1hbmQtbG9hZGlu/Zy1pY29uLXZlY3Rv/ci5qcGc" alt="loadingIcon" className="loadingIcon"></img>
        ) : 
        
        /* If the user has no repositories the following is displayed */
        apiData.length === 0 ? (
          <p>No repositories found for user</p>
        ) : (
          
          /* Else the last five users repos are shown by call the component "RepositoryDisplay" */
          <ListGroup>

            <RepositoryDisplay
              userDetails={props.userDetails}
              apiData={apiData}
              repositoryData={props.repositoryData}
            ></RepositoryDisplay>
          </ListGroup>
        )}
      </div>
  );
}

// The required prop and function are set.
UserProfile.propTypes = {
  userDetails: PropTypes.object.isRequired,
  repositoryData: PropTypes.func.isRequired,
};

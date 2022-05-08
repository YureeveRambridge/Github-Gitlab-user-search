import React, { useState, useEffect, useRef } from "react";
import { SearchBar } from "./components/SearchBar";
import { FoundUsers } from "./components/FoundUsers";
import { UserProfile } from "./components/UserProfile";
import { SelectedRepository } from "./components/SelectedRepository";
import { getJsonData } from "./Get Json Data Function/getJsonData.js";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BackToTop from "./components/BackToTop";
import "./App.css";

function App() {

  // Storage for the searched users details
  const [userDetails, setUserDetails] = useState(null);

  // Storage for the repository data
  const [repositories, setRepositories] = useState(null);

  // Sate to store the results from the search  
  const [foundUsers, setFoundUsers] = useState(null);

  // Stores Boolean for when the user has entered a username 
  // and clicked on "search" the "showFoundUsers" is set to true and the results are displayed.
  const [showFoundUsers, setShowFoundUsers] = useState(false);

  // "username" is set so its can be displayed back to the user if there is an error." 
  const [username, setUserName] = useState(false);

  // Function for when a "search" button is clicked. It calls the
  // server to get the users found for that particular username that the user entered.
  const findUsers = async (username) => {

    // States are set to null so that the previous search results are removed.
    setUserDetails(null);
    setRepositories(null);
    setFoundUsers(null);

    //"username" is set so its can be displayed back to the user if there is an error." 
    setUserName(username);

    //If the user has entered a username and clicked on search the "showFoundUsers" is set to true and 
    // the results are displayed
    setShowFoundUsers(true);

    // URL to the sever for making the guest request to the api
    const url = `/api/findusers?username=${username}`;

    // Data is retrieved
    const apiData = await getJsonData(url);

    // Update the state to contain the array of search results
    setFoundUsers(apiData);
  };

  // Function for when the "View User" button is clicked. The
  // server gets the user results for that particular user.
  const viewUser = async (selectedUser) => {

    // Resets "UserDetails" "setRepositories" to null so no old user data is shown
    setUserDetails(null);
    setRepositories(null);

    // The userRepositoryDetails variable passed into the function is string that needs to be separated by a comma
    // in order to get the "vcsProvider" and username" data.
    const [vcsProvider, username] = selectedUser.split(",");

    // Construct the server endpoint url
    const url = `/api/viewuser?vcsProvider=${vcsProvider}&username=${username}`;

    // Data is fetched
    const result = await getJsonData(url);

    // Update the state to contain the user object
    setUserDetails(result);
  };

  // When "view details" button is clicked  "Userprofile" component, calls the
  // server to get the repositories of that user
  const repositoryData = async (vcsProvider, userDetails, userRepositoryDetails) => {

    // Repositories is set to null
    setRepositories(null);

    // The userRepositoryDetails variable passed into the function is string that needs to be separated by a comma
    // in order to get the repository name and repository Id
    const [repositoryName,repositoryId] = userRepositoryDetails.split(",");

    // url for server's endpoint
    const url = `/api/repository?vcsProvider=${vcsProvider}&username=${userDetails}&repositoryname=${repositoryName}&repositoryid=${repositoryId}`;

    //Data is fetched
    const result = await getJsonData(url);

    //Repositories is
    setRepositories(result);
  };

  // Scrolls to bottom when the components "userDetails" and "repositories" are rendered.
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [userDetails, repositories]);

  return (
    <div className="App">
      {/* The page is in a react grid layout */}
      <Container>
        <Row>
          <Col className="header">

            {/* Page heading */}
            <h1>Github/lab user search</h1>
            <br />
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <br />{" "}
          </Col>
        </Row>
        <Row>
          <Col className="searchBarCol">

            {/* Search Bar component is called */}
            <SearchBar findUsers={findUsers}></SearchBar>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <br />{" "}
          </Col>
        </Row>
        <Row>
          <Col className="FoundUsersCol">

            {/*Search results are displayed if the state showSearch is set to true*/}
            {showFoundUsers && (
              <div>
                <h2>Search results:</h2>

                {/* Loading icon is displayed if the state showSearch is set to false  */}
                {!foundUsers ? (
                  <img src="https://imgs.search.brave.com/UFRKZlEuTgIy4yfQ2eR6ZG0VL5E7cXsOx3w6ImUVKso/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvcHJl/dmlld3MvMDAxLzgy/Ni8yNDgvbGFyZ2Vf/MngvcHJvZ3Jlc3Mt/bG9hZGluZy1iYXIt/YnVmZmVyaW5nLWRv/d25sb2FkLXVwbG9h/ZC1hbmQtbG9hZGlu/Zy1pY29uLXZlY3Rv/ci5qcGc" alt="loadingIcon" className="loadingIcon"></img>
                
                  ) : /*Search results show a message if the results are empty*/
                  foundUsers.length === 0 ? (
                  <p>Sorry no user with the username "{username}" on Github or Gitlab.</p>
                ) : (

                  /*Search results show the results once the data is in*/
                  <FoundUsers
                    viewUser={viewUser}
                    foundUsers={foundUsers}
                  ></FoundUsers>
                )}
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <br />{" "}
          </Col>
        </Row>
        <Row>
          <Col className="userRepo">
            <div>

              {/*User card is displayed only if the state has a user object set*/}
              {userDetails && (
                <UserProfile
                  userDetails={userDetails}
                  repositoryData={repositoryData}
                ></UserProfile>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {" "}
            <br />{" "}
          </Col>
        </Row>
        <Row>
          <Col className="viewRepoDetails">

            {/*Repo card is displayed only if the state has a repo object set*/}
            {repositories && (
              <SelectedRepository repositories={repositories}></SelectedRepository>
            )}
          </Col>
        </Row>

        {/* Reference for scroll function */}
        <div ref={messagesEndRef} />
      </Container>
      <BackToTop />
    </div>
  );
}

export default App;

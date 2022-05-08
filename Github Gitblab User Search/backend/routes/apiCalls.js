var express = require("express");
var router = express.Router();
const fetchData = require("node-fetch");

//This file makes the required requests to the third party APIs.

// Function make a call to the third party api to get json data.
const getJsonData = async (url) => {

  //Fetches the data
  const response = await fetchData(url);

  //Converts the Json data
  const jsonResponse = await response.json();

  //Data is returned
  return jsonResponse;  
};

// CORS function to make requests to the server
router.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//Username entered by user in the search bar is passed into this api endpoint's url and 
//it returns the users with that username from github and gitlab.
router.get("/api/findusers", async (req, res, next) => {

  //Gets the username from the url.
  const username = req.query.username;

  //Username is passed into the github and gitlab APIs URLs
  const githubApi = `https://api.github.com/users/${username}`;
  const gitlabApi = `https://gitlab.com/api/v4/users?username=${username}`;

  // Array for storing data from the APIs.
  let usersDetailsArray = [];

  try {

    // The username is searched for in github
    const userGithubData = await getJsonData(githubApi);

    // If user exists user's details are stored from the API
    if (userGithubData.message !== "Not Found") {

      const userGithubDetails = {
        //Users ID
        id: userGithubData.id,
        //Users name
        name: userGithubData.name,
        //Users login detail
        login: userGithubData.login,
        //Users profile picture
        avatar: userGithubData.avatar_url,
        //Users API link
        url: userGithubData.url,
        //Users Github profile link
        html_url: userGithubData.html_url,
        //Name of VCS provider hardcoded
        vcsProvider: "Github",
      };

      // Users details are pushed to the "usersDetailsArray"
      usersDetailsArray.push(userGithubDetails);
    }

    // The username is searched for in gitlab
    const userGitlabData = await getJsonData(gitlabApi);

    // If user exists user's details are stored from the API
    if (userGitlabData[0]) {

      const userGitlabDetails = {
        //Users ID
        id: userGitlabData[0].id,
        //Users name
        name: userGitlabData[0].name,
        //Users login detail
        login: userGitlabData[0].username,
        //Users profile picture
        avatar: userGitlabData[0].avatar_url,
        //Users API link
        url: userGitlabData[0].web_url,
        //Users Gitlab profile link
        html_url: userGitlabData[0].web_url,
        //Name of VCS provider hardcoded
        vcsProvider: "Gitlab"
      };

      // Users details are pushed to the "usersDetailsArray"
      usersDetailsArray.push(userGitlabDetails);
    }

    // "usersDetailsArray" data is sent to where the API is requested 
    res.send(usersDetailsArray);

    // If error occurs error message is displayed
  } catch (err) {
    next(err);
  }
});

//When "View User" is clicked function makes a request to this endpoint is made and it returns the user's details
router.get("/api/viewuser", async (req, res, next) => {

  // Gets the username of the selected user and VCS providers that the user is from, from the URL
  const userName = req.query.username;
  const vcsProvider = req.query.vcsProvider;

  //Username is passed into the github and gitlab APIs URLs
  const githubApi = `https://api.github.com/users/${userName}`;
  const gitlabApi = `https://gitlab.com/api/v4/users?username=${userName}`;

  try {
    // If the "vcsProvider" is Github users details are retrieved from the github API. 
    if (vcsProvider === "Github") {

      // "getJsonData" function is called to get the Json data from the API
      const userGithubData = await getJsonData(githubApi);

      // If API request fails the following error message is returned
      if (userGithubData.message === "Not Found") {
        res.status(500).send(`User ${userName} not found`);

        // If the request doesn't fail user's details are stored from the API
      } else {
        const userGithubDetails = {
          //Users ID
          id: userGithubData.id,
          //Users name
          name: userGithubData.name,
          //Users login detail
          login: userGithubData.login,
          //Users profile picture
          avatar: userGithubData.avatar_url,
          //Users API link
          url: userGithubData.url,
          //Users Github profile link
          html_url: userGithubData.html_url,
          //Name of VCS provider taken fromm the URL
          vcsProvider: vcsProvider
        };
        
        // "userGithubDetails" data is sent to where the API is requested 
        res.send(userGithubDetails);
      }

      // "getJsonData" function is called to get the Json data from the API if the VCS provider is Gitlab
    } else if (vcsProvider === "Gitlab") {
      const userGitlabData = await getJsonData(gitlabApi);

      // If API request to Gitlab fails the following error message is returned
      if (!userGitlabData[0]) {
        res.status(500).send(`User ${userName} not found`);

        // If the request doesn't fail user's details are stored from the gitlab API
      } else {
        const userGitlabDetails = {
          //Users ID
          id: userGitlabData[0].id,
          //Users name
          name: userGitlabData[0].name,
          //Users login detail
          login: userGitlabData[0].username,
          //Users profile picture
          avatar: userGitlabData[0].avatar_url,
          //Users API link
          url: userGitlabData[0].web_url,
          //Users Gitlab profile link
          html_url: userGitlabData[0].web_url,
          //Name of VCS provider taken from the URL
          vcsProvider: vcsProvider
        };

        // "userGitlabDetails" data is sent to where the API is requested 
        res.send(userGitlabDetails);
      }
    } 
    // If error occurs error message is displayed
  } catch (err) {
    next(err);
  }
});

//When the "User Profile" component is called a request to this endpoint is made and it returns the user's repo details
router.get("/api/repositories", async (req, res, next) => {

  // Gets the username of the selected user and VCS providers that the user is from, from the URL
  const userName = req.query.username;
  const vcsProvider = req.query.vcsProvider;

  //Username is passed into the github and gitlab APIs URLs
  const githubApi = `https://api.github.com/users/${userName}/repos`;
  const gitlabApi = `https://gitlab.com/api/v4/users/${userName}/projects`;

  try {
    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Github
    if (vcsProvider === "Github") {
      const repositoryData = await getJsonData(githubApi);

      // If API request to Github fails the following error message is returned
      if (repositoryData.message === "Not Found") {
        res.status(500).send("Repositories not found");
      }

      //Else "repositoryData" with user repo data is mapped and stored
      else {
        const userGithubDetails = repositoryData.map((repository) => {
          return {
            //Repository ID
            id: repository.id,
            //Repository Name 
            name: repository.name,
            //Repository description
            description: repository.description,
            //Repository creation date 
            created_at: repository.created_at,
            //Repository last updated date
            updated_at: repository.updated_at
          };
        });
        //The users last 5 repos are spliced from the "userGithubDetails"
        const fiveGithubRepositories = userGithubDetails.splice(0, 5);

        //Repositories are returned to where it was requested
        res.send(fiveGithubRepositories);
      }

    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Gitlab
    } else if (vcsProvider === "Gitlab") {
      const repositoryData = await getJsonData(gitlabApi);

      // If API request to Gitlab fails the following error message is returned
      if (!repositoryData[0]) {
        res.status(500).send(`User ${userName} not found`);
      }

      //Else "repositoryData" with user repo data is mapped and stored
      else {
        const userGitlabDetails = repositoryData.map((repository) => {
          return {
            //Repository ID
            id: repository.id,
            //Repository Name 
            name: repository.name,
            //Repository description
            description: repository.description,
            //Repository creation date 
            created_at: repository.created_at,
            //Repository last updated date
            updated_at: repository.last_activity_at
          };
        });

        //The users last 5 repos are spliced from the "userGitlabDetails"
        const fiveGitlabRepositories = userGitlabDetails.splice(0, 5);

        //Repositories are returned to where it was requested
        res.send(fiveGitlabRepositories);
      }
    } 
    // If error occurs error message is displayed
  } catch (err) {
    next(err);
  }
});

//When the "View details" button is clicked a request to this endpoint is made and it returns the user's repository data
router.get("/api/repository", async (req, res, next) => {

  // Gets the username of the selected user and VCS providers that the user is from, 
  // plus the repository name as well as repository ID from the URL
  const vcsProvider = req.query.vcsProvider;
  const userName = req.query.username;
  const repositoryName = req.query.repositoryname;
  const repositoryId = req.query.repositoryid;

  //Username, the VCS provider, "repositoryName" and "repositoryId" are passed into the github and gitlab APIs URLs
  const githubApi = `https://api.github.com/repos/${userName}/${repositoryName}`;
  const gitlabApi = `https://gitlab.com/api/v4/projects/${repositoryId}`;
  try {

    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Github
    if (vcsProvider === "Github") {
      const repositoryData = await getJsonData(githubApi);

      // If API request to Github fails the following error message is returned
      if (repositoryData.message === "Not Found") {
        res.status(500).send("Repository not found");
      }

      //Else "repositoryData" with user repo data is stored
      else {
        const repositoryDetails = {
            //Repository ID
          id: repositoryData.id,
            //Repository Name 
          name: repositoryData.name,
            //Repository description
          description: repositoryData.description,
            //Repository creation date 
          created_at: repositoryData.created_at,
            //Repository last updated date
          updated_at: repositoryData.updated_at,
            // Username from taken from the URL
          owner: userName,
            // VCS provider from taken from the URL
          vcsProvider: vcsProvider
        };
        //Repository Data is returned to where it was requested
        res.send(repositoryDetails);
      }

    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Gitlab
    } else if (vcsProvider === "Gitlab") {
      const repositoryData = await getJsonData(gitlabApi);

      // If API request to Gitlab returns and error the following error message is returned
      if (repositoryData.message === "404 Project Not Found") {
        res.status(500).send("Repository not found");
      }

      //Else "repositoryData" with user repo data is stored
      else {
        const repositoryDetails = {
            //Repository ID
          id: repositoryData.id,
            //Repository Name 
          name: repositoryData.name,
            //Repository description
          description: repositoryData.description,
            //Repository creation date 
          created_at: repositoryData.created_at,
            //Repository last updated date
          updated_at: repositoryData.last_activity_at,
            // Username from taken from the URL
          owner: userName,
            // VCS provider from taken from the URL
          vcsProvider: vcsProvider
        };
        //Repository Data is returned to where it was requested
        res.send(repositoryDetails);
      }
    }
    // If error occurs error message is displayed
  } catch (err) {
    next(err);
  }
});

//When the "Selected Repository" component is called a request to this endpoint is made and 
// it returns the user's latest commits of the selected repo
router.get("/api/repositorycommits", async (req, res, next) => {

  // Gets the username of the selected user and VCS providers that the user is from, 
  // plus the repository name as well as repository ID from the URL
  const vcsProvider = req.query.vcsProvider;
  const userName = req.query.username;
  const repositoryName = req.query.repositoryname;
  const repositoryId = req.query.repositoryid;
  const githubApi = `https://api.github.com/repos/${userName}/${repositoryName}/commits`;
  const gitlabApi = `https://gitlab.com/api/v4/projects/${repositoryId}/repository/commits`;

  try {
    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Github
    if (vcsProvider === "Github") {
      const repositoryData = await getJsonData(githubApi);

      // If API request to Github fails the following error message is returned
      if (repositoryData.message === "Not Found") {
        res.status(500).send("Repository not found");
      }

      //Else "repositoryData" with user repo data is mapped and stored
      else {
        const userRepoCommits = repositoryData.map((repository) => {
          return {
            //Repository ID
            id: repository.sha,
            //Repository commit message
            message: repository.commit.message,
            //Repository date created
            committed_date: repository.commit.committer.date,
          };
        });

        //The users last 5 commits are spliced from the "userGithubDetails"
        const fiveCommits = userRepoCommits.slice(0, 5);

        //Repositories are returned to where it was requested
        res.send(fiveCommits);
      }

    // "getJsonData" function is called to get the Json data from the API if the VCS provider is Gitlab
    } else if (vcsProvider === "Gitlab") {
      const repositoryData = await getJsonData(gitlabApi);

      // If API request to Gitlab returns and error the following error message is returned
      if (repositoryData.message === "404 Project Not Found") {
        res.status(500).send("Repository not found");
      }

      //Else "repositoryData" with user repo data is mapped and stored
      else {
        const userRepoCommits = repositoryData.map((repository) => {
          return {
            //Repository ID
            id: repository.id,
            //Repository commit message
            message: repository.message,
            //Repository date created
            committed_date: repository.committed_date,
          };
        });

        //The users last 5 commits are spliced from the "userGithubDetails"
        const fiveCommits = userRepoCommits.slice(0, 5);

        //Repositories are returned to where it was requested
        res.send(fiveCommits);
      }
    } 
    // If error occurs error message is displayed
  } catch (err) {
    next(err);
  }
});

//Router is exported
module.exports = router;

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
const should = chai.should();

//Test check the search API is works
describe("1: Checks search users API works", function () {

  //Test with user thats only on Github
  describe("Checking for a Github user: ", function () {
    it("Returns the users Github details", function (done) {

      // User that only has a github account only
      let githubUser = {userName: "happy"};

      
      //Search returns the details of the user
      chai
        .request("http://localhost:3001")
        .get("/api/findusers"+githubUser)
        // .query(githubUser)
        .end((err, res) => {
          res.should.have.status(200);

          res.text.should.eql(
            '[{"id":1460315,"name":"happy","login":"happy","avatar":"https://avatars.githubusercontent.com/u/1460315?v=4","url":"https://api.github.com/users/happy","vcsProvider":"Github"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with user thats only on Gitlab
  describe("Checking for a Gitlab user: ", function () {
    it("Returns the users Gitlab details", function (done) {

      // User that only has a gitlab account
      let gitlabUser = { userName: "iganbaruch" };

      chai
        .request("http://localhost:3001")
        .get("/api/findusers")
        .query(gitlabUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '[{"id":11486956,"name":"Itzik Gan Baruch","login":"iganbaruch","avatar":"https://gitlab.com/uploads/-/system/user/avatar/3672006/avatar.png","url":"https://gitlab.com/iganbaruch", "vcsProvider":"Gitlab"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with a user that exist on Github and Gitlab.
  describe("Checking for a user that exist on Github and Gitlab: ", function () {
    it("Returns the users Gitlab and Github details", function (done) {

      //This user exists on both Gitlab and Github
      let userOnBothVCS = { userName: "xlgmokha" };

      chai
        .request("http://localhost:3001")
        .get("/api/findusers")
        .query(userOnBothVCS)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '[{"id":85945244,"name":xlg,"login":"xlgmokha","avatar":"https://secure.gravatar.com/avatar/cc8d289bc1a24067f9af4f92452f4fe0?s=80&d=identicon","url":"https://gitlab.com/xlgmokha","vcsProvider":"Github"},{"id":80475,"name":"mo khan","login":"xlgmokha","avatar":"https://avatars.githubusercontent.com/u/80475?v=4","url":"https://api.github.com/users/xlgmokha","vcsProvider":"Gitlab"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test using a username that doesn't exist on github and gitlab
  describe("Checking for a user that exist on Github and Gitlab: ", function () {
    it("Returns empty array", function (done) {

      //User doesn't exists
      let notUser = { userName: "sj2ksoaj3" };

      chai
        .request("http://localhost:3001")
        .get("/api/findusers")
        .query(notUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql("[]");
          done();
        });
    }).timeout(5000);
  });
});

//Checks if the selected user API endpoint work
describe("2: Checks if the selected user API endpoint work", function () {

  //Test with a user that exist on Github only
  describe("Checking for a user that exist on Github: ", function () {
    it("Returns the users Github details", function (done) {

      //This user exists on Github
      let githubUser = { userName: "happy", vcsProvider: "Github" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(githubUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '{"id":1460315,"name":"happy","login":"happy","avatar":"https://avatars.githubusercontent.com/u/1460315?v=4","url":"https://api.github.com/users/happy","vcsProvider":"Github"}'

          );
          done();
        });
    }).timeout(5000);
  });

  //Test with user thats only on Gitlab
  describe("Checking for a Gitlab user: ", function () {
    it("Returns the users Gitlab details", function (done) {

      // User that only has a gitlab account
      let gitlabUser = { userName: "iganbaruch", vcsProvider: "Gitlab" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(gitlabUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '{"id":11486956,"name":"Itzik Gan Baruch","login":"iganbaruch","avatar":"https://gitlab.com/uploads/-/system/user/avatar/3672006/avatar.png","url":"https://gitlab.com/iganbaruch", "vcsProvider":"Gitlab"}'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with incorrect parameters
  describe("Test with incorrect parameters: ", function () {
    it("vcsProvider is left out of the check, check will fail", function (done) {

      //"vcsProvider" is left out of the check
      let noVcsProvider = { userName: "iganbaruch" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(noVcsProvider)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("userName is left out of the check", function (done) {

      //"userName" is left out of the check
      let noUsername = { vcsProvider: "Gitlab" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(noUsername)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("If 404 error message is sent from Github request will fail", function (done) {

      //User doesn't exist on Github
      let notOnGithub = { userName: "iganbaruch", vcsProvider: "Github" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(notOnGithub)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("Getting a 404 from Gitlab should fail the request", function (done) {
      //This user does not exist on Gitlab
      let notOnGitlab = { userName: "happy", vcsProvider: "Gitlab" };

      chai
        .request("http://localhost:3001")
        .get("/api/viewuser")
        .query(notOnGitlab)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);
  });
});

//Checks if the selected repository API endpoint works
describe("3: Checks if the selected repository API endpoint works", function () {

  //Test with an existing Github user repository
  describe("Test with an existing Github user repository: ", function () {
    it("Github repository details will be returned", function (done) {

      //Existing repository 
      let userRepository = {
        userName: "happy",
        vcsProvider: "Github",
        repositoryName: "AWESOME-XDCC-Parser",
        repositoryId: 5468762,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repository")
        .query(userRepository)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '{"id":5468762,"name":"AWESOME-XDCC-Parser","description":""AWESOME-XDCC-Parser","created_at":"2012-08-19T05:57:31Z","updated_at":"2014-04-10T23:32:15Z","owner":"happy","vcsProvider":"Github"}'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with an existing Gitlab user repository
  describe("Test with an existing Gitlab user repository: ", function () {
    it("User Gitlab repo details will be returned", function (done) {

      //This repository exists on Gitlab
      let userRepository = {
        userName: "iganbaruch",
        vcsProvider: "Gitlab",
        repositoryName: "Hello-world",
        repositoryId: 11738689,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repository")
        .query(userRepository)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '{"id":11738689,"name":"Hello-world","description":"","created_at":"2019-04-08T10:40:12.210Z","updated_at":"2019-04-30T11:15:21.886Z","owner":"iganbaruch","vcsProvider":"Gitlab"}'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with repository that doesn't exist
  describe("Test with repository that doesn't exist: ", function () {
    it("404 error will be returned and will not return anything", function (done) {

      //Repository that does not exists on Github
      let incorrectRepo = {
        userName: "yureeverambridge",
        vcsProvider: "Github",
        repositoryName: "Repo 1",
        repositoryId: 786922,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repository")
        .query(incorrectRepo)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("404 error will be returned and will not return anything", function (done) {

      //Repository that does not exists on Gitlab
      let incorrectRepo = {
        userName: "yureeverambridge",
        vcsProvider: "Gitlab",
        repositoryName: "fund 1",
        repositoryId: 8698569,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repo")
        .query(incorrectRepo)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);
  });
});

//Test Checks if API endpoint returns list of repositories
describe("4: Checks if API endpoint returns list of repositories", function () {

  //Test with user that exist in github
  describe("With user that exist in github: ", function () {
    it("List of user repos should be returned", function (done) {

      let checkRepos = {
        userName: "yureeverambridge",
        vcsProvider: "Github",
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositories")
        .query(checkRepos)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.include(
            '{"id":382107495,"name":"CV-of-Yureeve-Rambridge","description":"Online Cv of Yureeve Rambridge","created_at":"2021-07-01T17:21:29Z","updated_at":"2021-08-10T10:51:45Z"},{"id":262797070,"name":""github-slideshow","description":"A robot powered training repository :robot:","created_at": "2020-05-10T13:48:47Z","updated_at": "2020-05-10T15:04:09Z"},{"id":465727527,"name":"Hangman-React-App","description":"null","created_at": "2022-03-03T13:20:28Z","updated_at": "2022-03-03T13:22:20Z"},{"id":381964313,"name":"Ocean-Awareness","description": "A website creating awareness about protecting our oceans.","created_at": "2021-07-01T08:33:41Z","updated_at": "2021-08-23T09:55:53Z"}'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with user that exist in gitlab
  describe("With user that exist in gitlab: ", function () {
    it("List of user repos should be returned", function (done) {

      //User exists on Gitlab
      let checkRepos = {
        userName: "iganbaruch ",
        vcsProvider: "Gitlab",
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositories")
        .query(checkRepos)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '[{"id":35975281,"name":"ReminderDatePicker","description": "A Google Keep-like Date and Time Picker for reminders","created_at": "2022-05-08T10:07:10.018Z","updated_at":"2022-05-08T10:07:10.018Z"}, {"id":11781039,"name": "Itzik-Kuber-springapp","description": "","created_at": "2019-04-10T11:13:36.791Z","updated_at":"2019-06-17T04:50:01.222Z"},{"id":11738689,"name":"Hello-world","description": "","created_at": "2019-04-08T10:40:12.210Z","updated_at":"2019-04-30T11:15:21.886Z"}, {"id":34728330,"name": Gitlab Terraform Gke","description": "","created_at": "2022-03-23T09:34:03.968Z","updated_at":"2022-03-23T09:34:03.968Z"},{"id":26884588 ,"name":"GitLab-workshop-hugo ","description": "","created_at": "2021-05-24T14:23:56.209Z","updated_at":"2021-05-25T11:05:16.741Z"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with incorrect parameters
  describe("Test with incorrect parameters: ", function () {
    it("If 404 error message is sent from Github request will fail", function (done) {
      
      //Incorrect details
      let incorrectDetails = {
        userName: "245aa",
        vcsProvider: "Github",
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositories")
        .query(incorrectDetails)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("If 404 error message is sent from Gitlab request will fail", function (done) {
     
      //Incorrect details
      let incorrectDetails = {
        user: "245aa",
        source: "Gitlab",
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositories")
        .query(incorrectDetails)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);
  });
});

//Checks if the list of commits API endpoint works
describe("5: Gets list of user commits from the API", function () {

  //Testing with an existing user repo
  describe("Where user github repo exists: ", function () {
    it("List of commits are returned", function (done) {
      
      let existingRepo = {
        userName: "yureeverambridge",
        vcsProvider: "Github",
        repositoryName: "CV-of-Yureeve-Rambridge",
        repositoryId: 382107495,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositorycommits")
        .query(existingRepo)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '[{"id":"ad52d2fc26f30af5753b84b8dfed498467f6c720","message":"Update index.js","committed_date":"2021-08-10T10:51:42Z"},{"id":"091a45e955c59625d11704465b84db76d92941ff","message":"Update README.md","committed_date":"2021-07-02T12:25:05Z"},{"id":"d11a119d18a4a617a55495a360ce9f7662b2b7a5","message":"Add files via upload","committed_date":"2021-07-02T12:24:26Z"},{"id":"d8d563612ad152c0933a9acac6b8ca7c83ede2c1","message":"Update README.md","committed_date":"2021-07-02T12:23:41Z"},{"id":"650c5e18cb825a3402d38df548de1233c8af4039","message":"Update README.md","committed_date":"2021-07-02T12:13:00Z"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Testing with an existing gitlab user repo
  describe("Where user gitlab repo exists: ", function () {
    it("List of commits are returned", function (done) {

      //This repository exists on Github, and has commits
      let existingRepo = {
        userName: "a",
        vcsProvider: "Gitlab",
        repositoryName: "idontpass",
        repositoryId: 34552300,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositorycommits")
        .query(existingRepo)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.eql(
            '[{"id":"1aae8f5ec7fdbfd2aaf6872c84f67e067d8af17a","message":"Initial commit\n","committed_date":"2022-03-16T21:43:48.000+01:00"}]'
          );
          done();
        });
    }).timeout(5000);
  });

  //Test with incorrect parameters
  describe("When incorrect parameters are passed into the API: ", function () {
    it("If 404 error message is sent from Github request will fail", function (done) {

      //Incorrect parameters
      let incorrectParameters = {
        userName: "asdf51",
        vcsProvider: "Github",
        repositoryName: "asdf51",
        repositoryId: 15151,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositorycommits")
        .query(incorrectParameters)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);

    it("If 404 error message is sent from Github request will fail", function (done) {

      //Incorrect parameters
      let incorrectParameters = {
        userName: "sdv65114",
        vcsProvider: "Gitlab",
        repositoryName: "sdv65114",
        repositoryId: 1000000,
      };

      chai
        .request("http://localhost:3001")
        .get("/api/repositorycommits")
        .query(incorrectParameters)
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    }).timeout(5000);
  });
});

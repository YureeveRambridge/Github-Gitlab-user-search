import React from "react";
import { UserProfile } from "../components/UserProfile";
import renderer from "react-test-renderer";
const fetch = require("node-fetch");

//Test to ensure component renders as wanted
test("User Profile is shown", () => {
  const userDetails = {
    id: 1460315,
    name: "happy",
    login: "happy",
    avatar: "https://avatars.githubusercontent.com/u/1460315?v=4",
    url: "https://api.github.com/users/happy",
    vcsProvider: "Github"
  };
  const snap = renderer
    .create(
      <UserProfile
        userDetails={userDetails}
        repositoryData={function repositoryData() {}}
      />
    )
    .toJSON();
  expect(snap).toMatchSnapshot();
});

//Test get the user details:
test("repositoryData fetches data correctly", () => {
  return fetch("http://localhost:3001/api/viewuser?vcsProvider=Github&username=happy")
    .then((data) => data.json())
    .then((data) => {
      expect(data).toEqual({
        id: 1460315,
        name: "happy",
        login: "happy",
        avatar: "https://avatars.githubusercontent.com/u/1460315?v=4",
        url: "https://api.github.com/users/happy",
        html_url: "https://github.com/happy",
        vcsProvider: "Github"
      });
    });
});

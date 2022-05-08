import React from "react";
import { FoundUsers } from "../components/FoundUsers";
import renderer from "react-test-renderer";

//Test to ensure component renders as wanted
test("Shows users with searched username from github and gitlab", () => {
  let foundUsers = [
    {
      id: 1410106,
      name: "shuvalov anton",
      login: "a",
      avatar: "https://avatars.githubusercontent.com/u/1410106?v=4",
      url: "https://api.github.com/users/A",
      vcsProvider: "Github",
    },
    {
      id: 584369,
      name: "ave",
      login: "a",
      avatar:"https://gitlab.com/uploads/-/system/user/avatar/584369/avatar.png",
      url: "https://gitlab.com/a",
      vcsProvider: "Gitlab",
    },
  ];
  const snap = renderer
    .create(
      <FoundUsers
        foundUsers={foundUsers}
        viewUser={function viewUser() {}}
      />
    )
    .toJSON();
  expect(snap).toMatchSnapshot();
});

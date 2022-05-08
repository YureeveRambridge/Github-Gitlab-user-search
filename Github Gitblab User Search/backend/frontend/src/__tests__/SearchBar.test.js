import React from "react";
import { SearchBar } from "../components/SearchBar";
import renderer from "react-test-renderer";

//Test to ensure component renders as wanted
test("SearchBar is shown", () => {

  const snap = renderer
    .create(<SearchBar findUsers={function findUsers() {}} />)
    .toJSON();
  expect(snap).toMatchSnapshot();
});

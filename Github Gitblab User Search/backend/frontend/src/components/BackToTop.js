import React, { useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { Button } from "./BackToTopStyle";

// Function display an icon that when clicked will allow user to scroll back to the top of the page.
const BackToTop = () => {

	// Boolean variable for up arrow button is initilized
  const [upArrowIcon, setUpArrowIcon] = useState(false);

  const scrollerIcon = () => {

	// Gets how much the page has scrolled up
    const scrolledUpAmount = document.documentElement.scrollTop;

	// If the "scrolledUpAmount" is greater than 300 the "upArrowIcon"
	//  variable is set to true and the button is shown.
    if (scrolledUpAmount > 300) {
      setUpArrowIcon(true);
    } 
	// If the "scrolledUpAmount" is less than 300 the "upArrowIcon" 
	//  variable is set to false and the button is not shown.
	else if (scrolledUpAmount <= 300) {
      setUpArrowIcon(false);
    }
  };

  //Function auto scrolls to the top of the page
  const moveUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  window.addEventListener("scroll", scrollerIcon);

  return (
    <Button>
		{/* Button icon called from react module react-icons */}
      <FaArrowCircleUp
        onClick={moveUp}
        style={{ display: upArrowIcon ? "inline" : "none" }}
      />
    </Button>
  );
};

export default BackToTop;

// Reference for this function:
// https://www.geeksforgeeks.org/how-to-create-a-scroll-to-top-button-in-react-js/
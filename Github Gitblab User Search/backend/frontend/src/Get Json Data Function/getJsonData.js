// Function make a call to the third party api to get json data.
export const getJsonData = async (url) => {
  try {
    //Calling the endpoint
    const response = await fetch(url);

    //Gets the Json data
    const jsonResponse = await response.json();

    //Data is returned
    return jsonResponse;
    
    //Error message is displayed if one occurs
  } catch (err) {
    console.log(err);
  }
};
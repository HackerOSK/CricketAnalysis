import js from "@eslint/js";
import axios from "axios";
import json from "json";

const getseriesMatches = async (seriesId) =>
{
const options = {
  method: 'GET',
  url: `https://cricbuzz-cricket.p.rapidapi.com/series/v1/${seriesId}`,
  headers: {
    'x-rapidapi-key': 'e4cfe50474msh3678b3dd360d14bp132c36jsn172ec647c633',
    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data.matchDetails[0]);
    return response.data;
} catch (error) {
	console.error(error);
}

}


getseriesMatches(9237);
  

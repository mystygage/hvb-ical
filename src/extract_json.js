import * as cheerio from 'cheerio';
import axios from 'axios';

// Function to retrieve the HTML content from the URL
async function getHTMLFromURL(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error retrieving the HTML content:', error);
    return null;
  }
}

// The function for extracting the JSON object from the HTML content
function extractJSONFromHTML(htmlContent) {
  const $ = cheerio.load(htmlContent);

  const scriptContent = $('script:contains("var jsonString")').html();

  const jsonString = scriptContent.match(/var jsonString = (\[.*?\])/);
  const parsedJSON = JSON.parse(jsonString[1]);

  return parsedJSON;
}

// Main function to read the JSON object from the URL
export async function readJSONFromURL(url) {
  const htmlContent = await getHTMLFromURL(url);

  if (!htmlContent) {
    console.error('The HTML content could not be retrieved.');
    return null;
  }

  const parsedJSON = extractJSONFromHTML(htmlContent);
  return parsedJSON;
}

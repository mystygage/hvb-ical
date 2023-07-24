import ical from 'ical-generator';
import { readJSONFromURL } from './extract_json.js';

// Function to create a calendar entry from the JSON object.
function createEventFromJSON(eventObj, cal) {

  // Add time zone or set time to 0 o'clock, if all-day event
  if(eventObj.start.includes('T')) {
    eventObj.start = eventObj.start + "+02:00"
    eventObj.end = eventObj.end + "+02:00"
  } else {
    eventObj.start = eventObj.start + "T00:00+02:00"
    eventObj.end = eventObj.end + "T00:00+02:00"
  }

  const startDateTime = new Date(eventObj.start);
  const endDateTime = new Date(eventObj.end);

  // Distinguish between all-day events and time-limited events
  const allDay = startDateTime.getHours() === 0;

  cal.createEvent({
    start: startDateTime,
    end: endDateTime,
    summary: eventObj.title,
    description: eventObj.description,
    url: eventObj.url,
    allDay: allDay,
  });
}

// Main function for creating the iCal calendar
export async function generateICalFromJSON(url) {
  const jsonArray = await readJSONFromURL(url);

  if (!jsonArray) {
    console.error('The JSON object could not be retrieved.');
    return null;
  }

  const cal = ical({
    name: 'HvB Kalender',
    url: url,
    timezone: 'Europe/Berlin',
  });

  jsonArray.forEach((eventObj) => {
    createEventFromJSON(eventObj, cal);
  });

  return cal;
}

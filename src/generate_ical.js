import ical from 'ical-generator';
import { readJSONFromURL } from './extract_json.js';

// Function to create a calendar entry from the JSON object.
function createEventFromJSON(eventObj, cal) {

  // Events are stored with a localized format (CET) without timezone information.
  // The timezone is added and if all-day event the time is set to 0 o'clock.
  if(eventObj.start.includes('T')) {
    eventObj.start = eventObj.start + "+02:00"
    eventObj.end = eventObj.end + "+02:00"
  } else {
    eventObj.start = eventObj.start + "T00:00+02:00"
    eventObj.end = eventObj.end + "T00:00+02:00"
  }

  const startDateTime = convertToMESZ(new Date(eventObj.start));
  const endDateTime = convertToMESZ(new Date(eventObj.end));

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

function getLastSundayOfMonth(year, month) {
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const dayOfWeek = lastDayOfMonth.getDay();
  return new Date(year, month, lastDayOfMonth.getDate() - dayOfWeek);
}

function convertToMESZ(date) {
  const year = date.getFullYear();
  const meszStart = getLastSundayOfMonth(year, 2); // Last Sunday in March
  const meszEnd = getLastSundayOfMonth(year, 9);  // Last Sunday in October

  if (date >= meszStart && date < meszEnd) {
      // The date is in CEST, no correction required.
      return date;
  } else {
      // The date is in winter time, add one hour
      const correctedDate = new Date(date.getTime() + 3600000); // 3600000 ms = 1 hour
      return correctedDate;
  }
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

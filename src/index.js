import { generateICalFromJSON } from './generate_ical.js';

// The URL from which the HTML content is read
const url = 'https://www.hvb-gymnasium.de/aktuelles/terminkalender/582123,de';

// Create the iCal calendar object
const icalCalendar = await generateICalFromJSON(url);

if (icalCalendar) {
  icalCalendar.saveSync('./calendar.ics');
}

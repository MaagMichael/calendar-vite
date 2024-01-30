// https://stateful.com/blog/events-in-the-google-calendar-API

import { useState, useEffect, useRef } from "react";
import axios from "axios";

import dotenv from 'dotenv';

// https://dev.to/whchi/how-to-use-processenv-in-vite-ho9
// https://www.youtube.com/shorts/r92aHr752Bg
const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const VITE_CALID = import.meta.env.VITE_CALID;

// https://dev.to/msnmongare/managing-environment-variables-in-reactjs-30nn
// const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;
// const REACT_APP_CALID = process.env.REACT_APP_CALID;


// import from library date-fns
import {
  add,
  sub,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  // isEqual,
  parseISO,
  isSameDay,
  isWithinInterval,
  // set,
} from "date-fns";

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

import "./App.css";

function ReadCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [roomFree, setRoomFree] = useState([]);
  const hasFetchedData = useRef(false);

  // fetch only once the data using useRef hook or deactivate strict mode
  useEffect(() => {
    const fetchDates = async () => {
      const startDate = new Date().toISOString();
      const url = `https://www.googleapis.com/calendar/v3/calendars/${VITE_CALID}/events?key=${VITE_API_KEY}&timeMin=${startDate}`;
      // const url = `https://www.googleapis.com/calendar/v3/calendars/${REACT_APP_CALID}/events?key=${REACT_APP_API_KEY}&timeMin=${startDate}`;
      try {
        await axios
          .get(url)
          .then((response) => response.data)
          .then((data) => {
            const events = data.items;
            // console.log(events);

            events.map((event) => {
              setRoomFree((prevItems) => [
                ...prevItems,
                {
                  title: event.summary,
                  start: event.start.date,
                  end: event.end.date,
                },
              ]);
            });
          });
      } catch (error) {
        console.error(error);
      }
    };
    if (!hasFetchedData.current) {
      fetchDates();
      hasFetchedData.current = true;
    }
  }, []);

  const buttonSetToday = () => setCurrentDate(new Date());

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // create an array of all dates from current month
  const numDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  // functions for navigation by year or month
  const prevYear = () => {
    if (format(today, "yy") < format(currentDate, "yy")) {
      setCurrentDate(sub(currentDate, { years: 1 }));
    }
  };

  const nextYear = () => {
    setCurrentDate(add(currentDate, { years: 1 }));
  };

  const prevMonth = () => {

    console.log(format(today, "yy"), format(currentDate, "yy"));
    console.log(format(today, "MM"), format(currentDate, "MM"));
    if (
      !isWithinInterval(today, { start: startDate, end: endDate })
    ) {
      setCurrentDate(sub(currentDate, { months: 1 }));
    }
  };

  const nextMonth = () => {
    setCurrentDate(add(currentDate, { months: 1 }));
  };

  return (
    <>
      <div className="calendar">
        <h1>Google Calendar App with fns</h1>

        <button className="button-today" onClick={buttonSetToday}>
          goto Today
        </button>

        <div className="calendar-area">
          {/* navigation bar */}
          <div onClick={prevYear}>{"<<"}</div>
          <div onClick={prevMonth}>{"<"}</div>

          <div className="calendar-area-today">
            {format(currentDate, "LLLL yyyy")}
          </div>

          <div onClick={nextMonth}>{">"}</div>
          <div onClick={nextYear}>{">>"}</div>

          {/* print weekdays from array */}
          {weeks.map((week) => (
            <div className="calendar-days">{week}</div>
          ))}

          {/* notused = undefined, see https://stackoverflow.com/questions/40528557/how-does-array-fromlength-5-v-i-i-work */}
          {Array.from({ length: prefixDays }).map((notused, index) => (
            <div key={index} className="calendar-dates"></div>
          ))}

          {/* print date of current/selected month from array numDays */}
          {numDays.map((day) => {
            return (
              <div
                key={day.toString()}
                // https://www.freecodecamp.org/news/the-ternary-operator-in-javascript/
                className={
                  isToday(day) ? "calendar-dates todayGoogle" : "calendar-dates"
                }
                data-date={format(day, "dd-MM-y")}
              >
                {format(day, "d")}

                {/* check for this day if available ? */}
                {/* {roomFree.some((available) =>
                  isSameDay(day, parseISO(available.start))
                ) && (
                  <div className="room-free">
                    <p>{available.title}</p>
                  </div>
                )} */}

                {roomFree
                  .filter((available) =>
                    isSameDay(day, parseISO(available.start))
                  )
                  .map((available) => (
                    <div className="room-free">
                      <p>{available.title}</p>
                    </div>
                  ))}
              </div>
            );
          })}

          {/* print space of following month as index */}
          {Array.from({ length: suffixDays }).map((notused, index) => (
            <div key={index} className="calendar-dates"></div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ReadCalendar;

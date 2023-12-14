import { useState } from "react";
import Gcalendar from 'Gcalendar';

// import from library date-fns
import {
  add,
  sub,
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isEqual,
  parseISO,
  isSameDay,
} from "date-fns";

const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
import room1 from "./room1.json";

import "./App.css";
import { Gcalendar } from "./Gcalendar";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [roomNotfree, setRoomNotfree] = useState(room1);

  const buttonSetToday = () => setCurrentDate(new Date());

  const startDate = startOfMonth(currentDate);
  const endDate = endOfMonth(currentDate);

  // create an array of all dates from current month
  const numDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  // console.log(numDays);

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  // functions for navigation by year or month
  const prevYear = () => {
    setCurrentDate(sub(currentDate, { years: 1 }));
  };

  const nextYear = () => {
    setCurrentDate(add(currentDate, { years: 1 }));
  };

  const prevMonth = () => {
    setCurrentDate(sub(currentDate, { months: 1 }));
  };

  const nextMonth = () => {
    setCurrentDate(add(currentDate, { months: 1 }));
  };

  const handleclick = (event, day) => {
    // console.log(event.target.dataset.date);
    // alert("You clicked on data-date " + " " + event.target.dataset.date);
    setSelectedDate(day);
  };

  const changestatus = (event, day) => {
    // if date already in array room1 -> delete it, else add that date
    if (roomNotfree.some((occupied) => isSameDay(day, parseISO(occupied)))) {
      // console.log("occupied");
      const new_roomNotfree = roomNotfree.filter((occupied) => {
        return occupied !== format(day, "y-MM-dd").toString();
      });
      setRoomNotfree(new_roomNotfree);
    } else {
      // console.log("available");
      const roomNotfree_copy = [...roomNotfree];
      roomNotfree_copy.push(format(day, "y-MM-dd").toString());
      setRoomNotfree(roomNotfree_copy);
    }
  };

  const buttonSelected = () => {
    setCurrentDate(selectedDate);
  };

  return (
    <>
      <div className="calendar">
        <h1>Calendar App with fns</h1>

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

          {/* print space of previous month as index */}
          {/* notused = undefined, see https://stackoverflow.com/questions/40528557/how-does-array-fromlength-5-v-i-i-work */}
          {Array.from({ length: prefixDays }).map((notused, index) => (
            <div key={index} className="calendar-dates"></div>
          ))}

          {/* print date of current/selected month from array numDays */}
          {numDays.map((day) => {
            return (
              <div
                key={day.toString()}
                // nested ternary operator like if-else-if-else statement
                // https://www.freecodecamp.org/news/the-ternary-operator-in-javascript/
                className={
                  isToday(day)
                    ? "calendar-dates today"
                    : isEqual(day, selectedDate)
                    ? "calendar-dates selected"
                    : "calendar-dates"
                }
                data-date={format(day, "dd-MM-y")}
                onClick={(event) => handleclick(event, day)}
                onDoubleClick={(event) => changestatus(event, day)}
              >
                {format(day, "d")}

                {/* check for this day if available ? */}
                {roomNotfree.some((occupied) =>
                  isSameDay(day, parseISO(occupied))
                ) && <div className="room-notfree"></div>}
              </div>
            );
          })}

          {/* print space of following month as index */}
          {Array.from({ length: suffixDays }).map((notused, index) => (
            <div key={index} className="calendar-dates"></div>
          ))}
        </div>

        <p className="room-status">
          Change availability status by Double Click
        </p>

        <p className="date-selected">
          Date selected: {format(selectedDate, "dd LLLL yyyy")}
        </p>
        <button className="button-selected" onClick={buttonSelected}>
          goto Date selected
        </button>
      </div>

      <Gcalendar/>
    </>
  );
}


export default App;





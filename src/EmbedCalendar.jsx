import React from "react";

function EmbedCalendar() {
  return (
    <div>
      <iframe
        className="calendar"
        style={{ width: 500, height: 300, padding: 10 }}
        src="https://calendar.google.com/calendar/embed?src=3a16d9b39f71f958211ef4b4c30ba3c5374afe29622b112f218998f52ced2380%40group.calendar.google.com&ctz=Europe%2FBerlin"
      ></iframe>
    </div>
  );
}

export default EmbedCalendar;

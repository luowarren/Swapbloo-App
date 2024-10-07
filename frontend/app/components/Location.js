// LocationSelector.js
import React, { useState } from "react";
import locations from "../chats/locations";
import GenericButton from "./GenericButton";
import ShowMap from "./Map";

const LocationSelector = ({ click }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if ((selectedLocation && selectedDate && selectedTime) == "") {
      alert("Something is empty...");
    } else {
      alert(`Location: ${selectedLocation} Date: ${selectedDate} Time: ${selectedTime}`)
      click();
    }
  };

  return (
    <div>
      <ShowMap locations={locations} setter={setSelectedLocation} width="20rem" height="18rem"></ShowMap>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "0.5em", marginTop: "1em" }}>
          <div>
            <label htmlFor="date">Date: </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <label htmlFor="time">Time: </label>
            <input
              type="time"
              id="time"
              value={selectedTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center" /* Centers horizontally */,
            alignItems: "center" /* Centers vertically */,
            width: "100%" /* Takes full width of the parent */,
            boxSizing:
              "border-box" /* Ensures padding and border are included in total width/height */,
            padding: "0.5em",
            height: "auto",
          }}
        >
          <GenericButton type="submit" text="Update Meetup" inverse={true} width="100%"/>
        </div>
      </form>
    </div>
  );
};

export default LocationSelector;

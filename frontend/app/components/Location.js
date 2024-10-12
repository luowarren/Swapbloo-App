// LocationSelector.js

import React, { useEffect, useState } from "react";
import locations from "../chats/locations";
import GenericButton from "./GenericButton";
import ShowMap from "./Map";
import { getLocations, getSwapLocation, getCoordinates } from "@/service/swaps";

const LocationSelector = ({ click, meetUpInfo, swap_id, activeChat }) => {
  const [selectedLocation, setSelectedLocation] = useState(meetUpInfo.location);
  const [selectedDate, setSelectedDate] = useState(meetUpInfo.date);
  const [selectedTime, setSelectedTime] = useState(meetUpInfo.time);

  const handleDateChange = (event) => {
    // console.log("new date" + event.target.value)
    setSelectedDate(event.target.value); //new Date(event.target.value).toISOString());
  };

  const handleTimeChange = (event) => {
    // console.log("new time" + event.target.value)
    setSelectedTime(event.target.value);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if ((selectedLocation && selectedDate && selectedTime) == "") {
      alert("Something is empty...");
    } else {
      alert("Meet up updated!");
      click(selectedLocation, selectedDate, selectedTime);
    }
  };

  useEffect(() => {
    setSelectedLocation(meetUpInfo.location);
    setSelectedTime(meetUpInfo.time ?? undefined)
    setSelectedDate(meetUpInfo.date);
    console.log("new meetup info: ", meetUpInfo);
  }, [swap_id, meetUpInfo, activeChat]);

  
  return (
    <div key={activeChat}>
      { selectedLocation !== null ? (
        <ShowMap
          setter={setSelectedLocation}
          width="20rem"
          height="37vh"
          selectedLocation={selectedLocation}
        ></ShowMap>
      ) : (
        <div>Loading map...</div>
        // <ShowMap setter={setSelectedLocation} width="20rem" height="18rem" selectedLocation={{
        //   name: "UQ Union",
        //   latitude: -27.496203,
        //   longitude: 153.017277
        // }}></ShowMap>
      )}
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
          <GenericButton
            type="submit"
            text="Update Meetup"
            inverse={true}
            width="100%"
          />
        </div>
      </form>
    </div>
  );
};

export default LocationSelector;

// LocationSelector.js

import React, { useEffect, useState } from "react";
import locations from "../chats/locations";
import GenericButton from "./GenericButton";
import ShowMap from "./Map";
import { getLocations, getSwapLocation, getCoordinates } from "@/service/swaps";

const LocationSelector = ({ click, meetUpInfo, swap_id }) => {
  // const [selectedLocation, setSelectedLocation] = useState(meetUpInfo.location);
  const [selectedDate, setSelectedDate] = useState(meetUpInfo.date);
  const [selectedTime, setSelectedTime] = useState(meetUpInfo.time);
  const [locationName, setLocationName] = useState(null);

  // const handleLocationChange = (event) => {
  //   setSelectedLocation(event.target.value);
  // };

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
    if ((locationName && selectedDate && selectedTime) == "") {
      alert("Something is empty...");
    } else {
      alert("Meet up updated!");
      click(locationName, selectedDate, selectedTime);
    }
  };

  useEffect(() => {
    // console.log("updating meetup info in location", meetUpInfo)
    setLocationName(meetUpInfo.location)
    setSelectedDate(meetUpInfo.date || "");
    setSelectedTime(meetUpInfo.time || "");
  }, [meetUpInfo])

  return (
    <div>
      {locationName !== null ? (
        <ShowMap
          setter={setLocationName}
          width="20rem"
          height="37vh"
          selectedLocation={locationName}
        ></ShowMap>
      ) : (
        <div>Loading map...</div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "0.5em", marginTop: "1em" }}>
          {/* <div>
          <label htmlFor="date">Location: </label>
          <select
            id="location"
            value={selectedLocation}
            onChange={handleLocationChange}
          >
            <option value="" style={{}}>
              None
            </option>
            {locations.map((location) => {
              if (location.name == selectedLocation) {
                return (
                  <option key={location.id} value={location.name} selected={true}>
                    {location.name}
                  </option>
                )
              } else {
                return (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                )
              }
            })}
          </select>
        </div> */}

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

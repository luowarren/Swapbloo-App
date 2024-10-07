import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDistance } from "geolib";
import L from "leaflet";
import GenericButton from "./GenericButton";

// Main component
export default function ShowMap({
  locations,
  width = "35rem",
  height = "25rem",
  zoom = 11,
  iconSize = 35,
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyLocation, setNearbyLocation] = useState({});

  locations = locations.sort((a, b) => {
    if (a.pinned === b.pinned) {
      return 0; // If both are pinned or both are not pinned, maintain their order
    }
    return a.pinned ? -1 : 1;
  }); // Move pinned locations to the front
  var initialCenter = [locations[0].latitude, locations[0].longitude];

  const [selected, setSelected] = useState(locations[0]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    if (userLocation) {
      const nearestLocation = locations
        .map((location) => {
          const metres = getDistance(userLocation, {
            latitude: location.latitude,
            longitude: location.longitude,
          });
          return {
            ...location,
            distance: metres,
            nearby: metres <= 100,
          };
        })
        .sort((a, b) => a.distance - b.distance)[0];

      setNearbyLocation(nearestLocation);
    }
  }, [userLocation, locations]);

  // Create a location icon
  const locationIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1NzJhZjgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1tYXAtcGluIj48cGF0aCBkPSJNMjAgMTBjMCA0Ljk5My01LjUzOSAxMC4xOTMtNy4zOTkgMTEuNzk5YTEgMSAwIDAgMS0xLjIwMiAwQzkuNTM5IDIwLjE5MyA0IDE0Ljk5MyA0IDEwYTggOCAwIDAgMSAxNiAwIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIvPjwvc3ZnPg==",
    iconSize: [iconSize, iconSize], // Small size
    className: "location-marker", // Optional: Add a class for custom styles if needed
  });

  const selectedIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmODJhNTQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1tYXAtcGluLWNoZWNrLWluc2lkZSI+PHBhdGggZD0iTTIwIDEwYzAgNC45OTMtNS41MzkgMTAuMTkzLTcuMzk5IDExLjc5OWExIDEgMCAwIDEtMS4yMDIgMEM5LjUzOSAyMC4xOTMgNCAxNC45OTMgNCAxMGE4IDggMCAwIDEgMTYgMCIvPjxwYXRoIGQ9Im05IDEwIDIgMiA0LTQiLz48L3N2Zz4=",
    iconSize: [iconSize, iconSize], // Small size
    className: "selected-marker", // Optional: Add a class for custom styles if needed
  });

  const personIcon = new L.Icon({
    iconUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNiIgaGVpZ2h0PSIzNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmOGI3MmEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1wZXJzb24tc3RhbmRpbmciPjxjaXJjbGUgY3g9IjEyIiBjeT0iNSIgcj0iMSIvPjxwYXRoIGQ9Im05IDIwIDMtNiAzIDYiLz48cGF0aCBkPSJtNiA4IDYgMiA2LTIiLz48cGF0aCBkPSJNMTIgMTB2NCIvPjwvc3ZnPg==",
    iconSize: [iconSize, iconSize], // Small size
    className: "location-marker", // Optional: Add a class for custom styles if needed
  });

  return (
    <MapContainer
      center={userLocation || initialCenter}
      zoom={zoom}
      style={{
        backgroundColor: "#68D391", // bg-green-400
        borderRadius: "0.5rem", // rounded-lg
        width: width, // w-[50%]
        height: height, // h-24 (24 * 0.25rem = 6rem)
        fontSize: "0.75rem", // text-xs
        display: "flex", // flex
        alignItems: "center", // items-center
        justifyContent: "center", // justify-center
        marginRight: "1rem", // mr-4 (4 * 0.25rem = 1rem)
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {userLocation && (
        <Marker position={userLocation} icon={personIcon}>
          <Popup>You are here!</Popup>
        </Marker>
      )}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={location == selected ? selectedIcon : locationIcon}
        >
          <Popup>
            <div className="flex flex-col justify-center items-center h-full">
              {" "}
              {/* Ensure h-full or a specific height */}
              <span>{location.name}</span>
              <GenericButton
                text={location === selected ? "Selected" : "Select"}
                noClick={location === selected}
                click={() => {
                  locations.forEach((l) => (l.pinned = false));
                  location.pinned = true;
                  setSelected(location);
                }}
              />
            </div>
          </Popup>
          {/* <Circle center={[location.latitude, location.longitude]} radius={100} color="purple" fillColor="purple" fillOpacity={0.5} /> */}
        </Marker>
      ))}
      {nearbyLocation && nearbyLocation.nearby && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "white",
            padding: "10px",
          }}
        >
          <h3>{nearbyLocation.name}</h3>
          <p>Within 100 Metres!</p>
        </div>
      )}
    </MapContainer>
  );
}

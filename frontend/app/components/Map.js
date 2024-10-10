import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import GenericButton from "./GenericButton";
import { Minus, Search } from "lucide-react";

// Custom hook to center the map
function CenterMap({ selected, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.closePopup();
      map.setView([selected.latitude, selected.longitude], zoom);
    }
  }, [selected, map, zoom]);

  return null; // This component does not render anything
}

// Main component
export default function ShowMap({
  locations,
  setter= () => {},
  width = "25rem",
  height = "15rem",
  zoom = 11,
  iconSize = 35,
}) {
  const [userLocation, setUserLocation] = useState(null);
  const [selected, setSelected] = useState(locations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [isSearchVisible, setIsSearchVisible] = useState(false); // State for search bar visibility
  const mapRef = useRef(); // Ref to store map instance

  // Sort locations and initialize
  locations = locations.sort((a, b) =>
    a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1
  );

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

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      const results = locations.filter((location) =>
        location.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredLocations(results);
    } else {
      setFilteredLocations([]);
    }
  }, [searchTerm, locations]);

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
    <div style={{ position: "relative", width, height }}>
      {/* Map */}
      <MapContainer
        center={userLocation || [selected.latitude, selected.longitude]}
        zoom={zoom}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)} // Store the map instance
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {userLocation && (
          <Marker position={userLocation} icon={personIcon}>
            <GenericButton>You are here!</GenericButton>
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
                <span className="mb-2">{location.name}</span>
                <GenericButton
                  text={location === selected ? "Selected" : "Select"}
                  noClick={location === selected}
                  click={() => {
                    locations.forEach((l) => (l.pinned = false));
                    location.pinned = true;
                    setSelected(location);
                    setter(location.name);
                  }}
                />
              </div>
            </Popup>
            {/* <Circle center={[location.latitude, location.longitude]} radius={100} color="purple" fillColor="purple" fillOpacity={0.5} /> */}
          </Marker>
        ))}
        <CenterMap selected={selected} zoom={zoom} />
      </MapContainer>

      {/* Search Bar Toggle Button */}
      {!isSearchVisible && (
        <button
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000, // Ensure it appears above the map
          }}
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        >
          <Search />
        </button>
      )}
      {/* Custom Search Bar Overlay */}
      {isSearchVisible && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            top: "10px",
            right: "10px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000, // Ensure it appears above the map
            maxHeight: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignContent: "center",
              top: "10px",
              right: "10px",
              backgroundColor: "white",
              padding: "0.5rem",
              borderRadius: "8px",
              zIndex: 1000, // Ensure it appears above the map
            }}
          >
            <button
              style={{
                bottom: "10px",
                left: "10px",
                paddingRight: "0.5rem",
              }}
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Minus />
            </button>
            <input
              type="text"
              placeholder="Search by location"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "200px", padding: "8px", borderWidth: "1px", borderRadius: "8px" }}
            />
          </div>
          {/* Search results */}
          {searchTerm && (
            <ul style={{ listStyleType: "none", paddingBottom: "8px", overflow: "scroll"}}>
              {filteredLocations.map((location) => (
                <li
                  key={location.id}
                  onClick={() => {
                    setSelected(location);
                    setter(location.name)
                    setSearchTerm(""); // Clear search when selecting a location
                    setIsSearchVisible(false); // Hide search bar on selection
                  }}
                  style={{ cursor: "pointer", padding: "8px" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "lightgrey")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  {location.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

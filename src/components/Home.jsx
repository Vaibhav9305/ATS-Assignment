import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("isAuthSet")) {
            checkLocationPermission();
        } else {
            navigate("/login");
        }
    }, []);

    const checkLocationPermission = async () => {
        if (navigator.permissions) {
            try {
                const permission = await navigator.permissions.query({ name: "geolocation" });
                if (permission.state === "granted") {
                    handleLocationAccess();
                }
            } catch (err) {
                console.error("Error checking location permission:", err);
            }
        }
    };

    const handleLocationAccess = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLocation({ lat, lon });
                    setError(null);
                    fetchHospitals(lat, lon);
                },
                (err) => {
                    setLocation(false);
                    setError("Denied User Location");
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const fetchHospitals = async (lat, lon) => {
        setLoading(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=hospital+near+${lat},${lon}`);
            const data = await response.json();
            setHospitals(data);
        } catch (error) {
            setError("Failed to fetch hospitals");
        }
        setLoading(false);
    };

    return (
        <>
            {!location && (
                <div className="d-flex vh-100 vw-100 justify-content-center align-items-center bg-body-secondary">
                    <div className="text-center p-3">
                        <button type="button" className="btn btn-primary" onClick={handleLocationAccess}>
                            <i className="fa fa-map-marker fs-5 me-2"></i>Allow Location Access
                        </button>
                        <h2 className="fs-6 mt-3">
                            Please Allow Location Access For Showing Nearby Hospitals
                        </h2>
                        {error && <h3 className="fs-6 text-danger mt-2">{error}</h3>}
                    </div>
                </div>
            )}

            {location && (
                <div className="container mt-4">
                    <h2>Nearby Hospitals</h2>
                    {loading && <p>Loading...</p>}
                    {!loading && hospitals.length === 0 && <p>No hospitals found.</p>}
                    <ul className="list-group mb-4">
                        {hospitals.map((hospital) => (
                            <li key={hospital.place_id} className="list-group-item list-group-item-action" style={{ cursor: "pointer" }}>
                                <strong>{hospital.name}</strong>
                                <br />
                                <small>{hospital.display_name}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default Home;

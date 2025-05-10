import { Link, Outlet } from "react-router-dom";
import styles from "../styles/MyProfile.module.css";
import userIcon from "../assets/Basic Info.png";
import Education from "../assets/Education.png";
import WorkExperience from "../assets/WorkExperience.png";
import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const MyProfile = () => {
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState(null);

  // Get `userId` dynamically from sessionStorage
  const userId = sessionStorage.getItem("userId");

  // Fetch profile data from the backend

  useEffect(() => {
    if (!userId || userId.length !== 36) {
      console.warn("Invalid user ID. Profile will not be fetched.");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}` // makes a get request
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]); // This effect re-runs only when userId changes.

  useEffect(() => {
    const updateProgress = () => {
      const basicInfoCompleted =
        sessionStorage.getItem("basicInfoCompleted") === "true"; // "true", means the user has completed this section,
      const educationCompleted =
        sessionStorage.getItem("educationCompleted") === "true";
      const experienceCompleted =
        sessionStorage.getItem("experienceCompleted") === "true";

      let newProgress = 0;
      if (basicInfoCompleted) newProgress += 33;
      if (educationCompleted) newProgress += 33;
      if (experienceCompleted) newProgress += 34; // Adjusted for 100% total

      console.log("New Progress:", newProgress);

      setProgress(newProgress);
    };

    // Call initially
    updateProgress();

    // Listen for custom progress update event
    window.addEventListener("progressUpdated", updateProgress); // When progressUpdated event is fired (new Event("progressUpdated")), the updateProgress function will be triggered automatically.

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("progressUpdated", updateProgress); // need to be removed otherwise it would still be active
    };
  }, []);

  return (
    <div className={styles.container}>
      <nav className={styles.sidebar}>
        <ul>
          <br />
          <li className={styles.head}>My Profile</li>
          <br />
          <li>
            <Link to="basic-info" className={styles.link}>
              <img src={userIcon} alt="User Icon" className={styles.icon} />
              Basic Information
            </Link>
          </li>
          <li>
            <Link to="education" className={styles.link}>
              <img src={Education} alt="Education" className={styles.icon} />
              Specialties & Education
            </Link>
          </li>
          <li>
            <Link to="experience" className={styles.link}>
              <img
                src={WorkExperience}
                alt="WorkExperience"
                className={styles.icon}
              />
              Experience
            </Link>
          </li>
          <br />
          <li>
            <div
              style={{
                width: 150,
                height: 150,
                margin: "20px auto",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Add a label above the progress bar */}
              <div
                style={{
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#036",
                }}
              ></div>

              <div
                style={{ position: "relative", width: "100%", height: "100%" }}
              >
                <CircularProgressbar
                  value={progress}
                  text={`${progress}%`}
                  background
                  styles={buildStyles({
                    // Path and trail styles
                    pathColor:
                      progress < 50
                        ? "#ff9800"
                        : progress < 100
                        ? "#4caf50"
                        : "#2196f3",
                    trailColor: "#e0e0e0",
                    strokeLinecap: "round",

                    // Background styles
                    backgroundColor: "#f5f5f5",

                    // Text styles
                    textSize: "20px",
                    textColor: "#333",
                    fontWeight: "bold",

                    // Rotation and animation
                    rotation: 0.25, // Start progress from top
                    pathTransitionDuration: 0.8, // Slower animation for more visual impact
                  })}
                />

                {/* Optional: Add a glow effect around the progress bar */}
                {progress > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: "50%",
                      boxShadow: `0 0 ${progress / 5}px ${progress / 10}px ${
                        progress < 50
                          ? "rgba(255, 152, 0, 0.3)"
                          : progress < 100
                          ? "rgba(76, 175, 80, 0.3)"
                          : "rgba(33, 150, 243, 0.3)"
                      }`,
                      zIndex: -1,
                    }}
                  />
                )}
              </div>

              {/* Status text below the progress bar */}
              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "500",
                  fontSize: "14px",
                  color:
                    progress < 50
                      ? "#ff9800"
                      : progress < 100
                      ? "#4caf50"
                      : "#2196f3",
                }}
              >
                {progress === 0 && "Not Started"}
                {progress > 0 && progress < 50 && "Just Started"}
                {progress >= 50 && progress < 100 && "Almost There!"}
                {progress === 100 && "Complete!"}
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <main className={styles.content}>
        {profile ? (
          <div>
            <h3>
              Welcome, {profile.firstName} {profile.lastName}!
            </h3>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
        {/* This Outlet will render the content dynamically based on the routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default MyProfile;

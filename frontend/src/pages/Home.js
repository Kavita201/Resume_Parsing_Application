import { useState } from "react";
import { useDispatch } from "react-redux";
import { setResumeData } from "../redux/slices/resumeSlice";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();

      if (data.user?.id) {
        sessionStorage.setItem("userId", data.user.id);
      }

      dispatch(setResumeData(data.parsedData));

      setTimeout(() => {
        setLoading(false);
        navigate("/profile/basic-info");
      }, 1000);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h1 className={styles.heading}>Welcome to Our Career Portal</h1>
        <p className={styles.subheading}>
          {/* Upload your resume and let our AI-powered parser extract your
          professional profile in seconds. */}
          Accelerate your application process — upload your resume and let our
          intelligent parser do the heavy lifting.
        </p>
        <p className={styles.cta}>
          Get started on your next opportunity today.
        </p>
      </div>

      <div className={styles.right}>
        {loading && (
          <div className={styles.overlay}>
            <div className={styles.loaderBox}>
              <div className={styles.spinner}></div>
              <p>Parsing your resume...</p>
            </div>
          </div>
        )}
        <label htmlFor="fileInput" className={styles.uploadBox}>
          <FaCloudUploadAlt className={styles.icon} />
          <p className={styles.uploadText}>
            Drag & drop your resume here or click to upload
          </p>
          <input type="file" id="fileInput" onChange={handleUpload} />
        </label>
      </div>
    </div>
  );
};

export default Home;

// 1. Grab the file
// 2. Create a FormData object with it
// 3. Set loading to true
// 4. Send the file to the backend
// 5. If successful:
//    - Save userId in sessionStorage
//    - Store parsed resume data in Redux
//    - Navigate to `/profile/basic-info`
// 6. If there's an error → log it
// 7. Finally, stop the loading spinner

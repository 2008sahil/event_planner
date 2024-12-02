import React, { useState, useEffect } from "react";
import axios from "axios";

const EventModal = ({ date, selectedEvent, onClose }) => {
  const [title, setTitle] = useState(selectedEvent?.title || "");
  const [file, setFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(selectedEvent?.videoUrl || "");
  const [time, setTime] = useState(selectedEvent?.time || "00:00");
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title || "");
      setTime(selectedEvent.time || "00:00");
      setVideoUrl(selectedEvent.videoUrl || "");
      setFile(null);
      setImagePreview(selectedEvent.file);
    } else {
      setTitle("");
      setTime("00:00");
      setVideoUrl("");
      setFile(null);
      setImagePreview(null);
    }
  }, [selectedEvent]);

  const checkUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/[^\s]*)?$/i; // Example for YouTube URLs
    return url !== "" && !urlPattern.test(url); // Returns true if the URL is invalid
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if(checkUrl(videoUrl)){
      setError("URL is incorrect");
        return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date.toISOString());
    formData.append("time", time);
    formData.append("videoUrl", videoUrl); // Save video URL as plain text
    if (file) formData.append("file", file);

    try {
      if (selectedEvent) {
        await axios.put(
          `http://localhost:4000/events/${selectedEvent.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:4000/events", formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/events/${selectedEvent.id}`);
      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <h2 style={styles.heading}>
          {selectedEvent ? "Edit Event" : "New Event"}
        </h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          style={styles.input}
        />

        <label style={styles.label}>
          <span> Start Time:</span>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          <span>Image:</span>
        </label>
        <div style={styles.inputContainer}>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={styles.fileInput}
          />
        </div>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={styles.imagePreview}
          />
        )}

        <label style={styles.label}>
          <span>Video URL:</span>
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://example.com/video.mp4"
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button onClick={handleSave} style={styles.saveButton}>
            Save
          </button>
          <div style={{ gap: "5px" }}>
            <button onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            {selectedEvent && (
              <button onClick={handleDelete} style={styles.cancelButton}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "500px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  inputContainer: {
    width: "90%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    height: "5vh",
    marginBottom: "10px",

  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },


  heading: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "20px",
  },

  input: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  label: {
    display: "block",
    fontSize: "14px",
    marginBottom: "8px",
  },
  timeInput: {
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  fileInput: {
    marginBottom: "20px",
  },
  imagePreview: {
    width: "100%",
    maxHeight: '150px',
    marginBottom: "10px",
    borderRadius: "4px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    margin: "2px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default EventModal;


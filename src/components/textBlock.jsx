import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "../App.css";

function TextBlock() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const rootProps = getRootProps(); // Call getRootProps here

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handlePostClick = async () => {
    try {
      const apiUrl = "http://127.0.0.1:5000"; // Replace with your actual API URL
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files[]", file);
      });

      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message);
        // Handle success if needed
      } else {
        const errorData = await response.json();
        console.error("Error uploading images:", errorData.message);
        // Handle the error as needed
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div
      id="textblock"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <div
        {...rootProps}
        className={`dropzone ${isDragActive ? "active" : ""}`}
        style={{
          border: "2px dashed #cccccc",
          borderRadius: "4px",
          padding: "20px",
          textAlign: "center",
          color: "white",
        }}
      >
        <input {...getInputProps()} />
        <p style={{ color: "white" }}>
          Drag 'n' drop some images here, or click to select files
        </p>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap" }}>
          {files.map((file, index) => (
            <div
              key={index}
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                position: "relative",
              }}
            >
              <img
                src={file.preview}
                alt={`Preview-${index}`}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  borderRadius: "4px",
                }}
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          type="button"
          onClick={handlePostClick}
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "blue",
            color: "white",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Post
        </button>
      )}
    </div>
  );
}

export default TextBlock;

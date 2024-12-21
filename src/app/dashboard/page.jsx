'use client';
import React, { useState } from 'react'; // Import useState from React
import styles from './page.module.css';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

function Page() {
  const [formData, setFormData] = useState({
    nick_name: "",
    email: "",
    password: "",
    rpassword: "",
  });

  const [loggedInUser, setLoggedInUser] = useState(""); // State to store logged-in nickname
  const [topic, setTopic] = useState("");
  const [intro, setIntro] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Science");
  const [thumbnail, setThumbnail] = useState(null);
  const [image1, setImage1] = useState(null);
  const [pkg, setPkg] = useState("0");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // File to Base64 conversion
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Base64 result:', reader.result); // Check Base64 result
        resolve(reader.result.split(',')[1]); // Get the Base64 string excluding the data URL
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };


  // Handle file selection for both thumbnail and image1
  const handleFileChange = async (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file); // Check if the file is selected properly
      setFile(file);
    }
  };


  // Handle registration of the author
  const handleAuthorRegister = async () => {
    if (formData.password !== formData.rpassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const response = await fetch("http://localhost:3000/api/addAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          nick_name: formData.nick_name,
          password: hashedPassword,
          registered_by: "admin", // Or dynamic value
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result?.error || "Unknown error";
        throw new Error(errorMessage);
      }

      alert("Author registered successfully!");
      setLoggedInUser(formData.nick_name); // Set the logged-in nickname
      setFormData({ nick_name: "", email: "", password: "", rpassword: "" }); // Reset form data
    } catch (error) {
      console.error("Error registering author:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle Post upload form submission
  // Handle Post upload form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form submission

    console.log("Form submitted");

    if (!topic || !intro || !content) {
      alert("Please fill in all fields for the post!");
      return;
    }

    try {
      const uploadedFiles = {};

      // Convert files to Base64 if selected
      if (thumbnail) {
        uploadedFiles.thumbnail = await fileToBase64(thumbnail);
      } else {
        console.log('No thumbnail selected');
      }
      

      if (image1) {
        uploadedFiles.image1 = await fileToBase64(image1);
      }

      // Sending data to API Route
      const response = await fetch("http://localhost:3000/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          intro,
          content,
          category,
          thumbnail: uploadedFiles.thumbnail || null,
          image1: uploadedFiles.image1 || null,
          loggedInUser: loggedInUser || "author",
          pkg,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Post uploaded successfully!");
        setTopic("");  // Clear input fields after successful post
        setIntro("");
        setContent("");
        setThumbnail(null);
        setImage1(null);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error uploading post:", error);
      alert("Failed to upload the post");
    }
  };


  return (
    <>
      <div className="row">
        <div className="col">
          <div className={styles.sidebar}>
            <h3 className="ms-5 mt-5 mb-2 me-5">The Writer</h3>
            <br />
            <h6 className="ms-5">Hello, {loggedInUser || "Name"}</h6>
            <hr />
            <span>
              <h6
                className="ms-5 me-5 mt-4 mb-3"
                data-bs-toggle="modal"
                data-bs-target="#postModal"
              >
                Upload a Blog
              </h6>
            </span>
            <span>
              <h6
                className="ms-5 me-5 mt-4 mb-3"
                data-bs-toggle="modal"
                data-bs-target="#authorModal"
              >
                Register an Author
              </h6>
            </span>
          </div>
        </div>
        <div className="col">
          <div className={styles.content}>
            <div className="row m-3">
              <h1 className="mt-4">Dashboard</h1>
            </div>
            <div className="row mt-5 ms-4 me-4">
              <div className={styles.topdiv}>
                <table className={styles.toptbl}>
                  <thead></thead>
                  <tbody>
                    <tr>
                      <td>
                        <div class="card me-3" style={{ width: "20vw" }}>
                          <div class="card-body">
                            <div class="card-body" style={{ background: "green" }}>
                              <center><h3>00</h3></center>
                              <center><h4>Posts</h4></center>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card me-3" style={{ width: "20vw" }}>
                          <div class="card-body">
                            <div class="card-body" style={{ background: "green" }}>
                              <center><h3>00</h3></center>
                              <center><h4>Likes</h4></center>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card me-3" style={{ width: "20vw" }}>
                          <div class="card-body">
                            <div class="card-body" style={{ background: "green" }}>
                              <center><h3>00</h3></center>
                              <center><h4>Dislikes</h4></center>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="card me-3" style={{ width: "20vw" }}>
                          <div class="card-body">
                            <div class="card-body" style={{ background: "green" }}>
                              <center><h3>00</h3></center>
                              <center><h4>Reaches</h4></center>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Registration Modal */}
      <form>
        <div
          className="modal fade"
          id="authorModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Register an Author
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Nick name
                  </span>
                  <input
                    type="text"
                    id="nick_name"
                    className="form-control"
                    value={formData.nick_name}
                    onChange={handleChange}
                    placeholder="Nickname"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Email
                  </span>
                  <input
                    type="text"
                    id="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Password
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Repeat Password
                  </span>
                  <input
                    type="password"
                    id="rpassword"
                    className="form-control"
                    value={formData.rpassword}
                    onChange={handleChange}
                    placeholder="Repeat Password"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleAuthorRegister}
                  className="btn btn-primary"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Post Upload Modal */}
      <form onSubmit={handleSubmit}>
        <div
          className="modal fade"
          id="postModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Upload Blog
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Topic
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter Topic"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Intro
                  </span>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder="Enter Intro"
                  ></textarea>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    Content
                  </span>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter Content"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="thumbnail" className="form-label">
                    Thumbnail Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="thumbnail"
                    onChange={(e) => handleFileChange(e, setThumbnail)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="image1" className="form-label">
                    Additional Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image1"
                    onChange={(e) => handleFileChange(e, setImage1)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>

                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Package
                  </label>
                  <select
                    id="pkg"
                    className="form-select"
                    value={pkg}
                    onChange={(e) => setPkg(e.target.value)}
                  >
                    <option value="0">Basic</option>
                    <option value="1">Premium</option>
                  </select>
                  
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}


export default Page;

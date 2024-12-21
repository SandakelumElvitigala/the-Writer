"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// Initialize Supabase
const supabase = createClient(
  "https://ejjmcjkmufnwjehfasif.supabase.co", // Replace with your Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqam1jamttdWZud2plaGZhc2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MTMxMjUsImV4cCI6MjA1MDE4OTEyNX0.AAQponWm_wfTtTaHiUdvZlZm27kW-sUMLjSFqprbkrc" // Replace with your public Anon key
);

export default function Home() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [postDetails, setPostDetails] = useState({ topic: "", category: "", intro: "" });
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);
  const [pkg, setPkg] = useState(null);
  const [posts, setPosts] = useState([]); // New state to hold all fetched posts

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts") // Ensure this is the correct table name
          .select("*") // Fetch all columns
          .eq("pkg", 0) // Only fetch posts where 'pkg' is 0
          .order("created_at", { ascending: false }) // Ordering by created_at, descending
          .limit(5); // Fetch multiple posts

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        if (data && data.length > 0) {
          setPosts(data); // Set all fetched posts to state

          // Assuming the first post's thumbnail is Base64-encoded in the 'thumbnail' column
          const base64Image = data[0].thumbnail;
          setThumbnailUrl(`data:image/png;base64,${base64Image}`);

          setPostDetails({
            topic: data[0].topic || "No topic available",
            category: data[0].category || "No category available",
            intro: data[0].intro || "No introduction available",
            author: data[0].posted_by || "Anonymous",
          });

          setPkg(data[0].pkg);
        } else {
          console.warn("No posts found with 'pkg' as 0.");
        }
      } catch (err) {
        console.error("Unexpected error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const toggleIntro = () => {
    setIsIntroExpanded(!isIntroExpanded);
  };

  const truncatedIntro = postDetails.intro.length > 100 && !isIntroExpanded
    ? postDetails.intro.slice(0, 200) + "..."
    : postDetails.intro;

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            The Writer
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
              <a className="nav-link" href="#">
                Features
              </a>
              <a className="nav-link" href="#">
                Pricing
              </a>
              <a className="nav-link disabled" aria-disabled="true">
                Request
              </a>
              {pkg !== 1 && (
                <button className="btn btn-outline-info ms-2 ps-4 pe-4">Get Premium</button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.ltst}>
        <h1 className="mt-4 mb-4 ms-4">Latest</h1>
      </div>

      <hr />

      <div className={styles.cont}>
        <div className="container mt-4">
          <div className="row d-flex align-items-center">
            <div className="col-12 col-md-6 mb-3">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="img-fluid"
                  style={{ height: "auto", width: "100%", objectFit: "cover" }}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="col-12 col-md-6 mt-4 mt-md-0">
              <div className={styles.description}>
                <h5>{postDetails.topic}&nbsp;<span className={styles.badgeBasic}>Basic</span></h5>
                <p><strong>Category:</strong> {postDetails.category}</p>
                <p><strong>Author:</strong> {postDetails.author}</p>
                <p><strong>Introduction:</strong> {truncatedIntro}</p>
                {postDetails.intro.length > 150 && (
                  <button
                    onClick={toggleIntro}
                    className="btn btn-link p-0"
                    style={{ fontSize: "14px" }}
                  >
                    {isIntroExpanded ? "See Less" : "See More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="" />

      <div className="content mt-5 mb-5">
        <div className="row mb-2 ms-2 me-2 card-container">
          {posts.map((post) => (
            <div className="col-md-6 mt-3 card-item" key={post.id}>
              <div className="row g-0 border rounded overflow-hidden shadow-sm h-md-250 position-relative">
                <div className="col p-4 d-flex flex-column position-static card-content">
                  <strong className="d-inline-block mb-2 text-primary-emphasis">{post.category}</strong>
                  <h3 className="mb-0">{post.topic}</h3>
                  <div className="mb-1 text-body-secondary">{post.created_at}</div>
                  <p className="card-text mb-auto">{post.intro.slice(0, 100)}...</p>
                  <a href="#" className="icon-link gap-1 icon-link-hover stretched-link card-link">
                    Continue reading
                  </a>
                </div>
                <div className="col-auto d-none d-lg-block">
                  <img
                    src={`data:image/png;base64,${post.thumbnail}`} // Assuming base64 thumbnail in post
                    alt="Thumbnail"
                    className="card-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>
  );
}

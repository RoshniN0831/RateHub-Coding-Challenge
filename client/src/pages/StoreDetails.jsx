import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import coffeeHouseImage from "../assets/coffee-house.jpeg";
import midnightChapterImage from "../assets/midnight-chapter.jpeg";

import "./StoreDetails.css";


function StoreDetails() {

  const { id } = useParams();


  const [store, setStore] = useState(null);

  const [loading, setLoading] = useState(true);


  // Rating states
  const [selectedRating, setSelectedRating] =
    useState(null);

  const [existingRating, setExistingRating] =
    useState(null);

  const [hasRated, setHasRated] =
    useState(false);

  const [ratingMessage, setRatingMessage] =
    useState("");

  const [submittingRating, setSubmittingRating] =
    useState(false);


  // =========================================
  // GET IMAGE FOR STORE
  // =========================================

  const getStoreImage = (storeName) => {

    if (
      storeName ===
      "The Metropolitan Coffee House"
    ) {
      return coffeeHouseImage;
    }


    if (
      storeName ===
      "The Midnight Chapter Bookstore"
    ) {
      return midnightChapterImage;
    }


    return null;
  };


  // =========================================
  // FETCH CURRENT USER'S RATING
  // =========================================

  const fetchMyRating = async () => {

    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        `http://localhost:5000/api/ratings/my/${id}`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to load your rating"
        );

      }


      if (data.rated) {

        setHasRated(true);

        setExistingRating(
          Number(data.rating)
        );

        setSelectedRating(
          Number(data.rating)
        );

      } else {

        setHasRated(false);

        setExistingRating(null);

        setSelectedRating(null);

      }


    } catch (error) {

      console.error(
        "Failed to load your rating:",
        error
      );

    }

  };


  // =========================================
  // SUBMIT OR UPDATE RATING
  // =========================================

  const handleSubmitRating = async () => {

    if (!selectedRating) {

      setRatingMessage(
        "Please select a rating first."
      );

      return;
    }


    try {

      setSubmittingRating(true);

      setRatingMessage("");


      const token =
        localStorage.getItem("token");


      // =====================================
      // CHOOSE POST OR PUT
      // =====================================

      const method =
        hasRated ? "PUT" : "POST";


      const response = await fetch(
        "http://localhost:5000/api/ratings",
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            store_id: Number(id),
            rating: selectedRating,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to save rating"
        );

      }


      // =====================================
      // UPDATE LOCAL STATE
      // =====================================

      setHasRated(true);

      setExistingRating(
        Number(selectedRating)
      );


      if (method === "POST") {

        setRatingMessage(
          "Rating submitted successfully!"
        );

      } else {

        setRatingMessage(
          "Rating updated successfully!"
        );

      }


      // =====================================
      // REFRESH STORE RATING
      // =====================================

      const storeResponse =
        await fetch(
          `http://localhost:5000/api/stores/${id}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      const storeData =
        await storeResponse.json();


      if (storeResponse.ok) {

        setStore(
          storeData.store
        );

      }


    } catch (error) {

      console.error(
        "Rating submission error:",
        error
      );


      setRatingMessage(
        error.message
      );


    } finally {

      setSubmittingRating(false);

    }

  };


  // =========================================
  // FETCH STORE + USER RATING
  // =========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token =
          localStorage.getItem("token");


        // -------------------------------
        // FETCH STORE
        // -------------------------------

        const storeResponse =
          await fetch(
            `http://localhost:5000/api/stores/${id}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const storeData =
          await storeResponse.json();


        if (!storeResponse.ok) {

          throw new Error(
            storeData.message ||
            "Failed to load store"
          );

        }


        setStore(
          storeData.store
        );


        // -------------------------------
        // FETCH USER'S RATING
        // -------------------------------

        await fetchMyRating();


      } catch (error) {

        console.error(
          "Failed to load store:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchData();

  }, [id]);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="store-details-page">

        <div className="store-details-message">

          Loading store...

        </div>

      </div>

    );

  }


  // =========================================
  // STORE NOT FOUND
  // =========================================

  if (!store) {

    return (

      <div className="store-details-page">

        <div className="store-details-message">

          Store not found.

          <br />

          <Link to="/stores">
            ← Back to stores
          </Link>

        </div>

      </div>

    );

  }


  const storeImage =
    getStoreImage(store.name);


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="store-details-page">


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="store-details-nav">

        <Link
          to="/dashboard"
          className="store-details-brand"
        >

          <span className="brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <Link
          to="/stores"
          className="back-link"
        >
          ← All stores
        </Link>

      </nav>



      <main className="store-details-content">


        {/* =====================================
            STORE LABEL
        ====================================== */}

        <span className="eyebrow">
          STORE DETAILS
        </span>



        {/* =====================================
            STORE IMAGE
        ====================================== */}

        {storeImage && (

          <div className="store-details-image-wrapper">

            <img
              src={storeImage}
              alt={store.name}
              className="store-details-image"
            />

          </div>

        )}



        {/* =====================================
            STORE HEADER
        ====================================== */}

        <section className="store-details-header">

          <div>

            <h1>
              {store.name}
            </h1>


            <p>
              {store.address}
            </p>

          </div>


          <div className="store-main-rating">

            <span>
              RATING
            </span>


            <strong>
              {store.rating}
            </strong>


            <small>
              Based on customer ratings
            </small>

          </div>

        </section>



        {/* =====================================
            STORE INFORMATION
        ====================================== */}

        <section className="store-info-grid">


          <div className="store-info-card">

            <span>
              STORE EMAIL
            </span>


            <strong>
              {store.email}
            </strong>

          </div>



          <div className="store-info-card">

            <span>
              STORE ID
            </span>


            <strong>
              #{store.id}
            </strong>

          </div>



          <div className="store-info-card">

            <span>
              OWNER ID
            </span>


            <strong>
              #{store.owner_id}
            </strong>

          </div>


        </section>



        {/* =====================================
            RATING SECTION
        ====================================== */}

        <section className="rating-section">


          <span className="eyebrow">
            YOUR EXPERIENCE
          </span>


          <h2>
            {hasRated
              ? "Update your rating."
              : "Rate this store."}
          </h2>


          <p>

            {hasRated
              ? "You have already rated this store. You can change your rating below."
              : "Share your experience by giving this store a rating from 1 to 5."}

          </p>



          <div className="rating-form">


            {/* CURRENT RATING */}

            {hasRated && (

              <p className="current-rating">

                Your current rating:

                <strong>
                  {" "}
                  {existingRating}/5
                </strong>

              </p>

            )}



            <p className="rating-label">
              Choose your rating
            </p>


            {/* RATING BUTTONS */}

            <div className="rating-buttons">

              {[1, 2, 3, 4, 5].map(
                (value) => (

                  <button
                    key={value}
                    type="button"
                    className={
                      selectedRating === value
                        ? "selected-rating"
                        : ""
                    }
                    onClick={() =>
                      setSelectedRating(value)
                    }
                  >
                    {value}
                  </button>

                )
              )}

            </div>



            {/* SUBMIT / UPDATE BUTTON */}

            <button
              className="submit-rating"
              onClick={handleSubmitRating}
              disabled={submittingRating}
            >

              {submittingRating

                ? "Saving..."

                : hasRated
                ? "Update rating →"
                : "Submit rating →"}

            </button>



            {/* MESSAGE */}

            {ratingMessage && (

              <p className="rating-message">

                {ratingMessage}

              </p>

            )}


          </div>

        </section>


      </main>

    </div>

  );
}


export default StoreDetails;
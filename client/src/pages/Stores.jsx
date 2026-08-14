import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import coffeeHouseImage from "../assets/coffee-house.jpeg";
import midnightChapterImage from "../assets/midnight-chapter.jpeg";

import "./Stores.css";


function Stores() {

  const [stores, setStores] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [myRatings, setMyRatings] =
    useState({});


  // =========================================
  // GET IMAGE FOR EACH STORE
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
  // GET STORE CATEGORY
  // =========================================

  const getStoreCategory = (storeName) => {

    if (
      storeName ===
      "The Metropolitan Coffee House"
    ) {
      return "COFFEE HOUSE";
    }


    if (
      storeName ===
      "The Midnight Chapter Bookstore"
    ) {
      return "BOOKSTORE";
    }


    return "STORE";
  };


  // =========================================
  // FETCH STORES + USER RATINGS
  // =========================================

  useEffect(() => {

    const fetchStores = async () => {

      try {

        const token =
          localStorage.getItem("token");


        // -------------------------------------
        // GET ALL STORES
        // -------------------------------------

        const response =
          await fetch(
            "http://localhost:5000/api/stores",
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
            "Failed to load stores"
          );

        }


        const storeList =
          data.stores || [];


        setStores(storeList);


        // -------------------------------------
        // GET CURRENT USER'S RATING
        // FOR EACH STORE
        // -------------------------------------

        const ratingResults =
          await Promise.all(

            storeList.map(
              async (store) => {

                try {

                  const ratingResponse =
                    await fetch(
                      `http://localhost:5000/api/ratings/my/${store.id}`,
                      {
                        method: "GET",

                        headers: {
                          Authorization:
                            `Bearer ${token}`,
                        },
                      }
                    );


                  const ratingData =
                    await ratingResponse.json();


                  return {
                    storeId: store.id,

                    rating:
                      ratingData.rated
                        ? Number(
                            ratingData.rating
                          )
                        : null,
                  };


                } catch (error) {

                  console.error(
                    `Failed to load rating for store ${store.id}:`,
                    error
                  );


                  return {
                    storeId: store.id,
                    rating: null,
                  };

                }

              }
            )

          );


        // -------------------------------------
        // CONVERT RATINGS INTO OBJECT
        // -------------------------------------

        const ratingMap = {};


        ratingResults.forEach(
          (item) => {

            ratingMap[
              item.storeId
            ] = item.rating;

          }
        );


        setMyRatings(
          ratingMap
        );


      } catch (error) {

        console.error(
          "Failed to load stores:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchStores();

  }, []);


  // =========================================
  // FILTER STORES
  // NAME + ADDRESS
  // =========================================

  const filteredStores =
    stores.filter((store) => {

      const searchText =
        search
          .trim()
          .toLowerCase();


      if (!searchText) {
        return true;
      }


      return (

        store.name
          ?.toLowerCase()
          .includes(searchText) ||

        store.address
          ?.toLowerCase()
          .includes(searchText)

      );

    });


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="stores-page">


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="stores-nav">

        <Link
          to="/dashboard"
          className="stores-brand"
        >

          <span className="brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <Link
          to="/dashboard"
          className="back-link"
        >
          ← Dashboard
        </Link>

      </nav>



      <main className="stores-content">


        {/* =====================================
            HEADER
        ====================================== */}

        <section className="stores-header">

          <span className="eyebrow">
            DISCOVER
          </span>


          <h1>
            Explore
            <span> stores.</span>
          </h1>


          <p>
            Discover stores, compare ratings, and find
            experiences worth trying.
          </p>

        </section>



        {/* =====================================
            SEARCH
        ====================================== */}

        <section className="stores-search-section">

          <input
            type="text"
            className="stores-search"
            placeholder="Search stores by name or address..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </section>



        {/* =====================================
            LOADING
        ====================================== */}

        {loading ? (

          <div className="stores-message">
            Loading stores...
          </div>


        ) : filteredStores.length === 0 ? (

          <div className="stores-message">

            {stores.length === 0
              ? "No stores available yet."
              : "No stores match your search."}

          </div>


        ) : (


          /* ===================================
             STORE GRID
          ==================================== */

          <section className="stores-grid">


            {filteredStores.map(
              (store) => {

                const storeImage =
                  getStoreImage(
                    store.name
                  );


                const userRating =
                  myRatings[
                    store.id
                  ];


                return (

                  <article
                    className="store-card"
                    key={store.id}
                  >


                    {/* IMAGE */}

                    {storeImage && (

                      <img
                        src={storeImage}
                        alt={store.name}
                        className="store-card-image"
                      />

                    )}



                    {/* TOP INFORMATION */}

                    <div className="store-card-top">

                      <span className="store-category">

                        {getStoreCategory(
                          store.name
                        )}

                      </span>


                      <span className="store-rating">

                        {store.rating}

                      </span>

                    </div>



                    {/* STORE NAME */}

                    <h2>
                      {store.name}
                    </h2>



                    {/* ADDRESS */}

                    <p className="store-address">
                      {store.address}
                    </p>



                    {/* =================================
                        RATINGS
                    ================================== */}

                    <div className="store-rating-details">


                      <div>

                        <span>
                          OVERALL RATING
                        </span>

                        <strong>
                          {store.rating}/5
                        </strong>

                      </div>



                      <div>

                        <span>
                          YOUR RATING
                        </span>

                        <strong>

                          {userRating !== null &&
                          userRating !== undefined

                            ? `${userRating}/5`

                            : "Not rated"}

                        </strong>

                      </div>


                    </div>



                    {/* BOTTOM */}

                    <div className="store-card-bottom">

                      <span>
                        {store.email}
                      </span>


                      <Link
                        to={`/stores/${store.id}`}
                      >
                        View store →
                      </Link>

                    </div>


                  </article>

                );

              }
            )}

          </section>

        )}


      </main>

    </div>

  );

}


export default Stores;
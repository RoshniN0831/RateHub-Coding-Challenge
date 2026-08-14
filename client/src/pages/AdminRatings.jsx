import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./AdminRatings.css";


function AdminRatings() {

  const [ratings, setRatings] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [sortField, setSortField] =
    useState("user_name");

  const [sortDirection, setSortDirection] =
    useState("asc");


  // =========================================
  // FETCH RATINGS
  // =========================================

  useEffect(() => {

    const fetchRatings = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response = await fetch(
          "http://localhost:5000/api/admin/ratings",
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
            "Failed to load ratings"
          );

        }


        setRatings(
          data.ratings || []
        );


      } catch (error) {

        console.error(
          "Admin ratings error:",
          error
        );

        setErrorMessage(
          error.message
        );


      } finally {

        setLoading(false);

      }

    };


    fetchRatings();

  }, []);


  // =========================================
  // SORT
  // =========================================

  const handleSort = (field) => {

    if (sortField === field) {

      setSortDirection(
        sortDirection === "asc"
          ? "desc"
          : "asc"
      );

    } else {

      setSortField(field);
      setSortDirection("asc");

    }

  };


  // =========================================
  // FILTER + SORT
  // =========================================

  const filteredRatings = ratings
    .filter((rating) => {

      const searchText =
        search.toLowerCase();


      return (

        rating.user_name
          ?.toLowerCase()
          .includes(searchText) ||

        rating.store_name
          ?.toLowerCase()
          .includes(searchText)

      );

    })
    .sort((a, b) => {

      if (sortField === "rating") {

        const first =
          Number(a.rating || 0);

        const second =
          Number(b.rating || 0);

        return sortDirection === "asc"
          ? first - second
          : second - first;

      }


      const first =
        String(
          a[sortField] || ""
        ).toLowerCase();

      const second =
        String(
          b[sortField] || ""
        ).toLowerCase();


      if (first < second) {

        return sortDirection === "asc"
          ? -1
          : 1;

      }


      if (first > second) {

        return sortDirection === "asc"
          ? 1
          : -1;

      }


      return 0;

    });


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="admin-ratings-message">
        Loading ratings...
      </div>
    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (errorMessage) {

    return (

      <div className="admin-ratings-message">

        <p>
          {errorMessage}
        </p>

        <Link to="/admin">
          ← Back to dashboard
        </Link>

      </div>

    );

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="admin-ratings-page">


      {/* NAVIGATION */}

      <nav className="admin-ratings-nav">

        <Link
          to="/admin"
          className="admin-ratings-brand"
        >

          <span className="admin-ratings-brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <div className="admin-ratings-nav-right">

          <span>
            ADMIN
          </span>


          <button
            onClick={handleLogout}
            className="admin-ratings-logout"
          >
            Log out
          </button>

        </div>

      </nav>



      <main className="admin-ratings-content">


        {/* BACK */}

        <Link
          to="/admin"
          className="admin-ratings-back"
        >
          ← Back to dashboard
        </Link>



        {/* HEADER */}

        <section className="admin-ratings-header">

          <span>
            RATING MANAGEMENT
          </span>


          <h1>
            Platform ratings.
          </h1>


          <p>
            Monitor ratings submitted by RateHub
            users across all stores.
          </p>

        </section>



        {/* SUMMARY */}

        <div className="admin-ratings-summary">

          <span>
            TOTAL RATINGS
          </span>

          <strong>
            {ratings.length}
          </strong>

        </div>



        {/* SEARCH */}

        <section className="admin-ratings-controls">

          <input
            type="text"
            className="admin-ratings-search"
            placeholder="Search by customer or store..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </section>



        {/* RATINGS TABLE */}

        <section className="admin-ratings-table">


          {/* HEADER */}

          <div className="admin-ratings-table-head">

            <button
              type="button"
              onClick={() =>
                handleSort("user_name")
              }
            >
              CUSTOMER{" "}
              {sortField === "user_name"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>


            <button
              type="button"
              onClick={() =>
                handleSort("store_name")
              }
            >
              STORE{" "}
              {sortField === "store_name"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>


            <button
              type="button"
              onClick={() =>
                handleSort("rating")
              }
            >
              RATING{" "}
              {sortField === "rating"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>

          </div>



          {/* RATINGS */}

          {filteredRatings.map(
            (rating) => (

              <div
                className="admin-ratings-table-row"
                key={rating.id}
              >


                {/* CUSTOMER */}

                <div className="admin-rating-customer">

                  <div className="admin-rating-avatar">

                    {rating.user_name
                      ? rating.user_name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>


                  <div>

                    <strong>
                      {rating.user_name}
                    </strong>

                    <small>
                      User ID #{rating.user_id}
                    </small>

                  </div>

                </div>



                {/* STORE */}

                <span>
                  {rating.store_name}
                </span>



                {/* RATING */}

                <div className="admin-rating-value">

                  <span className="admin-rating-stars">

                    {"★".repeat(
                      Number(
                        rating.rating
                      )
                    )}

                  </span>


                  <strong>
                    {rating.rating}/5
                  </strong>

                </div>


              </div>

            )
          )}



          {filteredRatings.length === 0 && (

            <div className="admin-ratings-empty">
              No ratings found.
            </div>

          )}


        </section>


      </main>


    </div>

  );

}


export default AdminRatings;
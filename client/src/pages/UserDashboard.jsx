import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Star,
  MessageSquare,
  Store,
} from "lucide-react";

import coffeeHouseImage from "../assets/coffee-house.jpeg";

import "./UserDashboard.css";


function UserDashboard() {

  // =========================================
  // USER
  // =========================================

  const [user, setUser] = useState(null);

  const [currentPassword, setCurrentPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

const [passwordMessage, setPasswordMessage] =
  useState("");

const [passwordError, setPasswordError] =
  useState("");

const [changingPassword, setChangingPassword] =
  useState(false);


  // =========================================
  // DASHBOARD STATISTICS
  // =========================================

  const [stats, setStats] = useState({
    totalRatings: 0,
    storesExplored: 0,
  });


  // =========================================
  // FEATURED STORE
  // =========================================

  const [coffeeHouse, setCoffeeHouse] = useState(null);


  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        const storedUser =
          localStorage.getItem("user");

        const token =
          localStorage.getItem("token");


        // =====================================
        // GET LOGGED-IN USER
        // =====================================

        if (storedUser) {

          setUser(
            JSON.parse(storedUser)
          );

        }


        // =====================================
        // GET USER STATISTICS
        // =====================================

        const statsResponse =
          await fetch(
            "http://localhost:5000/api/ratings/my-stats",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        const statsData =
          await statsResponse.json();


        if (statsResponse.ok) {

          setStats({
            totalRatings:
              statsData.totalRatings || 0,

            storesExplored:
              statsData.storesExplored || 0,
          });

        } else {

          console.error(
            "Failed to load user statistics:",
            statsData.message
          );

        }


        // =====================================
        // GET STORES
        // =====================================

        const storesResponse =
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


        const storesData =
          await storesResponse.json();


        if (storesResponse.ok) {

          const metropolitanStore =
            (storesData.stores || []).find(
              (store) =>
                store.name ===
                "The Metropolitan Coffee House"
            );


          if (metropolitanStore) {

            setCoffeeHouse(
              metropolitanStore
            );

          }

        } else {

          console.error(
            "Failed to load stores:",
            storesData.message
          );

        }


      } catch (error) {

        console.error(
          "Failed to load dashboard data:",
          error
        );

      }

    };


    loadDashboardData();

  }, []);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };

  const handleChangePassword = async (event) => {

  event.preventDefault();

  setPasswordMessage("");
  setPasswordError("");


  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {

    setPasswordError(
      "Please fill in all password fields."
    );

    return;
  }


  if (newPassword !== confirmPassword) {

    setPasswordError(
      "New passwords do not match."
    );

    return;
  }


  try {

    setChangingPassword(true);

    const token =
      localStorage.getItem("token");


    const response = await fetch(
      "http://localhost:5000/api/auth/change-password",
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      }
    );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to change password"
      );

    }


    setPasswordMessage(
      "Password changed successfully."
    );


    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");


  } catch (error) {

    console.error(
      "Change password error:",
      error
    );

    setPasswordError(
      error.message
    );

  } finally {

    setChangingPassword(false);

  }

};


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="dashboard-page">


      {/* =====================================
          NAVIGATION BAR
      ====================================== */}

      <nav className="dashboard-nav">


        <div className="dashboard-brand">

          <span className="brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </div>


        <div className="dashboard-nav-right">


          <div className="user-info">

            <span className="user-name">

              {user?.name ||
                "RateHub User"}

            </span>


            <span className="user-role">

              {user?.role ||
                "USER"}

            </span>

          </div>


          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Log out
          </button>


        </div>

      </nav>



      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-content">


        {/* =====================================
            WELCOME
        ====================================== */}

        <section className="dashboard-welcome">


          <div>

            <span className="eyebrow">
              USER DASHBOARD
            </span>


            <h1>

              Welcome back,

              <span>
                {" "}
                {user?.name || "User"}.
              </span>

            </h1>


            <p>
              Discover stores, compare ratings, and share
              your experience with the RateHub community.
            </p>

          </div>



          {/* EXPLORE STORES */}

          <Link
            to="/stores"
            className="explore-button"
          >

            <span>
              Explore stores
            </span>

            <span className="button-arrow">
              →
            </span>

          </Link>


        </section>



        {/* =====================================
            STATISTICS
        ====================================== */}

        <section className="dashboard-stats">


          {/* =================================
              YOUR RATINGS
          ================================== */}

          <div className="dashboard-stat">

            <span className="stat-number">
              01
            </span>


            <div className="stat-icon">

              <Star size={22} />

            </div>


            <strong>
              {stats.totalRatings}
            </strong>


            <p>
              Your ratings
            </p>

          </div>



          {/* =================================
              REVIEWS WRITTEN
          ================================== */}

          <div className="dashboard-stat">

            <span className="stat-number">
              02
            </span>


            <div className="stat-icon">

              <MessageSquare size={22} />

            </div>


            <strong>
              0
            </strong>


            <p>
              Reviews written
            </p>

          </div>



          {/* =================================
              STORES EXPLORED
          ================================== */}

          <div className="dashboard-stat">

            <span className="stat-number">
              03
            </span>


            <div className="stat-icon">

              <Store size={22} />

            </div>


            <strong>
              {stats.storesExplored}
            </strong>


            <p>
              Stores explored
            </p>

          </div>


        </section>



        {/* =====================================
            DISCOVER STORES
        ====================================== */}

        <section className="stores-section">


          {/* SECTION TITLE */}

          <div className="section-title">


            <div>

              <span className="eyebrow">
                DISCOVER
              </span>


              <h2>
                Explore stores.
              </h2>

            </div>


            <Link
              to="/stores"
              className="view-all"
            >
              View all →
            </Link>


          </div>



          {/* =====================================
              STORE GRID
          ====================================== */}

          <div className="store-grid">


            {/* =================================
                COFFEE HOUSE
            ================================== */}

            <article className="store-card">


              {/* IMAGE */}

              <img
                src={coffeeHouseImage}
                alt="The Metropolitan Coffee House"
                className="store-card-image"
              />



              {/* TOP */}

              <div className="store-card-top">


                <span className="store-category">
                  COFFEE HOUSE
                </span>


                <span className="store-rating">

                  {coffeeHouse
                    ? coffeeHouse.rating
                    : "—"}

                </span>


              </div>



              {/* NAME */}

              <h3>
                The Metropolitan Coffee House
              </h3>



              {/* LOCATION */}

              <p className="store-location">

                {coffeeHouse?.address ||
                  "Pune, Maharashtra"}

              </p>



              {/* BOTTOM */}

              <div className="store-card-bottom">


                <span>
                  Verified ratings
                </span>


                <span className="rating-stars">
                  ★★★★★
                </span>


              </div>



              {/* VIEW STORE */}

              {coffeeHouse && (

                <Link
                  to={`/stores/${coffeeHouse.id}`}
                  className="dashboard-store-link"
                >
                  View store →
                </Link>

              )}


            </article>


          </div>


        </section>

        {/* =====================================
    CHANGE PASSWORD
====================================== */}

<section className="change-password-section">

  <div className="section-title">

    <div>

      <span className="eyebrow">
        ACCOUNT SECURITY
      </span>

      <h2>
        Change password.
      </h2>

    </div>

  </div>


  <form
    className="change-password-form"
    onSubmit={handleChangePassword}
  >

    <div className="password-field">

      <label htmlFor="current-password">
        Current password
      </label>

      <input
        id="current-password"
        type="password"
        value={currentPassword}
        onChange={(event) =>
          setCurrentPassword(
            event.target.value
          )
        }
        placeholder="Enter current password"
        required
      />

    </div>


    <div className="password-field">

      <label htmlFor="new-password">
        New password
      </label>

      <input
        id="new-password"
        type="password"
        value={newPassword}
        onChange={(event) =>
          setNewPassword(
            event.target.value
          )
        }
        placeholder="Enter new password"
        minLength="8"
        maxLength="16"
        required
      />

      <small>
        8–16 characters, at least one uppercase
        letter and one special character.
      </small>

    </div>


    <div className="password-field">

      <label htmlFor="confirm-password">
        Confirm new password
      </label>

      <input
        id="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(
            event.target.value
          )
        }
        placeholder="Confirm new password"
        minLength="8"
        maxLength="16"
        required
      />

    </div>


    <button
      type="submit"
      className="change-password-button"
      disabled={changingPassword}
    >

      {changingPassword
        ? "Changing..."
        : "Change password →"}

    </button>


    {passwordMessage && (

      <p className="password-success">
        {passwordMessage}
      </p>

    )}


    {passwordError && (

      <p className="password-error">
        {passwordError}
      </p>

    )}

  </form>

</section>


      </main>


    </div>

  );
}


export default UserDashboard;
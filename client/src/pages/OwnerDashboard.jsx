import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Store,
  MapPin,
  Mail,
} from "lucide-react";

import "./OwnerDashboard.css";


function OwnerDashboard() {

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // PASSWORD CHANGE
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
  // LOAD OWNER DASHBOARD
  // =========================================

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }


    const fetchOwnerStore = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response = await fetch(
          "http://localhost:5000/api/stores/owner",
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
            "Failed to load store"
          );

        }


        setStore(data.store);

      } catch (error) {

        console.error(
          "Owner store error:",
          error
        );

        setErrorMessage(
          error.message
        );

      }

    };


    const fetchOwnerRatings = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response = await fetch(
          "http://localhost:5000/api/ratings/owner",
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
          "Owner ratings error:",
          error
        );

      }

    };


    const loadOwnerDashboard =
      async () => {

        await Promise.all([
          fetchOwnerStore(),
          fetchOwnerRatings(),
        ]);

        setLoading(false);

      };


    loadOwnerDashboard();

  }, []);


  // =========================================
  // CHANGE PASSWORD
  // =========================================

  const handleChangePassword = async (
    event
  ) => {

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


    if (
      newPassword !== confirmPassword
    ) {

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
      <div className="owner-dashboard-message">

        <p>
          Loading your store...
        </p>

      </div>
    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (errorMessage) {

    return (
      <div className="owner-dashboard-message">

        <p>
          {errorMessage}
        </p>

        <Link to="/login">
          ← Back to login
        </Link>

      </div>
    );

  }


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="owner-dashboard-page">


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="owner-nav">

        <Link
          to="/owner"
          className="owner-brand"
        >

          <span className="owner-brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <div className="owner-nav-right">

          <div className="owner-user-info">

            <span>
              {user?.name ||
                "Store Owner"}
            </span>

            <small>
              {user?.role ||
                "STORE_OWNER"}
            </small>

          </div>


          <button
            className="owner-logout"
            onClick={handleLogout}
          >
            Log out
          </button>

        </div>

      </nav>



      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="owner-content">


        {/* ===================================
            WELCOME
        ==================================== */}

        <section className="owner-welcome">

          <div>

            <span className="owner-eyebrow">
              STORE OWNER DASHBOARD
            </span>


            <h1>
              Manage your store.
            </h1>


            <p>
              Monitor your store information and
              customer ratings from one place.
            </p>

          </div>

        </section>



        {/* ===================================
            STORE OVERVIEW
        ==================================== */}

        <section className="owner-store-section">

          <div className="owner-section-heading">

            <div>

              <span className="owner-eyebrow">
                YOUR STORE
              </span>


              <h2>
                Store overview.
              </h2>

            </div>

          </div>



          {store && (

            <article className="owner-store-card">


              <div className="owner-store-header">

                <div>

                  <span className="owner-store-category">
                    STORE
                  </span>


                  <h3>
                    {store.name}
                  </h3>

                </div>


                <div className="owner-rating-box">

                  <Star size={20} />

                  <strong>
                    {store.rating}
                  </strong>

                  <span>
                    Average rating
                  </span>

                </div>

              </div>



              <div className="owner-store-details">


                <div className="owner-detail">

                  <MapPin size={18} />

                  <div>

                    <span>
                      ADDRESS
                    </span>

                    <p>
                      {store.address}
                    </p>

                  </div>

                </div>



                <div className="owner-detail">

                  <Mail size={18} />

                  <div>

                    <span>
                      EMAIL
                    </span>

                    <p>
                      {store.email}
                    </p>

                  </div>

                </div>



                <div className="owner-detail">

                  <Store size={18} />

                  <div>

                    <span>
                      STORE ID
                    </span>

                    <p>
                      #{store.id}
                    </p>

                  </div>

                </div>


              </div>



              <div className="owner-store-footer">

                <div>

                  <strong>
                    {store.total_ratings}
                  </strong>

                  <span>
                    customer ratings
                  </span>

                </div>


                <Link
                  to={`/stores/${store.id}`}
                  className="owner-view-store"
                >
                  View store →
                </Link>

              </div>


            </article>

          )}

        </section>



        {/* ===================================
            CUSTOMER RATINGS
        ==================================== */}

        <section className="owner-ratings-section">

          <div className="owner-section-heading">

            <div>

              <span className="owner-eyebrow">
                CUSTOMER FEEDBACK
              </span>


              <h2>
                Recent ratings.
              </h2>

            </div>

          </div>



          <div className="owner-ratings-list">

            {ratings.length === 0 ? (

              <div className="owner-no-ratings">
                No ratings yet.
              </div>

            ) : (

              ratings.map(
                (rating) => (

                  <article
                    className="owner-rating-card"
                    key={rating.id}
                  >

                    <div className="owner-rating-user">

                      <div className="owner-user-avatar">

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

                        <span>
                          {rating.store_name}
                        </span>

                      </div>

                    </div>



                    <div className="owner-customer-rating">

                      <div className="rating-stars">

                        {"★".repeat(
                          Number(
                            rating.rating
                          )
                        )}

                      </div>


                      <strong>
                        {rating.rating}/5
                      </strong>

                    </div>


                  </article>

                )
              )

            )}

          </div>

        </section>



        {/* ===================================
            CHANGE PASSWORD
        ==================================== */}

        <section className="owner-password-section">

          <div className="owner-section-heading">

            <div>

              <span className="owner-eyebrow">
                ACCOUNT SECURITY
              </span>


              <h2>
                Change password.
              </h2>

            </div>

          </div>


          <form
            className="owner-password-form"
            onSubmit={handleChangePassword}
          >


            <div className="owner-password-field">

              <label htmlFor="owner-current-password">
                Current password
              </label>

              <input
                id="owner-current-password"
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



            <div className="owner-password-field">

              <label htmlFor="owner-new-password">
                New password
              </label>

              <input
                id="owner-new-password"
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



            <div className="owner-password-field">

              <label htmlFor="owner-confirm-password">
                Confirm new password
              </label>

              <input
                id="owner-confirm-password"
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
              className="owner-password-button"
              disabled={changingPassword}
            >

              {changingPassword
                ? "Changing..."
                : "Change password →"}

            </button>


            {passwordMessage && (

              <p className="owner-password-success">
                {passwordMessage}
              </p>

            )}


            {passwordError && (

              <p className="owner-password-error">
                {passwordError}
              </p>

            )}

          </form>

        </section>


      </main>

    </div>

  );

}


export default OwnerDashboard;
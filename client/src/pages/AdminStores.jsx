import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./AdminStores.css";


function AdminStores() {

  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  // SEARCH + SORT
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");


  // =========================================
  // FETCH STORES AND STORE OWNERS
  // =========================================

  useEffect(() => {

    const fetchData = async () => {

      try {

        const token = localStorage.getItem("token");


        // GET STORES
        const storesResponse = await fetch(
          "http://localhost:5000/api/stores",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const storesData = await storesResponse.json();

        if (!storesResponse.ok) {
          throw new Error(
            storesData.message ||
            "Failed to load stores"
          );
        }

        setStores(storesData.stores || []);


        // GET USERS / OWNERS
        const usersResponse = await fetch(
          "http://localhost:5000/api/admin/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const usersData = await usersResponse.json();

        if (!usersResponse.ok) {
          throw new Error(
            usersData.message ||
            "Failed to load users"
          );
        }

        const storeOwners =
          (usersData.users || []).filter(
            (user) => user.role === "STORE_OWNER"
          );

        setOwners(storeOwners);

      } catch (error) {

        console.error(
          "Admin stores error:",
          error
        );

        setErrorMessage(
          error.message ||
          "Failed to load store data"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);


  // =========================================
  // OPEN / CLOSE ADD STORE FORM
  // =========================================

  const toggleAddForm = () => {

    setShowAddForm(
      (previousValue) =>
        !previousValue
    );

    setFormMessage("");
    setFormError("");

  };


  // =========================================
  // FORM INPUT
  // =========================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    setFormError("");
    setFormMessage("");

  };


  // =========================================
  // ADD STORE
  // =========================================

  const handleAddStore = async (event) => {

    event.preventDefault();

    setFormError("");
    setFormMessage("");


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:5000/api/stores",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            formData
          ),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to create store"
        );

      }


      setFormMessage(
        "Store created successfully."
      );


      setFormData({
        name: "",
        email: "",
        address: "",
        owner_id: "",
      });


      // REFRESH STORES
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

        setStores(
          storesData.stores || []
        );

      }


    } catch (error) {

      console.error(
        "Add store error:",
        error
      );

      setFormError(
        error.message ||
        "Failed to create store"
      );

    }

  };


  // =========================================
  // SORT STORES
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
  // FILTER + SORT STORES
  // =========================================

  const filteredStores = stores
    .filter((store) => {

      const searchText =
        search.toLowerCase();


      return (

        store.name
          ?.toLowerCase()
          .includes(searchText) ||

        store.email
          ?.toLowerCase()
          .includes(searchText) ||

        store.address
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
      <div className="admin-stores-message">
        Loading stores...
      </div>
    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (errorMessage) {

    return (

      <div className="admin-stores-message">

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

    <div className="admin-stores-page">


      {/* NAVIGATION */}

      <nav className="admin-stores-nav">

        <Link
          to="/admin"
          className="admin-stores-brand"
        >

          <span className="admin-stores-brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <div className="admin-stores-nav-right">

          <span>
            ADMIN
          </span>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-stores-logout"
          >
            Log out
          </button>

        </div>

      </nav>



      <main className="admin-stores-content">


        <Link
          to="/admin"
          className="admin-stores-back"
        >
          ← Back to dashboard
        </Link>



        {/* HEADER */}

        <section className="admin-stores-header">

          <div>

            <span>
              STORE MANAGEMENT
            </span>

            <h1>
              Manage stores.
            </h1>

            <p>
              View existing stores and add new
              stores to RateHub.
            </p>

          </div>


          <button
            type="button"
            className="admin-add-store-button"
            onClick={toggleAddForm}
          >
            {showAddForm
              ? "Close form"
              : "Add store +"}
          </button>

        </section>



        {/* ADD STORE FORM */}

        {showAddForm && (

          <section className="admin-add-store-section">

            <div className="admin-add-store-heading">

              <span>
                NEW STORE
              </span>

              <h2>
                Add a store.
              </h2>

            </div>


            <form
              className="admin-add-store-form"
              onSubmit={handleAddStore}
            >


              <div className="admin-form-field">

                <label htmlFor="store-name">
                  Store name
                </label>

                <input
                  id="store-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter store name"
                  minLength="20"
                  maxLength="60"
                  required
                />

                <small>
                  20–60 characters
                </small>

              </div>



              <div className="admin-form-field">

                <label htmlFor="store-email">
                  Store email
                </label>

                <input
                  id="store-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="store@example.com"
                  required
                />

              </div>



              <div className="admin-form-field admin-form-full">

                <label htmlFor="store-address">
                  Address
                </label>

                <textarea
                  id="store-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter store address"
                  maxLength="400"
                  required
                />

                <small>
                  Maximum 400 characters
                </small>

              </div>



              <div className="admin-form-field">

                <label htmlFor="store-owner">
                  Store owner
                </label>

                <select
                  id="store-owner"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select store owner
                  </option>


                  {owners.map(
                    (owner) => (

                      <option
                        key={owner.id}
                        value={owner.id}
                      >
                        {owner.name}
                        {" — "}
                        {owner.email}
                      </option>

                    )
                  )}

                </select>

              </div>



              <div className="admin-form-submit">

                <button type="submit">
                  Create store
                </button>

              </div>


            </form>


            {formMessage && (

              <p className="admin-form-success">
                {formMessage}
              </p>

            )}


            {formError && (

              <p className="admin-form-error">
                {formError}
              </p>

            )}

          </section>

        )}



        {/* SEARCH */}

        <section className="admin-stores-controls">

          <input
            type="text"
            className="admin-stores-search"
            placeholder="Search by name, email or address..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </section>



        {/* STORES LIST */}

        <section className="admin-stores-list-section">

          <div className="admin-stores-list-heading">

            <span>
              ALL STORES
            </span>

            <h2>
              Registered stores.
            </h2>

          </div>


          <div className="admin-stores-table">


            {/* TABLE HEADER */}

            <div className="admin-stores-table-head">

              <button
                type="button"
                onClick={() =>
                  handleSort("name")
                }
              >
                STORE{" "}
                {sortField === "name"
                  ? sortDirection === "asc"
                    ? "↑"
                    : "↓"
                  : "↕"}
              </button>


              <button
                type="button"
                onClick={() =>
                  handleSort("address")
                }
              >
                ADDRESS{" "}
                {sortField === "address"
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


              <span>
                OWNER
              </span>

            </div>



            {/* STORES */}

            {filteredStores.map(
              (store) => (

                <div
                  className="admin-stores-table-row"
                  key={store.id}
                >

                  <div>

                    <strong>
                      {store.name}
                    </strong>

                    <small>
                      {store.email}
                    </small>

                  </div>


                  <span>
                    {store.address}
                  </span>


                  <strong>
                    {store.rating}
                  </strong>


                  <span>
                    #{store.owner_id}
                  </span>

                </div>

              )
            )}



            {filteredStores.length === 0 && (

              <div className="admin-stores-empty">
                No stores found.
              </div>

            )}

          </div>

        </section>


      </main>

    </div>

  );
}


export default AdminStores;
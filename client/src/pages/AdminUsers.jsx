import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./AdminUsers.css";


function AdminUsers() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("ALL");

  const [sortField, setSortField] =
    useState("name");

  const [sortDirection, setSortDirection] =
    useState("asc");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [formMessage, setFormMessage] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      address: "",
      password: "",
      role: "USER",
    });


  // =========================================
  // FETCH USERS
  // =========================================

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:5000/api/admin/users",
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
          "Failed to load users"
        );

      }


      setUsers(
        data.users || []
      );


    } catch (error) {

      console.error(
        "Admin users error:",
        error
      );

      setErrorMessage(
        error.message
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchUsers();

  }, []);


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";

  };


  // =========================================
  // FORM INPUT
  // =========================================

  const handleInputChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // =========================================
  // ADD USER
  // =========================================

  const handleAddUser = async (event) => {

    event.preventDefault();

    setFormMessage("");


    try {

      const token =
        localStorage.getItem("token");


      const response = await fetch(
        "http://localhost:5000/api/admin/users",
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
          "Failed to create user"
        );

      }


      setFormMessage(
        "User created successfully!"
      );


      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "USER",
      });


      await fetchUsers();


    } catch (error) {

      console.error(
        "Add user error:",
        error
      );

      setFormMessage(
        error.message
      );

    }

  };


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
  // FILTER + SORT USERS
  // =========================================

  const filteredUsers = users
    .filter((user) => {

      const searchText =
        search.toLowerCase();


      const matchesSearch =
        user.name
          ?.toLowerCase()
          .includes(searchText) ||

        user.email
          ?.toLowerCase()
          .includes(searchText) ||

        user.address
          ?.toLowerCase()
          .includes(searchText);


      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;


      return (
        matchesSearch &&
        matchesRole
      );

    })
    .sort((a, b) => {

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
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="admin-users-message">
        Loading users...
      </div>
    );

  }


  // =========================================
  // ERROR
  // =========================================

  if (errorMessage) {

    return (

      <div className="admin-users-message">

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

    <div className="admin-users-page">


      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="admin-users-nav">

        <Link
          to="/admin"
          className="admin-users-brand"
        >

          <span className="admin-users-brand-mark">
            R
          </span>

          <span>
            RateHub
          </span>

        </Link>


        <div className="admin-users-nav-right">

          <span>
            ADMIN
          </span>


          <button
            onClick={handleLogout}
            className="admin-users-logout"
          >
            Log out
          </button>

        </div>

      </nav>



      <main className="admin-users-content">


        {/* BACK */}

        <Link
          to="/admin"
          className="admin-users-back"
        >
          ← Back to dashboard
        </Link>



        {/* HEADER */}

        <section className="admin-users-header">

          <div>

            <span>
              USER MANAGEMENT
            </span>


            <h1>
              Registered users.
            </h1>


            <p>
              View and manage users registered
              on the RateHub platform.
            </p>

          </div>


          <button
            className="admin-add-user-button"
            onClick={() =>
              setShowAddForm(
                !showAddForm
              )
            }
          >
            {showAddForm
              ? "Close"
              : "Add user +"}
          </button>

        </section>



        {/* =====================================
            ADD USER FORM
        ====================================== */}

        {showAddForm && (

          <section className="admin-add-user-form">

            <h2>
              Add new user
            </h2>


            <form
              onSubmit={
                handleAddUser
              }
            >


              <div className="admin-form-grid">


                <div className="admin-form-field">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Full name"
                    required
                  />

                </div>



                <div className="admin-form-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Email address"
                    required
                  />

                </div>



                <div className="admin-form-field">

                  <label>
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Address"
                    required
                  />

                </div>



                <div className="admin-form-field">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleInputChange
                    }
                    placeholder="Password"
                    required
                  />

                </div>



                <div className="admin-form-field">

                  <label>
                    Role
                  </label>

                  <select
                    name="role"
                    value={
                      formData.role
                    }
                    onChange={
                      handleInputChange
                    }
                  >

                    <option value="USER">
                      USER
                    </option>

                    <option value="ADMIN">
                      ADMIN
                    </option>

                  </select>

                </div>


              </div>



              <button
                type="submit"
                className="admin-create-user-button"
              >
                Create user →
              </button>


              {formMessage && (

                <p className="admin-form-message">
                  {formMessage}
                </p>

              )}

            </form>

          </section>

        )}



        {/* =====================================
            SEARCH + FILTER
        ====================================== */}

        <section className="admin-users-controls">


          <input
            type="text"
            placeholder="Search by name, email or address..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            className="admin-users-search"
          />


          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(
                event.target.value
              )
            }
            className="admin-users-filter"
          >

            <option value="ALL">
              All roles
            </option>

            <option value="USER">
              USER
            </option>

            <option value="ADMIN">
              ADMIN
            </option>

          </select>


        </section>



        {/* =====================================
            USERS TABLE
        ====================================== */}

        <section className="admin-users-table">


          <div className="admin-users-table-head">

            <button
              onClick={() =>
                handleSort("name")
              }
            >
              NAME {sortField === "name"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>


            <button
              onClick={() =>
                handleSort("email")
              }
            >
              EMAIL {sortField === "email"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>


            <button
              onClick={() =>
                handleSort("address")
              }
            >
              ADDRESS {sortField === "address"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>


            <button
              onClick={() =>
                handleSort("role")
              }
            >
              ROLE {sortField === "role"
                ? sortDirection === "asc"
                  ? "↑"
                  : "↓"
                : "↕"}
            </button>

          </div>



          {filteredUsers.map(
            (user) => (

              <div
                className="admin-users-table-row"
                key={user.id}
              >


                <div className="admin-user-name">

                  <div className="admin-user-avatar">

                    {user.name
                      ? user.name
                          .charAt(0)
                          .toUpperCase()
                      : "U"}

                  </div>


                  <div>

                    <strong>
                      {user.name}
                    </strong>

                    <small>
                      ID #{user.id}
                    </small>

                  </div>

                </div>



                <span>
                  {user.email}
                </span>



                <span>
                  {user.address ||
                    "—"}
                </span>



                <span
                  className={
                    `admin-user-role role-${user.role.toLowerCase()}`
                  }
                >
                  {user.role}
                </span>


              </div>

            )
          )}



          {filteredUsers.length === 0 && (

            <div className="admin-users-empty">
              No users found.
            </div>

          )}


        </section>


      </main>

    </div>

  );

}


export default AdminUsers;
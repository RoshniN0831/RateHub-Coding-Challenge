import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    averageRating: "0.0",
  });
  const [stores, setStores] = useState([]);


  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/stats",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch statistics"
        );
      }

      setStats(data);
    } catch (error) {
      console.error(
        "Failed to load admin statistics:",
        error
      );
    }
  };

  const fetchStores = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/stores",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch stores"
      );
    }

    setStores(data.stores || []);
  } catch (error) {
    console.error(
      "Failed to load stores:",
      error
    );
  }
};

  if (token) {
    fetchStats();
    fetchStores();
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <div className="admin-page">

      <nav className="admin-nav">

        <div className="admin-brand">
          <span className="brand-mark">R</span>
          <span>RateHub</span>
        </div>

        <div className="admin-nav-right">

          <div className="admin-user">
            <span>{user?.name || "Administrator"}</span>
            <small>ADMIN</small>
          </div>

          <button
            className="admin-logout"
            onClick={handleLogout}
          >
            Log out
          </button>

        </div>

      </nav>

      <main className="admin-content">

        <section className="admin-header">

          <div>
            <span className="eyebrow">
              ADMINISTRATION
            </span>

            <h1>
              Platform
              <span> overview.</span>
            </h1>

            <p>
              Manage RateHub users, stores, ratings, and
              platform activity from one place.
            </p>
          </div>

          <button className="admin-primary">
            Add store
            <span>+</span>
          </button>

        </section>

        <section className="admin-stats">

          <div className="admin-stat">
            <span>01</span>
            <strong>{stats.totalUsers}</strong>
            <p>Total users</p>
          </div>

          <div className="admin-stat">
            <span>02</span>
            <strong>{stats.totalStores}</strong>
            <p>Total stores</p>
          </div>

          <div className="admin-stat">
            <span>03</span>
            <strong>{stats.totalRatings}</strong>
            <p>Total ratings</p>
          </div>

          <div className="admin-stat">
            <span>04</span>
            <strong>{stats.averageRating}</strong>
            <p>Average rating</p>
          </div>

        </section>

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>
              <span className="eyebrow">
                PLATFORM DATA
              </span>

              <h2>Management.</h2>
            </div>

          </div>

          <div className="admin-grid">

            <article className="admin-card">

              <div className="admin-card-number">
                01
              </div>

              <h3>Users</h3>

              <p>
                View registered users and manage their
                platform access.
              </p>

              <Link
  to="/admin/users"
  className="admin-card-button"
>
  Manage users →
</Link>
            </article>

            <article className="admin-card">

              <div className="admin-card-number">
                02
              </div>

              <h3>Stores</h3>

              <p>
                Add stores, review store information,
                and monitor ratings.
              </p>

              <Link
  to="/admin/stores"
  className="admin-card-button"
>
  Manage stores →
</Link>

            </article>

            <article className="admin-card">

              <div className="admin-card-number">
                03
              </div>

              <h3>Ratings</h3>

              <p>
                Monitor platform ratings and review
                store performance.
              </p>

              <Link
  to="/admin/ratings"
  className="admin-card-button"
>
  View ratings →
</Link>

            </article>

          </div>

        </section>

        <section className="admin-recent">

          <div className="admin-section-heading">

            <div>
              <span className="eyebrow">
                RECENT ACTIVITY
              </span>

              <h2>Latest stores.</h2>
            </div>

          </div>

          <div className="admin-table">

            <div className="admin-table-head">
              <span>STORE</span>
              <span>LOCATION</span>
              <span>RATING</span>
              <span>STATUS</span>
            </div>

           {stores.map((store) => (
  <div
    className="admin-table-row"
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

    <span className="status-active">
      ACTIVE
    </span>

  </div>
))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;
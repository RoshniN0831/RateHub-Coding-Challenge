import "../App.css";

function Landing() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <span className="brand-mark">R</span>
          <span className="brand-name">RateHub</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <a href="/login" className="btn btn-ghost">
            Log in
          </a>

          <a href="/signup" className="btn btn-primary">
            Get started
          </a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-line"></span>
              TRUSTED STORE REVIEWS
            </div>

            <h1>
              Make every
              <span> rating count.</span>
            </h1>

            <p className="hero-description">
              Discover trusted stores, share honest experiences, and make
              smarter decisions with a rating platform built for clarity.
            </p>

            <div className="hero-actions">
              <a href="/login" className="btn btn-primary btn-large">
                Explore stores
                <span>→</span>
              </a>

              <a href="/signup" className="btn btn-outline btn-large">
                Create account
              </a>
            </div>

            <div className="hero-meta">
              <div>
                <strong>01</strong>
                <span>Discover</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Compare</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Rate</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>

            <div className="rating-card">
              <div className="card-top">
                <span className="card-label">STORE OVERVIEW</span>
                <span className="card-status">LIVE</span>
              </div>

              <div className="store-name">The Metropolitan</div>

              <div className="store-location">
                Pune, Maharashtra
              </div>

              <div className="rating-main">
                <strong>4.8</strong>

                <div className="rating-details">
                  <div className="stars">★★★★★</div>
                  <span>Based on verified ratings</span>
                </div>
              </div>

              <div className="rating-bar">
                <span style={{ width: "88%" }}></span>
              </div>

              <div className="rating-footer">
                <span>Overall experience</span>
                <strong>Excellent</strong>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span className="floating-number">4.9</span>
              <span className="floating-label">Top rated</span>
            </div>

            <div className="floating-card floating-card-bottom">
              <span className="pulse-dot"></span>
              <span>Trusted reviews</span>
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>01</strong>
            <span>Simple discovery</span>
          </div>

          <div>
            <strong>02</strong>
            <span>Transparent ratings</span>
          </div>

          <div>
            <strong>03</strong>
            <span>Secure accounts</span>
          </div>

          <div>
            <strong>04</strong>
            <span>Role-based access</span>
          </div>
        </section>

        <section id="features" className="feature-section">
          <div className="section-heading">
            <span className="eyebrow">
              BUILT FOR BETTER DECISIONS
            </span>

            <h2>
              Everything you need to
              <span> rate with confidence.</span>
            </h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card feature-card-large">
              <span className="feature-number">01</span>

              <h3>Discover trusted stores</h3>

              <p>
                Browse stores and compare ratings before deciding where to
                spend your time and money.
              </p>

              <div className="feature-line"></div>
            </article>

            <article className="feature-card">
              <span className="feature-number">02</span>

              <h3>Real user ratings</h3>

              <p>
                Share your experience through a simple five-point rating
                system.
              </p>
            </article>

            <article className="feature-card">
              <span className="feature-number">03</span>

              <h3>Secure access</h3>

              <p>
                Authentication and role-based permissions keep the platform
                controlled and reliable.
              </p>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="process-section">
          <div className="process-heading">
            <span className="eyebrow">HOW RATEHUB WORKS</span>

            <h2>A better way to choose.</h2>
          </div>

          <div className="process-list">
            <div className="process-item">
              <span>01</span>

              <div>
                <h3>Find</h3>
                <p>
                  Search and explore stores that match what you need.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>02</span>

              <div>
                <h3>Evaluate</h3>
                <p>
                  Use ratings and store information to compare options.
                </p>
              </div>
            </div>

            <div className="process-item">
              <span>03</span>

              <div>
                <h3>Share</h3>
                <p>
                  Leave an honest rating and help the next customer.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="cta-section">
          <div>
            <span className="eyebrow">RATEHUB</span>

            <h2>
              Your experience
              <span> has value.</span>
            </h2>
          </div>

          <a href="/signup" className="btn btn-primary btn-large">
            Get started
            <span>→</span>
          </a>
        </section>
      </main>

      <footer>
        <div className="brand">
          <span className="brand-mark">R</span>
          <span className="brand-name">RateHub</span>
        </div>

        <span>Store ratings, made clearer.</span>

        <span>© 2026 RateHub</span>
      </footer>
    </div>
  );
}

export default Landing;
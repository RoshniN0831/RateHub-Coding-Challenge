const pool = require("../config/db");


// =====================================================
// SUBMIT RATING
// =====================================================

const submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || rating === undefined) {
      return res.status(400).json({
        message: "Store ID and rating are required",
      });
    }

    if (
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(Number(rating))
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    const [store] = await pool.query(
      "SELECT id FROM stores WHERE id = ?",
      [store_id]
    );

    if (store.length === 0) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const [existingRating] = await pool.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [user_id, store_id]
    );

    if (existingRating.length > 0) {
      return res.status(409).json({
        message: "You have already rated this store",
      });
    }

    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES (?, ?, ?)`,
      [user_id, store_id, Number(rating)]
    );

    res.status(201).json({
      message: "Rating submitted successfully",
    });

  } catch (error) {
    console.error(
      "Submit rating error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while submitting rating",
    });
  }
};


// =====================================================
// UPDATE RATING
// =====================================================

const updateRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || rating === undefined) {
      return res.status(400).json({
        message: "Store ID and rating are required",
      });
    }

    if (
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(Number(rating))
    ) {
      return res.status(400).json({
        message:
          "Rating must be an integer between 1 and 5",
      });
    }

    const [result] = await pool.query(
      `UPDATE ratings
       SET rating = ?
       WHERE user_id = ? AND store_id = ?`,
      [
        Number(rating),
        user_id,
        store_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Rating not found",
      });
    }

    res.json({
      message: "Rating updated successfully",
    });

  } catch (error) {
    console.error(
      "Update rating error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating rating",
    });
  }
};


// =====================================================
// GET OWNER RATINGS
// =====================================================

const getOwnerRatings = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const [ratings] = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.user_id,
        u.name AS user_name,
        s.name AS store_name
      FROM ratings r
      INNER JOIN users u
        ON r.user_id = u.id
      INNER JOIN stores s
        ON r.store_id = s.id
      WHERE s.owner_id = ?
      ORDER BY r.id DESC
      `,
      [owner_id]
    );

    res.json({
      success: true,
      ratings,
    });

  } catch (error) {
    console.error(
      "Get owner ratings error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching owner ratings",
    });
  }
};


// =====================================================
// GET CURRENT USER'S RATING FOR A STORE
// =====================================================

const getMyRating = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { storeId } = req.params;

    const [ratings] = await pool.query(
      `
      SELECT
        id,
        rating
      FROM ratings
      WHERE user_id = ?
        AND store_id = ?
      LIMIT 1
      `,
      [
        user_id,
        storeId,
      ]
    );

    if (ratings.length === 0) {
      return res.json({
        rated: false,
        rating: null,
      });
    }

    res.json({
      rated: true,
      rating: ratings[0].rating,
    });

  } catch (error) {
    console.error(
      "Get my rating error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching your rating",
    });
  }
};


// =====================================================
// GET CURRENT USER'S DASHBOARD STATISTICS
// =====================================================

const getMyStats = async (req, res) => {
  try {
    const user_id = req.user.id;


    // -----------------------------------------
    // TOTAL RATINGS GIVEN BY THIS USER
    // -----------------------------------------

    const [ratingRows] = await pool.query(
      `
      SELECT COUNT(*) AS totalRatings
      FROM ratings
      WHERE user_id = ?
      `,
      [user_id]
    );


    // -----------------------------------------
    // DISTINCT STORES RATED BY THIS USER
    // -----------------------------------------

    const [storeRows] = await pool.query(
      `
      SELECT COUNT(DISTINCT store_id) AS storesExplored
      FROM ratings
      WHERE user_id = ?
      `,
      [user_id]
    );


    res.json({
      success: true,

      totalRatings:
        ratingRows[0].totalRatings,

      storesExplored:
        storeRows[0].storesExplored,
    });


  } catch (error) {

    console.error(
      "Get my stats error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching your statistics",
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  submitRating,
  updateRating,
  getOwnerRatings,
  getMyRating,
  getMyStats,
};
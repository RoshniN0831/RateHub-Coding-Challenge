const pool = require("../config/db");

const addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({
        message: "Name, email, address and owner are required",
      });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({
        message: "Store name must be between 20 and 60 characters",
      });
    }

    if (address.length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }

    const [owner] = await pool.query(
      "SELECT id, role FROM users WHERE id = ?",
      [owner_id]
    );

    if (owner.length === 0 || owner[0].role !== "STORE_OWNER") {
      return res.status(400).json({
        message: "Selected user is not a store owner",
      });
    }

    const [existingStore] = await pool.query(
      "SELECT id FROM stores WHERE email = ?",
      [email]
    );

    if (existingStore.length > 0) {
      return res.status(409).json({
        message: "Store email already exists",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, owner_id]
    );

    res.status(201).json({
      message: "Store created successfully",
      storeId: result.insertId,
    });
  } catch (error) {
    console.error("Add store error:", error);

    res.status(500).json({
      message: "Server error while creating store",
    });
  }
};


const getStores = async (req, res) => {
  try {
    const [stores] = await pool.query(`
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r
        ON s.id = r.store_id
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id
      ORDER BY s.name ASC
    `);

    res.json({
      success: true,
      stores,
    });
  } catch (error) {
    console.error("Get stores error:", error);

    res.status(500).json({
      message: "Server error while fetching stores",
    });
  }
};


const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const [stores] = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating
      FROM stores s
      LEFT JOIN ratings r
        ON s.id = r.store_id
      WHERE s.id = ?
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id
      `,
      [id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.json({
      success: true,
      store: stores[0],
    });
  } catch (error) {
    console.error("Get store by ID error:", error);

    res.status(500).json({
      message: "Server error while fetching store",
    });
  }
};
const getOwnerStore = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const [stores] = await pool.query(
      `
      SELECT
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id,
        COALESCE(ROUND(AVG(r.rating), 1), 0) AS rating,
        COUNT(r.id) AS total_ratings
      FROM stores s
      LEFT JOIN ratings r
        ON s.id = r.store_id
      WHERE s.owner_id = ?
      GROUP BY
        s.id,
        s.name,
        s.email,
        s.address,
        s.owner_id
      `,
      [owner_id]
    );

    if (stores.length === 0) {
      return res.status(404).json({
        message: "No store found for this owner",
      });
    }

    res.json({
      success: true,
      store: stores[0],
    });

  } catch (error) {
    console.error("Get owner store error:", error);

    res.status(500).json({
      message: "Server error while fetching owner store",
    });
  }
};

module.exports = {
  addStore,
  getStores,
  getStoreById,
  getOwnerStore,
};
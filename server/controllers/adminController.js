const pool = require("../config/db");
const bcrypt = require("bcryptjs");


// =====================================================
// ADMIN STATISTICS
// =====================================================

const getAdminStats = async (req, res) => {
  try {

    const [userRows] = await pool.query(
      "SELECT COUNT(*) AS totalUsers FROM users"
    );

    const [storeRows] = await pool.query(
      "SELECT COUNT(*) AS totalStores FROM stores"
    );

    const [ratingRows] = await pool.query(
      "SELECT COUNT(*) AS totalRatings, AVG(rating) AS averageRating FROM ratings"
    );

    res.json({
      totalUsers: userRows[0].totalUsers,
      totalStores: storeRows[0].totalStores,
      totalRatings: ratingRows[0].totalRatings,
      averageRating: Number(
        ratingRows[0].averageRating || 0
      ).toFixed(1),
    });

  } catch (error) {

    console.error(
      "Admin stats error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching admin statistics",
    });

  }
};


// =====================================================
// GET ALL USERS
// =====================================================

const getAdminUsers = async (req, res) => {
  try {

    const [users] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        address,
        role
      FROM users
      ORDER BY id DESC
      `
    );

    res.json({
      success: true,
      users,
    });

  } catch (error) {

    console.error(
      "Admin users error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching users",
    });

  }
};


// =====================================================
// ADD USER
// =====================================================

const addAdminUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      address,
      role,
    } = req.body;


    // -----------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !role
    ) {

      return res.status(400).json({
        message:
          "Name, email, password, address and role are required",
      });

    }


    // -----------------------------------------
    // NAME VALIDATION
    // -----------------------------------------

    if (
      name.length < 20 ||
      name.length > 60
    ) {

      return res.status(400).json({
        message:
          "Name must be between 20 and 60 characters",
      });

    }


    // -----------------------------------------
    // ADDRESS VALIDATION
    // -----------------------------------------

    if (address.length > 400) {

      return res.status(400).json({
        message:
          "Address cannot exceed 400 characters",
      });

    }


    // -----------------------------------------
    // EMAIL VALIDATION
    // -----------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

      return res.status(400).json({
        message:
          "Please enter a valid email address",
      });

    }


    // -----------------------------------------
    // PASSWORD VALIDATION
    // 8–16 chars
    // At least 1 uppercase
    // At least 1 special character
    // -----------------------------------------

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;


    if (!passwordRegex.test(password)) {

      return res.status(400).json({
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });

    }


    // -----------------------------------------
    // ROLE VALIDATION
    // -----------------------------------------

    const allowedRoles = [
      "USER",
      "ADMIN",
    ];


    if (!allowedRoles.includes(role)) {

      return res.status(400).json({
        message:
          "Role must be USER or ADMIN",
      });

    }


    // -----------------------------------------
    // CHECK DUPLICATE EMAIL
    // -----------------------------------------

    const [existingUser] =
      await pool.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );


    if (existingUser.length > 0) {

      return res.status(409).json({
        message:
          "Email already exists",
      });

    }


    // -----------------------------------------
    // HASH PASSWORD
    // -----------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // -----------------------------------------
    // INSERT USER
    // -----------------------------------------

    const [result] =
      await pool.query(
        `
        INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          name,
          email,
          hashedPassword,
          address,
          role,
        ]
      );


    res.status(201).json({

      success: true,

      message:
        "User created successfully",

      userId:
        result.insertId,

    });


  } catch (error) {

    console.error(
      "Add admin user error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while creating user",
    });

  }
};


// =====================================================
// GET ALL RATINGS
// =====================================================

const getAdminRatings = async (req, res) => {

  try {

    const [ratings] = await pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.user_id,
        u.name AS user_name,
        s.name AS store_name
      FROM ratings r
      JOIN users u
        ON r.user_id = u.id
      JOIN stores s
        ON r.store_id = s.id
      ORDER BY r.id DESC
      `
    );

    res.json({
      success: true,
      ratings,
    });

  } catch (error) {

    console.error(
      "Admin ratings error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching ratings",
    });

  }

};


module.exports = {
  getAdminStats,
  getAdminUsers,
  addAdminUser,
  getAdminRatings,
};
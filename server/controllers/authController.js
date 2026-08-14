const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


// =====================================================
// SIGNUP
// =====================================================

const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }

    if (address.length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.status(400).json({
        message: "Password must be between 8 and 16 characters",
      });
    }

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter and one special character",
      });
    }

    const [existingUser] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
       (name, email, password, address, role)
       VALUES (?, ?, ?, ?, 'USER')`,
      [
        name,
        email,
        hashedPassword,
        address,
      ]
    );

    res.status(201).json({
      message: "Account created successfully",
      userId: result.insertId,
    });

  } catch (error) {

    console.error(
      "Signup error:",
      error
    );

    res.status(500).json({
      message: "Server error during signup",
    });

  }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }


    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );


    if (users.length === 0) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    const user = users[0];


    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }


    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );


    res.json({

      message:
        "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      message:
        "Server error during login",
    });

  }
};


// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;


    // -----------------------------------------
    // REQUIRED FIELDS
    // -----------------------------------------

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {

      return res.status(400).json({
        message:
          "All password fields are required",
      });

    }


    // -----------------------------------------
    // CONFIRM PASSWORD
    // -----------------------------------------

    if (
      newPassword !== confirmPassword
    ) {

      return res.status(400).json({
        message:
          "New passwords do not match",
      });

    }


    // -----------------------------------------
    // PASSWORD LENGTH
    // -----------------------------------------

    if (
      newPassword.length < 8 ||
      newPassword.length > 16
    ) {

      return res.status(400).json({
        message:
          "Password must be between 8 and 16 characters",
      });

    }


    // -----------------------------------------
    // PASSWORD REQUIREMENTS
    // -----------------------------------------

    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;


    if (
      !passwordPattern.test(
        newPassword
      )
    ) {

      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter and one special character",
      });

    }


    // -----------------------------------------
    // GET CURRENT PASSWORD
    // -----------------------------------------

    const [users] =
      await pool.query(
        "SELECT password FROM users WHERE id = ?",
        [userId]
      );


    if (users.length === 0) {

      return res.status(404).json({
        message:
          "User not found",
      });

    }


    // -----------------------------------------
    // VERIFY CURRENT PASSWORD
    // -----------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        users[0].password
      );


    if (!passwordMatch) {

      return res.status(401).json({
        message:
          "Current password is incorrect",
      });

    }


    // -----------------------------------------
    // HASH NEW PASSWORD
    // -----------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    // -----------------------------------------
    // UPDATE PASSWORD
    // -----------------------------------------

    await pool.query(
      `UPDATE users
       SET password = ?
       WHERE id = ?`,
      [
        hashedPassword,
        userId,
      ]
    );


    res.json({
      message:
        "Password changed successfully",
    });


  } catch (error) {

    console.error(
      "Change password error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while changing password",
    });

  }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  signup,
  login,
  changePassword,
};
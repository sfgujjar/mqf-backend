const User = require('../models/user.js');
const bcrypt = require('bcrypt');

// ✅ SIGNUP FUNCTION
const signup = async (req, res) => {
  try {
    console.log("Singup request body:", req.body);
    const { name, username, whatsapp, email, password, confirmPassword, referralCode } = req.body;

    // 🔍 Validation
    if (!name || !username || !whatsapp || !gmail || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and Confirm Password do not match' });
    }

    // 🔍 Duplicate checks
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ success: false, message: 'Username already taken' });

    const existingWhatsapp = await User.findOne({ whatsapp });
    if (existingWhatsapp) return res.status(400).json({ success: false, message: 'WhatsApp number already used' });

    const existingGmail = await User.findOne({ gmail });
    if (existingGmail) return res.status(400).json({ success: false, message: 'Gmail already registered' });

    // 🔗 Referral chain logic
    let referralChain = [];
    if (referralCode) {
      const referrer = await User.findOne({ username: referralCode });
      if (!referrer) {
        return res.status(400).json({ success: false, message: 'Referral code not found' });
      }

      referralChain = [referrer.username, ...(referrer.referralChain || [])].slice(0, 4); // max 5 total
    }

    // 🔐 Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      name,
      username,
      whatsapp,
      gmail,
      password: hashedPassword,
      referralCode: referralCode || null,
      referralChain,
      balance: 0,
      totalEarning: 0,
      totalWithdrawal: 0,
      teamEarning: 0
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User signed up successfully',
      data: {
        username,
        referredBy: referralCode || 'None',
        referralChain
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// ✅ LOGIN FUNCTION
const login = async (req, res) => {
  try {
    console.log("login request body:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both username and password' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        username: user.username,
        gmail: user.gmail,
        whatsapp: user.whatsapp,
        referralChain: user.referralChain
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ✅ DASHBOARD FUNCTION
const getDashboard = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let chainCounts = [0, 0, 0, 0, 0];
    const allUsers = await User.find({ referralChain: username });

    allUsers.forEach(u => {
      const index = u.referralChain.indexOf(username);
      if (index >= 0 && index < 5) {
        chainCounts[index]++;
      }
    });

    res.status(200).json({
      success: true,
      username: user.username,
      balance: user.balance,
      totalEarning: user.totalEarning,
      totalWithdrawal: user.totalWithdrawal,
      teamEarning: user.teamEarning,
      chainCounts: {
        first: chainCounts[0],
        second: chainCounts[1],
        third: chainCounts[2],
        fourth: chainCounts[3],
        fifth: chainCounts[4]
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error during dashboard fetch' });
  }
};

module.exports = { signup, login, getDashboard };

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password format
 * Password must be at least 8 characters long and contain at least one number and one letter
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password is valid, false otherwise
 */
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

module.exports = {
  validateEmail,
  validatePassword
}; 
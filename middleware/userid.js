const generateUserId = () => {
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return randomString;
}

module.exports = { generateUserId };
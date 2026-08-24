import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // This creates a secure token using the secret key from your .env file
  // It embeds the user's ID inside the token and expires in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
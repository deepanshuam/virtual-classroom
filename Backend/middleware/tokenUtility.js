import jwt from 'jsonwebtoken';

export const generateAccessAndRefereshTokens = async (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

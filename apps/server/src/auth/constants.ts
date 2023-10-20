export const jwtConstants = {
  secret: process.env.AUTH_SECRET,
  expiresIn: 60 * 60 * 24, // 1 day
};

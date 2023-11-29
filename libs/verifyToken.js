const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const prisma = require('./prisma');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
      err: 'No token provided',
      data: null,
    });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
        err: err.message,
        data: null,
      });
    }

    req.user = await prisma.admin.findUnique({
      where: {
        id: decoded.id,
      },
    });
    next();
  });
};

module.exports = verifyToken;
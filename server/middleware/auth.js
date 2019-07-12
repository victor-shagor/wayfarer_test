/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';


const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'Access Denied, Token is not provided',
      });
    }
    jwt.verify(token, process.env.SECRET, (error) => {
      if (error) {
        return res.status(400).send({
          status: 400,
          error: 'Access Denied, The Token provided is invalid',
        });
      }
      return next();
    });
  },
  verifyAdmin(req, res, next) {
    const token = req.headers['token'];
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'Access Denied, Token is not provided',
      });
    }
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (error) {
        return res.status(400).send({
          status: 400,
          error: 'Access Denied, The Token provided is invalid',
        });
      }
      if (decoded.is_admin !== true) {
        return res.status(403).send({
          status: 403,
          error: 'Only Admin can access this route',
        });
      }
      return next();
    });
  },
};

export default Auth;

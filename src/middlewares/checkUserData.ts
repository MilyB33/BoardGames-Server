import { Request, Response, NextFunction } from 'express';

const checkUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Please provide username and password',
    });
  }

  next();
};

export default checkUserData;

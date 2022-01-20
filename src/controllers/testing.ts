import { Request, Response } from 'express';
import errorHelper from '../utils/errorHelper';

import testingDB from '../db/testingDB';

const testing = async (req: Request, res: Response) =>
  errorHelper(req, res, 'Something went wrong', async () => {
    const result = await testingDB(req.body);

    res.status(200).send({ message: 'Success', result });
  });

export default {
  testing,
};

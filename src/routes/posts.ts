import { Router } from 'express';

const router = Router();

import authenticate from '../middlewares/authenticate';

const posts = [
  {
    id: 1,
    title: 'Post 1',
    content: 'Content 1',
    username: 'test',
  },
  {
    id: 2,
    title: 'Post 2',
    content: 'Content 2',
    username: 'test',
  },
  {
    id: 3,
    title: 'Post 3',
    content: 'Content 3',
    username: 'test1',
  },
];

router.get('/posts', authenticate, (req, res) => {
  console.log(req.user);
  res.json(
    posts.filter((post) => post.username === req.user.username)
  );
});

export = router;

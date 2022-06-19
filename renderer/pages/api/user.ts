import type { NextApiRequest, NextApiResponse } from 'next'
import tr from 'googletrans';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.query;
  console.log(message);
  const result = await tr(message, {
    to: 'ko'
  })
  res.status(200).json({ result })
}
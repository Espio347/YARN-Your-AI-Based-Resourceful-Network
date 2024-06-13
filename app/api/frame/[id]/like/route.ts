// pages/api/frame/[frameId]/like.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '../../../../../lib/mongoose';
import Frame from '../../../../../lib/models/frame.model';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { frameId } = req.query;
  const { userId } = req.body;

  await connectToDB();

  try {
    const frame = await Frame.findById(frameId);

    if (!frame) {
      return res.status(404).json({ message: 'Frame not found' });
    }

    switch (method) {
      case 'POST':
        if (!frame.likes.includes(userId)) {
          frame.likes.push(userId);
          frame.likeCount += 1;
          await frame.save();
          return res.status(200).json({ message: 'Liked successfully' });
        } else {
          return res.status(400).json({ message: 'Already liked' });
        }
      case 'DELETE':
        const index = frame.likes.indexOf(userId);
        if (index !== -1) {
          frame.likes.splice(index, 1);
          frame.likeCount -= 1;
          await frame.save();
          return res.status(200).json({ message: 'Unliked successfully' });
        } else {
          return res.status(400).json({ message: 'Not liked yet' });
        }
      default:
        res.setHeader('Allow', ['POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error liking/unliking frame:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

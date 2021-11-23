import { Router } from 'express';
import { Db } from 'mongodb';
import { LoginTokenInfo, Message } from '../../interfaces';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo

    if(loginTokenInfo) {
      const userId = loginTokenInfo.userId;
      const roomCollection = db.collection('room');
      const messageCollection = db.collection('message');

      const rooms = await roomCollection.find({
        userIds: {
          '$in' : [ userId ]
        }
      }).sort({lastInteractAt: -1}).toArray();

      const promises = [];

      rooms.forEach(( value ) => 
        promises.push(
          messageCollection
          .find({ roomId: value._id })
          .sort({ createdAt: -1 })
          .toArray()
        )
      );
      
      const messages = await Promise.all(promises);

      res.status(200).send({
        message: 'Fetch rooms success',
        content: {
          rooms: rooms.map((value, index) => {
            const currentMessages: Message[] = messages[index];
            let lastMessageBody = '';
            if(currentMessages.length) {
              lastMessageBody = `${currentMessages[0].messageBody.substring(0, 100)}...`;
            }

            return {
              ...value,
              lastMessageBody,
              messages: messages[index],
            };
          }),
        }
      })
    }

  } catch(error) {
    console.log(error)
    res.status(500).send();
  }

  next();
})

export default router;

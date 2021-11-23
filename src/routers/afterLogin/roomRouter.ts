import { Router } from 'express';
import { Db } from 'mongodb';
import { ChatRoom, LoginTokenInfo, Message } from '../../interfaces';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo

    if(loginTokenInfo) {
      const userId = loginTokenInfo.userId;
      const roomCollection = db.collection('room');
      const messageCollection = db.collection('message');
      const userCollection = db.collection('user');

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
      const roomsOutput = await Promise.all(rooms.map(async (room: ChatRoom, index) => {
        const currentMessages: Message[] = messages[index];
        const secondUserId = room.userIds.filter((value) => !value.equals(userId))[0]
        const secondUser = await userCollection.findOne({_id: secondUserId});

        return {
          roomName: secondUser.name,
          roomImage: secondUser.imageUrl,
          ...room,
          messages: currentMessages.map((message) => ({
            ...message,
            isOwner: message.senderUserId.equals(userId)
          })),
        };
      }));

      res.status(200).send({
        message: 'Fetch rooms success',
        content: {
          rooms: roomsOutput,
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

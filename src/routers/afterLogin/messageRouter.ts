import { Router } from 'express';
import { Db, ObjectId } from 'mongodb';
import { CreateMessageBody, CreateMessageBody2, LoginTokenInfo, Message } from '../../interfaces';

const router = Router()

router.post('/create/new', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    const { body } = req;
    const { recipientEmail, messageBody }: CreateMessageBody = body
    
    if(loginTokenInfo) {
      const userCollection = db.collection('user');
      const roomCollection = db.collection('room');
      const messageCollection = db.collection('message');
      const recipientUser = await userCollection.findOne({ email: recipientEmail })

      if(recipientUser) {
        const senderUserId = loginTokenInfo.userId;
        const recipientUserId = recipientUser._id;
        const userIds = [senderUserId, recipientUserId]
        let room = await roomCollection.findOne({
          userIds: {
            '$all' : userIds,
          }
        });
        const now = (new Date()).getTime();

        // if room doesn't exist create one
        if(!room) {
          room = {
            _id: new ObjectId(),
            userIds,
            lastInteractAt: now,
            createdAt: now,
            updatedAt: now
          }
          await roomCollection.insertOne(room);
        
        // if room exists update lastInteractAt
        } else {
          await roomCollection.updateOne({
            _id: room._id,
          }, {
            '$set' : {
              lastInteractAt: now,
            }
          })
        }

        const roomId = room._id;

        await messageCollection.insertOne({
          roomId,
          senderUserId,
          messageBody,
          createdAt: now,
          updatedAt: now,
        });

        const messages = await messageCollection.find({ roomId }).sort({"createdAt": -1}).toArray();

        res.status(200).send({
          message: 'Create message success',
          content: {
            roomName: recipientUser.name,
            roomImage: recipientUser.imageUrl,
            ...room,
            messages: messages.map((message: Message) => ({
              ...message,
              isOwner: message.senderUserId.equals(senderUserId),
            })),
          }
        });
      } else {
        res.status(404).send({ message: 'Recipient user with email not found' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }

  next();
});

router.post('/create', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const roomCollection = db.collection('room');
    const messageCollection = db.collection('message');
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    const { body } = req;
    const { roomId, messageBody }: CreateMessageBody2 = body;

    if(loginTokenInfo) {
      const userId = loginTokenInfo.userId;

      if(ObjectId.isValid(roomId)) {
        const roomObjectId = new ObjectId(roomId);
        const room = await roomCollection.findOne({_id: roomObjectId});
  
        if(room) {
          const now = (new Date()).getTime();

          await roomCollection.updateOne({
            _id: roomId
          }, {
            '$set': {
              lastInteractAt: now,
            }
          });

          const newMessage: Message = {
            _id: new ObjectId(),
            senderUserId: userId,
            roomId,
            messageBody,
            createdAt: now,
            updatedAt: now,
          };

          await messageCollection.insertOne(newMessage);
          res.status(200).send({
            message: 'Message sent successfully',
            content: {
              message: newMessage,
            },
          })
        } else {
          res.status(404).send({
            message: 'Room not found'
          })
        }
      } else {
        res.status(400).send({
          message: 'Invalid roomId'
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

  next();
});

export default router;

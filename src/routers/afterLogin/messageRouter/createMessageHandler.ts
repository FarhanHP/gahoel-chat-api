import { Handler } from 'express';
import { Db } from 'mongodb';
import { CreateMessageBody2, LoginTokenInfo, Message } from '../../../interfaces';
import { ObjectId } from 'bson';
import { sendMessageToTopic } from '../../../utils/firebaseAdmin';

const createMessageHandler: Handler = async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const roomCollection = db.collection('room');
    const userCollection = db.collection('user');
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

          const [ user ] = await Promise.all([
            userCollection.findOne({
              _id: userId
            }),
            roomCollection.updateOne({
              _id: roomObjectId
            }, {
              '$set': {
                lastInteractAt: now,
              }
            })
          ]);

          const newMessage: Message = {
            _id: new ObjectId(),
            senderUserId: userId,
            roomId: roomObjectId,
            messageBody,
            createdAt: now,
            updatedAt: now,
          };

          await Promise.all([
            messageCollection.insertOne(newMessage),
            sendMessageToTopic({
              topicName: roomId,
              messageId: newMessage._id,
              messageBody: messageBody,
              senderUserId: userId,
              roomId: roomObjectId,
              createdAt: newMessage.createdAt,
              notificationTitle: user.name,
            })
          ])

          res.status(200).send({
            message: 'Message sent successfully',
            content: {
              message: {
                ...newMessage,
                isOwner: true,
              },
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
};

export default createMessageHandler;

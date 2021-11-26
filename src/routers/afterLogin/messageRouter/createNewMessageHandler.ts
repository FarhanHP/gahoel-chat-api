import { Handler } from 'express';
import { Db } from 'mongodb';
import { CreateMessageBody, LoginTokenInfo, Message } from '../../../interfaces';
import { ObjectId } from 'bson';
import { sendMessageToTopic, sendRoomToFirebaseRegistrationToken, subscribeToTopic } from '../../../utils/firebaseAdmin';

const createNewMessageHandler: Handler = async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    const { body } = req;
    const { recipientEmail, messageBody }: CreateMessageBody = body
    
    if(loginTokenInfo) {
      const userCollection = db.collection('user');
      const roomCollection = db.collection('room');
      const messageCollection = db.collection('message');
      const loginTokenCollection = db.collection('login_token')
      const senderUserId = loginTokenInfo.userId;
      const [recipientUser, senderUser] = await Promise.all([
        userCollection.findOne({ email: recipientEmail }),
        userCollection.findOne({ _id: senderUserId})
      ]);

      if(recipientUser) {
        if(!recipientUser._id.equals(senderUserId)) {
          const recipientUserId = recipientUser._id;
          const userIds = [senderUserId, recipientUserId]
          let room = await roomCollection.findOne({
            userIds: {
              '$all' : userIds,
            }
          });
          const now = (new Date()).getTime();
          let isNewRoom = false;

          // if room doesn't exist create one
          if(!room) {
            isNewRoom = true;
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

          const newMessage: Message = {
            _id: new ObjectId(),
            roomId,
            senderUserId,
            messageBody,
            createdAt: now,
            updatedAt: now,
          };
          
          // if new room, send notification to devices to add room
          if(isNewRoom) {
            // get all firebase registration tokens
            const firebaseRegisterTokens: string[] = (await loginTokenCollection.find({
              userId: {
                '$in' : [recipientUserId, senderUserId]
              }
            }).toArray()).map((value: LoginTokenInfo) => value.firebaseRegisterToken)

            await Promise.all([
              // send notifications
              ...(firebaseRegisterTokens.map(
                (frt) => sendRoomToFirebaseRegistrationToken({
                  registrationToken: frt,
                  senderUserName: senderUser.name,
                  senderUserId,
                  senderImage: senderUser.imageUrl,
                  roomId,
                  lastInteractAt: room.lastInteractAt,
                  createdAt: room.createdAt,
                  updatedAt: room.updatedAt,
                  firstMessageBody: messageBody,
                  firstMessageId: newMessage._id,
                })
              )),
              
              // subscribe topics
              subscribeToTopic(roomId.toString(), firebaseRegisterTokens)
            ]);
            
          } else {
            await sendMessageToTopic({
              topicName: roomId.toString(),
              messageId: newMessage._id,
              messageBody: messageBody,
              senderUserId,
              roomId: roomId,
              createdAt: newMessage.createdAt,
              notificationTitle: senderUser.name,
            })
          }

          await messageCollection.insertOne(newMessage);
          const messages = await messageCollection.find({ roomId }).sort({"createdAt": -1}).toArray()

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
          res.status(401).send({ message: 'Cannot send message to yourself' })
        }
      } else {
        res.status(404).send({ message: 'Recipient user with email not found' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }

  next();
};

export default createNewMessageHandler;

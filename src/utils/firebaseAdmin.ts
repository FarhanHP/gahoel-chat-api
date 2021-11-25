import admin, { messaging, ServiceAccount } from 'firebase-admin';
import { ObjectID } from 'bson';
import serviceAccount from '../../gahoel-chat-firebase-adminsdk-cwqaq-1314454b27.json';

interface SendeMessageToTopicArgs {
  topicName: string,
  messageId: ObjectID,
  messageBody: string,
  senderUserId: ObjectID,
  roomId: ObjectID,
  createdAt: number,
  notificationTitle: string, 
}

export const initializeFirebaseAdmin = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  });  
}

export const subscribeToTopic = async (topicName: string, registerTokens: string[]) => {
  const res = await messaging().subscribeToTopic(registerTokens, topicName);
  console.log({
    subscribeToTopicRes: res,
  });
};

export const unsubscribeToTopic = async (topicName: string, registerTokens: string[]) => {
  const res = await messaging().subscribeToTopic(registerTokens, topicName);
  console.log({
    unsubscribeToTopicRes: res,
  });
};

export const sendMessageToTopic = async ({
  topicName,
  messageId,
  messageBody,
  senderUserId,
  roomId,
  createdAt,
  notificationTitle, 
}: SendeMessageToTopicArgs) => {
  const message = {
    topic: topicName,
    data: {
      _id: messageId.toString(),
      messageBody,
      senderUserId: senderUserId.toString(),
      roomId: roomId.toString(),
      createdAt: createdAt.toString(),
    },
    notification: {
      title: notificationTitle,
      body: messageBody,
    }
  }

  const res = await messaging().send(message)
  console.log({
    sendMessageToTopicRes: res,
  });
}

import admin, { messaging, ServiceAccount } from 'firebase-admin';
import { ObjectId } from 'bson';
import serviceAccount from '../../gahoel-chat-firebase-adminsdk-cwqaq-1314454b27.json';
import { Message as FirebaseMessage } from 'firebase-admin/lib/messaging/messaging-api';

interface SendMessageToTopicArgs {
  topicName: string,
  messageId: ObjectId,
  messageBody: string,
  senderUserId: ObjectId,
  roomId: ObjectId,
  createdAt: number,
  notificationTitle: string, 
}

interface SendRoomToFirebaseRegistrationTokenArgs {
  registrationToken: string,
  senderUserName: string,
  senderUserId: ObjectId,
  senderImage: string,
  roomId: ObjectId,
  lastInteractAt: number,
  createdAt: number,
  updatedAt: number,
  firstMessageBody: string,
  firstMessageId: ObjectId,
}

export const initializeFirebaseAdmin = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  });  
};

export const subscribeToTopic = async (topicName: string, registerTokens: string[]) => {
  const res = await messaging().subscribeToTopic(registerTokens, topicName);
  console.log({
    subscribeToTopicRes: res,
  });
};

export const unsubscribeToTopic = async (topicName: string, registerTokens: string[]) => {
  const res = await messaging().unsubscribeFromTopic(registerTokens, topicName);
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
}: SendMessageToTopicArgs) => {
  const message: FirebaseMessage = {
    topic: topicName,
    data: {
      _id: messageId.toString(),
      type: 'message',
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
};

export const sendRoomToFirebaseRegistrationToken = async ({
  registrationToken,
  senderUserName,
  senderUserId,
  senderImage,
  roomId,
  lastInteractAt,
  createdAt,
  updatedAt,
  firstMessageBody,
  firstMessageId,
}: SendRoomToFirebaseRegistrationTokenArgs)  => {
  const message: FirebaseMessage = {
    token: registrationToken,
    data: {
      type: 'room',
      senderUserName,
      senderUserId: senderUserId.toString(),
      senderImage,
      _id: roomId.toString(),
      lastInteractAt: lastInteractAt.toString(),
      createdAt: createdAt.toString(),
      updatedAt: updatedAt.toString(),
      firstMessageBody,
      firstMessageId: firstMessageId.toString(),
    },
    notification: {
      title: senderUserName,
      body: firstMessageBody,
    },
  };

  const res = await messaging().send(message);
  console.log({
    sendRoomToFirebaseRegistrationTokenRes: res,
  })
}

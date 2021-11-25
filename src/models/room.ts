import { ObjectId } from 'bson';
import { Db, Sort } from 'mongodb';
import { ChatRoom } from '../interfaces';

const COLLECTION_NAME = 'room'

export const getRoomsByUserId = async (db: Db, userId: ObjectId, sort: Sort = {lastInteractAt: -1}): Promise<ChatRoom[]> => {
  const collection = db.collection(COLLECTION_NAME);
  const rooms = await collection.find({
    userIds: {
      '$in' : [userId]
    }
  }).sort(sort).toArray();

  return rooms.map((value) => ({
    _id: value._id,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    userIds: value.userIds,
    lastInteract: value.lastInteract
  }))
}
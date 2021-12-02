import { MongoClient } from 'mongodb';

const PASSWORD = 'c1FdLMKU98dcz0IT';
const USERNAME = 'farhanhp';
const DATABASE_NAME = 'gahoel-chat';
const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.y35vz.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`

export const connectClient = async () => {
  const client = new MongoClient(URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);

  return {
    db,
    closeClient: async ()=>{
      await client.close();
    }
  };
};

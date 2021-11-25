import { Router } from 'express';
import { Db } from 'mongodb';
import { LoginTokenInfo } from '../../interfaces';
import { getRoomsByUserId } from '../../models/room';
import { unsubscribeToTopic } from '../../utils/firebaseAdmin';

const router = Router()

router.get('/profile', async (req, res, next) => {
  try{
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    
    if(loginTokenInfo) {
      const userCollection = db.collection("user");
      const userId = loginTokenInfo.userId;

      const user = await userCollection.findOne({
        _id: userId
      });

      const { email, name, imageUrl } = user;

      res.status(200).send({
        message: 'Get profile success',
        content: {
          _id: userId,
          email,
          name,
          imageUrl
        }
      });
    }
  }
  catch(err){
    console.log(err);
    res.status(500).send();
  }

  next();
});

router.delete('/logout', async (req, res, next)=>{
  try{
    const db: Db = res.locals.db;
    const loginTokenCollection = db.collection('login_token');
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    const { userId, firebaseRegisterToken } = loginTokenInfo;

    const [rooms] = await Promise.all([
      getRoomsByUserId(db, userId),
      loginTokenCollection.deleteMany({
        token: loginTokenInfo.token
      })
    ]);

    await Promise.all(rooms.map(({_id}) => {
      unsubscribeToTopic(_id.toString(), [firebaseRegisterToken])
    }));

    res.status(200).send({
      message: 'Logout success'
    });
  }
  catch(err){
    console.log(err);
    res.status(500).send();
  }

  next();
});

export default router;

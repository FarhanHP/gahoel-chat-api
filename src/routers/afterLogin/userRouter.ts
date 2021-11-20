import { Router } from 'express';
import { Db } from 'mongodb';
import { LoginTokenInfo } from '../../interfaces';

const router = Router()

router.get('/profile', async (req, res, next) => {
  try{
    const db: Db = res.locals.db;
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;
    const userCollection = db.collection("user");
    const userId = loginTokenInfo.userId;

    const user = await userCollection.findOne({
      _id: userId
    });

    const { email, name, imageUrl } = user;

    res.status(200).send({
      email,
      name,
      imageUrl
    });
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
    const loginTokenInfo: LoginTokenInfo = res.locals.loginTokenInfo;

    await db.collection('login_token').deleteMany({
      token: loginTokenInfo.token
    })

    res.status(200).send();
  }
  catch(err){
    console.log(err);
    res.status(500).send();
  }

  next();
});
export default router;

import { Router } from 'express';
import { Db } from 'mongodb';
import userRouter from './userRouter';
import messageRouter from './messageRouter';
import roomRouter from './roomRouter';

const router = Router()

router.use(async (req, res, next)=>{
  try{
    const loginToken = req.headers["login_token"];
    const db: Db = res.locals.db;
    
    if(loginToken){
      const collection = db.collection("login_token");
      const loginTokenInfo = await collection.findOne({token: loginToken});

      if(loginTokenInfo){
        const now = (new Date()).getTime();

        if(loginTokenInfo.expiredAt >= now){
          res.locals.loginTokenInfo = loginTokenInfo;
          next();
          return;
        } else {
          // if expired delete the token
          collection.deleteOne({token: loginToken})
        }
      }
    }
    
    res.status(401).send();
  }
  catch(err){
    console.log(err);
    res.status(500).send();
  }

  next();
});

router.use('/room', roomRouter)
router.use('/message', messageRouter)
router.use('/user', userRouter);

export default router;

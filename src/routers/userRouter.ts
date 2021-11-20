import { Router } from 'express';
import { Db } from 'mongodb';
import { LoginBody, User } from '../interfaces';
import { generateToken, isValidEmail } from '../utils';
import { comparePassword, encryptPassword } from '../utils/password';

const LOGIN_TOKEN_EXPIRE = 1209600000; // login token will expire within 2 week (in ms)

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const collection = db.collection('user');
    const { body } = req;
    const { email, name, password }: User = body;

    const lowerEmail = email.toLowerCase();
    
    if(isValidEmail(lowerEmail)) {
      const isEmailExists = await collection.findOne({email: lowerEmail});

      if(!isEmailExists) {
        const now = (new Date()).getTime()

        const newUser: User = {
          email: lowerEmail,
          name,
          imageUrl: "",
          password: await encryptPassword(password),
          createdAt: now,
          updatedAt: now,
        };

        await collection.insertOne(newUser);
        res.status(200).send({
          message: 'Register success'
        });
      } else {
        res.status(401).send({
          message: 'Email Already Exists'
        })
      }
    } else {
      res.status(400).send({
        message: 'Invalid Email Format'
      })
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

  next();
});

router.post('/login', async (req, res, next) => {
  try {
    const db: Db = res.locals.db;
    const collection = db.collection('user');
    const loginTokenCollection = db.collection('login_token')
    const { body } = req;
    const { email, password, firebaseRegisterToken }: LoginBody = body;
    const lowerEmail = email.toLowerCase();
    const user = await collection.findOne({email: lowerEmail});

    if(user) {
      const hashPassword: string = user.password;
      const userId = user._id; 
      const same = await comparePassword(password, hashPassword);
      
      if(same) {
        if(firebaseRegisterToken) {
          const loginToken = generateToken();
          const now = (new Date()).getTime();
          await loginTokenCollection.insertOne({
            firebaseRegisterToken,
            userId,
            token: loginToken,
            createdAt: now,
            expiredAt: now + LOGIN_TOKEN_EXPIRE
          });

          res.status(200).send({
            message: 'Login success',
            content: {
              loginToken,
              user: {
                email: user.email,
                imageUrl: user.imageUrl,
                name: user.name,
              }
            }
          });
        } else {
          res.status(400).send({
            message: 'firebaseRegisterToken can\'t empty',
          })
        }
      } else {
        res.status(401).send({
          message: 'Wrong password',
        })
      }

    } else {
      res.status(404).send({
        message: 'User with email doesn\'t exists'
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).send();
  }

  next();
});

export default router;

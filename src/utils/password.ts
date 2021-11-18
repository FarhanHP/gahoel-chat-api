import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const encryptPassword = (plainPassword)=>{
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export const comparePassword = async (plainPassword, hashPassword): Promise<Boolean> =>{
  return bcrypt.compare(plainPassword, hashPassword)
}

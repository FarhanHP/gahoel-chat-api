import crypto from 'crypto';

export const isValidEmail = (email: string) => {
  // eslint-disable-next-line
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  const res = email.match(regex);

  return res !== null;
}

export const generateToken = () => crypto.randomBytes(20).toString("hex");

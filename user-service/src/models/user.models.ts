interface AuthUserI {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

interface DBUserI extends AuthUserI {
  _id: string;
  created_at: string;
  updated_at: string;
}

export { AuthUserI, DBUserI };

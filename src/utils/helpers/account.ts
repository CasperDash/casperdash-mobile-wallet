import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
} from 'casper-storage';

export const getRecoveryPhase = (numberOfWords: number) => {
  const keyManager = KeyFactory.getInstance();
  return keyManager.generate(numberOfWords);
};

export const createNewUser = (password: string): User => {
  const user = new User(password, {
    passwordOptions: {
      passwordValidator: () => new ValidationResult(true),
    },
  });

  return user;
};

export const createNewUserWithHdWallet = (
  password: string,
  recoveryPhase: string,
  encryptionType: EncryptionType,
) => {
  const user = createNewUser(password);
  user.setHDWallet(recoveryPhase, encryptionType);
  return user;
};

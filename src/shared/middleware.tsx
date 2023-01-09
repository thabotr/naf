export type ValidatorResultType = {
  isValid: boolean;
  reason?: string;
};
const isValidResult: ValidatorResultType = {isValid: true};
const notValidBecause = (reason: string): ValidatorResultType => ({
  isValid: false,
  reason: reason,
});
class Validator {
  static invalidHandleHelperText =
    "should be 'w/' followed by one or more alphanumeric characters, dash or underscore";
  static validateHandle(handle: string): ValidatorResultType {
    if (handle.match(/^w\/[a-zA-Z0-9-_]/)) {
      return isValidResult;
    }
    return notValidBecause(this.invalidHandleHelperText);
  }
  static invalidTokenHelperText = 'should be 8 or more characters';
  static validateToken(token: string): ValidatorResultType {
    if (token.length >= 8) {
      return isValidResult;
    }
    return notValidBecause(this.invalidTokenHelperText);
  }
}

class HelperText {
  static successfulRegistrationText = "You're now a citizen. Login!";
  static handleAlreadyTaken = 'handle already taken';
  static unknownError = 'an unknown error occured';
}

export {Validator, HelperText};

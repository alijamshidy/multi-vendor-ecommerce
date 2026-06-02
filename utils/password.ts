export const PASSWORD_MIN_LENGTH_LOGIN = 8;

export const PASSWORD_REQUIREMENTS = [
  { regex: /.{12,}/, text: "At least 12 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
] as const;

/** Login accepts any password meeting minimum length (no charset restriction). */
export function isLoginPasswordValid(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH_LOGIN;
}

/** Registration must satisfy all strength requirements shown in the UI. */
export function isRegistrationPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every(requirement =>
    requirement.regex.test(password),
  );
}

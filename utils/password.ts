export const PASSWORD_MIN_LENGTH_LOGIN = 8;

export const PASSWORD_REQUIREMENTS = [
  { regex: /.{12,}/, key: "minLength" },
  { regex: /[a-z]/, key: "lowercase" },
  { regex: /[A-Z]/, key: "uppercase" },
  { regex: /[0-9]/, key: "number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    key: "special",
  },
] as const;

export function isLoginPasswordValid(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH_LOGIN;
}

export function isRegistrationPasswordValid(password: string): boolean {
  return PASSWORD_REQUIREMENTS.every(requirement =>
    requirement.regex.test(password),
  );
}

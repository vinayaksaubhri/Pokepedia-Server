export function validateEmail(email: string) {
  let regex = /\S+@\S+\.\S+/;

  return regex.test(email);
}

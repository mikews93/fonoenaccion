/**
 * Check if string is IP
 * @param {string} IP
 * @returns
 */

export const isValidIPAddress = (IP: string) => {
  const regexExp =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;

  return regexExp.test(IP);
};

export const isValidHostname = (hostname: string) => {
  const regexExp = /^[A-Za-z-.0-9]*$/;
  return regexExp.test(hostname);
};

export const environment = {
  production: true,
  noLog: true,
  auth: {
    domain: "dev-6oz0raqocd60dluv.us.auth0.com",
    clientId: "IcxlcgRhxahI96ErFyXrJtZWZLVsaFo0",
    redirectUri: window.location.origin + '/auth',
  },
  encryption: {
    key: "MySecretKey1234"
  }
};

export default {
  ownerId: process.env.OWNER_ID ? Number(process.env.OWNER_ID) : null,

  whitelist: [
    123456789,
    987654321,
  ],

  blacklist: [
    111111111,
    222222222,
  ],

  prefix: "/",

  roles: {
    admins: [123456789],
    mods: [333333333, 444444444],
    users: [],
  },

  session: {
    enabled: true,
    storeFile: "./data/session.json",
  },

  options: {
    debug: false,
    logMessages: true,
  },
};

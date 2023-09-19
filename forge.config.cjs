module.exports = {
  rebuildConfig: {},
  packagerConfig: {
    name: "Financial Manager",
    icon: "./src/assets/icon",
    platform: "all",
    ignore: "./prisma/dev.db",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        noMsi: false,
        iconUrl:
          "https://s123.convertio.me/p/LpGmOat0UYRqvDhB8qE0bg/e5f822b67e7bce1291346cb9e3b76510/icon.ico",
        setupIcon: "./src/assets/icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};

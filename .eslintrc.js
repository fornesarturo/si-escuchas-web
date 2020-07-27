module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "@vue/standard",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "quotes": "off",
    "space-before-function-paren": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};

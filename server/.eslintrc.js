module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        node: true,
        es6: true
    },
    globals: {
        Promise: "readonly",
        NodeJS: "readonly",
        GIT_INFO: "readonly"
    },
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
        indent: 0,
        "no-extend-native": 0,
        semi: ["error", "always"],
        camelcase: 0,
        "no-undef": 1,
        "no-console": 0,
        "prefer-const": [
            "warn",
            {
                destructuring: "any",
                ignoreReadBeforeAssign: false
            }
        ],
        "@typescript-eslint/explicit-module-boundary-types": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-empty-function": 0
    }
};


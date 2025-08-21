export default [
    {
        files: ["*.js"],
        env: {
            browser: true,
            es2021: true,
            node: true,
        },
        languageOptions: {
            ecmaVersion: 12,
            sourceType: "module",
        },
        extends: ["eslint:recommended", "airbnb-base"],
        rules: {
            semi: ["error", "always"],
            quotes: ["error", "single"],
            "no-console": "warn",
            "import/extensions": ["error", "ignorePackages", { js: "never" }],
        },
    },
];

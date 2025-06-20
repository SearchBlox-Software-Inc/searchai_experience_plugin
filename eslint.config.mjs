import { fixupConfigRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
   "eslint:recommended",
   "plugin:react/recommended",
   "plugin:react/jsx-runtime",
   "plugin:react-hooks/recommended",
)), {
   plugins: {
      "react-refresh": reactRefresh,
   },

   languageOptions: {
      globals: {
         ...globals.browser,
         ...globals.amd,
         ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "module",
   },

   settings: {
      react: {
         version: "19.0",
      },
   },

   rules: {
      "no-console": ["warn", {
         allow: ["warn", "error"],
      }],

      "no-unused-vars": "warn",
      "react/prop-types": "warn",
      "react-refresh/only-export-components": "warn",
      "react-hooks/exhaustive-deps": "off",
      semi: [1, "always"],
   },
}];
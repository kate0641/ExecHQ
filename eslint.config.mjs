import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * Accessibility target is WCAG 2.2 AA (see CLAUDE.md).
 *
 * eslint-config-next already registers the jsx-a11y plugin with a partial rule
 * set, so the plugin is not re-declared here — only its full recommended rule
 * set is applied on top, plus a few rules it leaves off that this project wants.
 * `npm run lint` runs with --max-warnings=0, so everything here is an error.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/prefer-tag-over-role": "error",
      "jsx-a11y/control-has-associated-label": "error",
      "jsx-a11y/no-aria-hidden-on-focusable": "error",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

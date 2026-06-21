import remarkMdx from "remark-mdx";
import remarkValidateLinks from "remark-validate-links";

const plugins = [[remarkValidateLinks]];

if (process.env.REMARK_MDX === "1") {
  plugins.unshift(remarkMdx);
}

/** @type {import('unified').Settings} */
const config = {
  plugins,
};

export default config;

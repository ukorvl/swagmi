import type { Plugin } from "vite";

import MagicString from "magic-string";

type PrependEntryBannerPluginOptions = Readonly<{
  packageLicense: string;
  packageName: string;
  packageVersion: string;
}>;

const createLicenseBanner = (options: PrependEntryBannerPluginOptions): string => {
  return [
    "/**",
    ` * ${options.packageName} v${options.packageVersion}`,
    " *",
    ` * This source code is licensed under the ${options.packageLicense} license found in the`,
    " * LICENSE file in the root directory of this source tree.",
    " *",
    ` * @license ${options.packageLicense}`,
    " */",
  ].join("\n");
};

const prependEntryBannerPlugin = (options: PrependEntryBannerPluginOptions): Plugin => {
  const banner = createLicenseBanner(options);

  return {
    renderChunk: (code, chunk) => {
      if (!chunk.isEntry || code.startsWith(banner)) return null;

      const magicString = new MagicString(code);
      magicString.prepend(`${banner}\n`);

      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true,
        }),
      };
    },
    name: "prepend-entry-banner",
  };
};

export { prependEntryBannerPlugin };
export type { PrependEntryBannerPluginOptions };

/**
 * @param {string} srcPath
 * @param {string} tsconfigPath
 */
function makeModuleNameMapper(srcPath, tsconfigPath) {
  // Get paths from tsconfig
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { paths } = require(tsconfigPath).compilerOptions;

  const aliases = {};

  // Iterate over paths and convert them into moduleNameMapper format
  Object.keys(paths).forEach((item) => {
    const key = item.replace("/*", "/(.*)");
    const path = paths[item][0].replace("/*", "/$1");
    aliases[key] = srcPath + "/" + path;
  });
  return aliases;
}

const SRC_PATH = __dirname + "/src";
const TSCONFIG_PATH = __dirname + "/tsconfig.json";

module.exports = {
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["./src/app/**/*.(ts|js)", "./src/lib/Mail.ts"],
  coverageDirectory: "./__tests__/coverage",
  coverageReporters: ["json", "lcov"],
  moduleFileExtensions: ["js", "json", "ts", "node"],
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TSCONFIG_PATH),
  rootDir: __dirname,
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};

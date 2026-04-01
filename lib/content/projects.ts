// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

const context = require.context("../../content/projects", false, /\.md$/);

const projects: Record<string, string> = {};

context.keys().forEach((key: string) => {
  const fileName = key.replace("./", "");
  projects[fileName] = context(key).default || context(key);
});

export default projects;

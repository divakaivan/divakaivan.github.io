declare const require: any;

const context = require.context("../../content/posts/2024", false, /\.md$/);

const posts2024: Record<string, string> = {};

context.keys().forEach((key: string) => {
  const fileName = key.replace("./", "");
  posts2024[fileName] = context(key).default || context(key);
});

export default posts2024;
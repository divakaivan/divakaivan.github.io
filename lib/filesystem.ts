import whoami from "./content/whoami";
import posts2024 from "./content/posts2024";
import year2025 from "./content/year2025";
import projects from "./content/projects";

export type FileNode = {
  type: "file";
  content: string;
};

export type DirectoryNode = {
  type: "directory";
  children: Record<string, FileSystemNode>;
};

export type FileSystemNode = FileNode | DirectoryNode;

export const filesystem: DirectoryNode = {
  type: "directory",
  children: {
    whoami: { type: "file", content: whoami },
    "2024": {
      type: "directory",
      children: Object.fromEntries(
        Object.entries(posts2024).map(([name, content]) => [
          name,
          { type: "file", content } as FileNode,
        ])
      ),
    },
    "2025.md": { type: "file", content: year2025 },
    projects: {
      type: "directory",
      children: Object.fromEntries(
        Object.entries(projects).map(([name, content]) => [
          name,
          { type: "file", content } as FileNode,
        ])
      ),
    },
  },
};

/** Resolve a path string to a filesystem node, or null if not found. */
export function getNode(path: string): FileSystemNode | null {
  const parts = normalizePath(path).split("/").filter(Boolean);
  let current: FileSystemNode = filesystem;
  for (const part of parts) {
    if (current.type !== "directory") return null;
    const next: FileSystemNode | undefined = current.children[part];
    if (next === undefined) return null;
    current = next;
  }
  return current;
}

/** Resolve a (potentially relative) input path against the current directory. */
export function resolvePath(currentPath: string, inputPath: string): string {
  let resolved: string;
  if (inputPath === "~" || inputPath === "") {
    resolved = "/";
  } else if (inputPath.startsWith("~/")) {
    resolved = inputPath.slice(1); // strip the tilde, keep the leading slash
  } else if (inputPath.startsWith("/")) {
    resolved = inputPath;
  } else {
    const base = currentPath === "/" ? "" : currentPath;
    resolved = `${base}/${inputPath}`;
  }
  return normalizePath(resolved);
}

function normalizePath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === "..") {
      stack.pop();
    } else if (part !== ".") {
      stack.push(part);
    }
  }
  return "/" + stack.join("/");
}

/** Return the display path shown in the shell prompt. */
export function displayPath(path: string): string {
  return path === "/" ? "~" : "~" + path;
}

/** Return all names in a directory, or an empty array. */
export function listDirectory(
  path: string
): { name: string; isDir: boolean }[] {
  const node = getNode(path);
  if (!node || node.type !== "directory") return [];
  return Object.entries(node.children).map(([name, child]) => ({
    name,
    isDir: child.type === "directory",
  }));
}

import { getNode, resolvePath, listDirectory } from "./filesystem";

export type OutputEntry =
  | { type: "text"; content: string }
  | { type: "markdown"; content: string }
  | { type: "error"; content: string }
  | { type: "ls"; items: { name: string; isDir: boolean }[] }

export type CommandResult = {
  output: OutputEntry[];
  newPath?: string;
  lessContent?: { content: string; filename: string };
};

const HELP_TEXT = `Available commands:

  help          Show this help message
  ls [path]     List directory contents
  cat <file>    Display file contents (markdown rendered)
  less <file>   Page through a file  (q: quit, space/f: forward, b: back)
  cd <dir>      Change directory
  pwd           Print working directory
  whoami        Display personal information
  clear         Clear the terminal

Tips:
  • Use ↑ / ↓ arrow keys to navigate command history
  • Press Tab to autocomplete file and directory names
  • Try: whoami → ls projects/ → less projects/terminal-cv.md`;

const COMMANDS = ["help", "ls", "cat", "less", "cd", "pwd", "whoami", "clear"];

export function executeCommand(
  command: string,
  args: string[],
  currentPath: string
): CommandResult {
  switch (command) {
    case "":
      return { output: [] };

    case "help":
      return { output: [{ type: "text", content: HELP_TEXT }] };

    case "pwd":
      return { output: [{ type: "text", content: currentPath || "/" }] };

    case "whoami": {
      const node = getNode("/usr/bin/whoami");
      if (node && node.type === "file") {
        return { output: [{ type: "markdown", content: node.content }] };
      }
      return { output: [{ type: "error", content: "whoami: not found" }] };
    }

    case "ls": {
      const target = args[0]
        ? resolvePath(currentPath, args[0])
        : currentPath || "/";
      const node = getNode(target);

      if (!node) {
        return {
          output: [
            {
              type: "error",
              content: `ls: ${args[0]}: No such file or directory`,
            },
          ],
        };
      }

      if (node.type === "file") {
        // ls on a file just echoes its name
        const name = target.split("/").pop() ?? target;
        return {
          output: [{ type: "ls", items: [{ name, isDir: false }] }],
        };
      }

      const items = listDirectory(target);
      return { output: [{ type: "ls", items }] };
    }

    case "cat": {
      if (!args[0]) {
        return {
          output: [{ type: "error", content: "cat: missing file operand" }],
        };
      }

      const target = resolvePath(currentPath, args[0]);
      const node = getNode(target);

      if (!node) {
        return {
          output: [
            {
              type: "error",
              content: `cat: ${args[0]}: No such file or directory`,
            },
          ],
        };
      }

      if (node.type === "directory") {
        return {
          output: [
            { type: "error", content: `cat: ${args[0]}: Is a directory` },
          ],
        };
      }

      return { output: [{ type: "markdown", content: node.content }] };
    }

    case "less": {
      if (!args[0]) {
        return {
          output: [{ type: "error", content: "less: missing file operand" }],
        };
      }

      const target = resolvePath(currentPath, args[0]);
      const node = getNode(target);

      if (!node) {
        return {
          output: [
            {
              type: "error",
              content: `less: ${args[0]}: No such file or directory`,
            },
          ],
        };
      }

      if (node.type === "directory") {
        return {
          output: [
            { type: "error", content: `less: ${args[0]}: Is a directory` },
          ],
        };
      }

      const filename = args[0].split("/").pop() ?? args[0];
      return { output: [], lessContent: { content: node.content, filename } };
    }

    case "cd": {
      const target = !args[0] || args[0] === "~" ? "/" : resolvePath(currentPath, args[0]);
      const node = getNode(target);

      if (!node) {
        return {
          output: [
            {
              type: "error",
              content: `cd: ${args[0]}: No such file or directory`,
            },
          ],
        };
      }

      if (node.type === "file") {
        return {
          output: [
            { type: "error", content: `cd: ${args[0]}: Not a directory` },
          ],
        };
      }

      return { output: [], newPath: target };
    }

    default:
      return {
        output: [
          {
            type: "error",
            content: `${command}: command not found. Type 'help' for available commands.`,
          },
        ],
      };
  }
}

export function parseCommand(input: string): {
  command: string;
  args: string[];
} {
  const parts = input.trim().split(/\s+/);
  return { command: parts[0] ?? "", args: parts.slice(1) };
}

/** Return tab-completion candidates for the current input. */
export function getCompletions(
  input: string,
  currentPath: string
): string[] {
  const parts = input.split(/\s+/);

  // Completing the command name (first token, no space yet)
  if (parts.length === 1) {
    return COMMANDS.filter((cmd) => cmd.startsWith(parts[0]));
  }

  // Completing a path argument
  const partial = parts[parts.length - 1] ?? "";
  const lastSlash = partial.lastIndexOf("/");
  const dirPart = lastSlash >= 0 ? partial.slice(0, lastSlash + 1) : "";
  const namePart = lastSlash >= 0 ? partial.slice(lastSlash + 1) : partial;

  const dirPath = dirPart
    ? resolvePath(currentPath, dirPart)
    : currentPath || "/";

  const items = listDirectory(dirPath);
  const matches = items
    .filter((item) => item.name.startsWith(namePart))
    .map((item) => {
      const completedName = dirPart + item.name + (item.isDir ? "/" : "");
      return [...parts.slice(0, -1), completedName].join(" ");
    });

  return matches;
}

/** Find the longest common prefix among an array of strings. */
export function commonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}


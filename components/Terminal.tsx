"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  executeCommand,
  parseCommand,
  getCompletions,
  commonPrefix,
  type OutputEntry,
} from "@/lib/commands";
import { displayPath } from "@/lib/filesystem";
import MarkdownRenderer from "./MarkdownRenderer";

type HistoryItem = {
  id: number;
  command: string;
  path: string;
  outputs: OutputEntry[];
};

const WELCOME = `\
  _____                    _             _    ____ __     __
 |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |  / /  \\ \\   / /
   | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | | / /    \\ \\ / /
   | |  __/ |  | | | | | | | | | | (_| | |/ /      \\ V /
   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_/_/        \\_/

Welcome! Type 'help' for available commands or 'ls' to explore.`;

function getPrompt(path: string): string {
  return `visitor@terminal-cv:${displayPath(path)}$`;
}

export default function Terminal() {
  const [currentPath, setCurrentPath] = useState("/");
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    // Auto-run `ls` on first load to orient the user
    const result = executeCommand("ls", [], "/");
    return [{ id: 0, command: "ls", path: "/", outputs: result.output }];
  });
  const [cmdHistory, setCmdHistory] = useState<string[]>(["ls"]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [idCounter, setIdCounter] = useState(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep input focused on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const submitCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const { command, args } = parseCommand(trimmed);

      if (command === "clear") {
        setHistory([]);
        setInput("");
        setHistoryIndex(-1);
        return;
      }

      const result = executeCommand(command, args, currentPath);

      const newId = idCounter;
      setIdCounter((n) => n + 1);

      setHistory((prev) => [
        ...prev,
        { id: newId, command: trimmed, path: currentPath, outputs: result.output },
      ]);

      if (result.newPath !== undefined) {
        setCurrentPath(result.newPath);
      }

      if (trimmed) {
        setCmdHistory((prev) => [trimmed, ...prev.slice(0, 99)]);
      }
      setHistoryIndex(-1);
      setInput("");
    },
    [currentPath, idCounter]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        submitCommand(input);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(next);
        setInput(cmdHistory[next] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.max(historyIndex - 1, -1);
        setHistoryIndex(next);
        setInput(next === -1 ? "" : (cmdHistory[next] ?? ""));
      } else if (e.key === "Tab") {
        e.preventDefault();
        const completions = getCompletions(input, currentPath);
        if (completions.length === 0) return;
        if (completions.length === 1) {
          setInput(completions[0]);
        } else {
          const prefix = commonPrefix(completions);
          if (prefix.length > input.length) {
            setInput(prefix);
          } else {
            // Show all options inline
            const newId = idCounter;
            setIdCounter((n) => n + 1);
            setHistory((prev) => [
              ...prev,
              {
                id: newId,
                command: input,
                path: currentPath,
                outputs: [
                  {
                    type: "text",
                    content: completions
                      .map((c) => c.split(" ").pop() ?? c)
                      .join("   "),
                  },
                ],
              },
            ]);
          }
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setHistory([]);
        setHistoryIndex(-1);
      } else if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        const newId = idCounter;
        setIdCounter((n) => n + 1);
        setHistory((prev) => [
          ...prev,
          {
            id: newId,
            command: input + "^C",
            path: currentPath,
            outputs: [],
          },
        ]);
        setInput("");
        setHistoryIndex(-1);
      }
    },
    [input, historyIndex, cmdHistory, submitCommand, currentPath, idCounter]
  );

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-[#0d1117] text-green-400 font-mono text-sm cursor-text select-none"
      onClick={focusInput}
    >
      <div className="max-w-4xl mx-auto p-4 pb-2">
        {/* ASCII art + welcome */}
        <pre className="text-green-500 mb-4 text-xs leading-tight whitespace-pre overflow-x-auto">
          {WELCOME}
        </pre>

        {/* Command history */}
        {history.map((item) => (
          <div key={item.id} className="mb-1">
            {/* Prompt + typed command */}
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-green-500 shrink-0 select-none">
                {getPrompt(item.path)}
              </span>
              <span className="text-white select-text">{item.command}</span>
            </div>
            {/* Outputs */}
            {item.outputs.map((output, i) => (
              <OutputLine key={i} output={output} />
            ))}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-green-500 shrink-0 select-none">
            {getPrompt(currentPath)}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-white outline-none flex-1 min-w-0 caret-green-400 select-text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="terminal input"
          />
        </div>

        {/* Scroll anchor */}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}

function OutputLine({ output }: { output: OutputEntry }) {
  switch (output.type) {
    case "text":
      return (
        <pre className="text-green-300 pl-0 mt-1 mb-1 whitespace-pre-wrap font-mono text-sm select-text leading-relaxed">
          {output.content}
        </pre>
      );
    case "error":
      return (
        <div className="text-red-400 pl-0 mt-1 mb-1 select-text">
          {output.content}
        </div>
      );
    case "markdown":
      return (
        <div className="pl-0 mt-2 mb-3 select-text">
          <MarkdownRenderer content={output.content} />
        </div>
      );
    case "ls":
      return (
        <div className="mt-1 mb-1 flex flex-wrap gap-x-6 gap-y-1">
          {output.items.map((item) => (
            <span
              key={item.name}
              className={
                item.isDir
                  ? "text-blue-400 font-semibold"
                  : "text-white"
              }
            >
              {item.isDir ? item.name + "/" : item.name}
            </span>
          ))}
        </div>
      );
    default:
      return null;
  }
}

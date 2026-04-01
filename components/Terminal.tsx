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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type HistoryItem = {
  id: number;
  command: string;
  path: string;
  outputs: OutputEntry[];
};

type LessMode = {
  content: string;
  filename: string;
};

const WELCOME = `\
 ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ 
||M |||y |||T |||e |||r |||m |||i |||n |||a |||l ||
||__|||__|||__|||__|||__|||__|||__|||__|||__|||__||
|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|
                                                                  
Welcome! Type 'help' for available commands or 'ls' to explore.`;

function getPrompt(path: string): string {
  return `guest@ivan-pc:${displayPath(path)}$`;
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
  const [lessMode, setLessMode] = useState<LessMode | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lessScrollRef = useRef<HTMLDivElement>(null);

  // Keep input focused on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus the less container when less mode is active so key events work
  useEffect(() => {
    if (lessMode) {
      lessScrollRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [lessMode]);

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

      if (result.lessContent) {
        // Enter less pager mode — record the command in history with no output
        const newId = idCounter;
        setIdCounter((n) => n + 1);
        setHistory((prev) => [
          ...prev,
          { id: newId, command: trimmed, path: currentPath, outputs: [] },
        ]);
        if (trimmed) {
          setCmdHistory((prev) => [trimmed, ...prev.slice(0, 99)]);
        }
        setHistoryIndex(-1);
        setInput("");
        setLessMode(result.lessContent);
        return;
      }

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

  // Handle keyboard events inside the less pager
  const handleLessKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = lessScrollRef.current;
      if (!el) return;

      const pageSize = el.clientHeight * 0.9;

      switch (e.key) {
        case "q":
        case "Q":
          e.preventDefault();
          setLessMode(null);
          break;
        case " ":
        case "f":
        case "F":
        case "ArrowDown":
          e.preventDefault();
          el.scrollBy({ top: e.key === "ArrowDown" ? 40 : pageSize, behavior: "smooth" });
          break;
        case "b":
        case "B":
        case "ArrowUp":
          e.preventDefault();
          el.scrollBy({ top: e.key === "ArrowUp" ? -40 : -pageSize, behavior: "smooth" });
          break;
        case "Home":
          e.preventDefault();
          el.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "End":
          e.preventDefault();
          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
          break;
      }
    },
    []
  );

  const focusInput = () => {
    if (!lessMode && !window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto bg-[#0d1117] text-green-400 font-mono text-sm cursor-text"
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
              <span className="text-white">{item.command}</span>
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
            className="bg-transparent text-white outline-none flex-1 min-w-0 caret-green-400"
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

      {/* Less pager overlay */}
      {lessMode && (
        <div className="fixed inset-0 bg-[#0d1117] flex flex-col z-50">
          {/* Header bar */}
          <div className="flex items-center gap-4 px-4 py-1 bg-[#161b22] border-b border-gray-700 text-xs text-gray-400 shrink-0">
            <span className="text-yellow-400 font-semibold">{lessMode.filename}</span>
            <span className="ml-auto">q: quit  space/f: forward  b: back  ↑↓: scroll</span>
          </div>

          {/* Scrollable content */}
          <div
            ref={lessScrollRef}
            className="flex-1 overflow-y-auto px-6 py-4 outline-none"
            tabIndex={0}
            onKeyDown={handleLessKeyDown}
          >
            <div className="max-w-4xl mx-auto">
              <MarkdownRenderer content={lessMode.content} />
            </div>
          </div>

          {/* Status bar */}
          <div className="shrink-0 px-4 py-1 bg-[#161b22] border-t border-gray-700 text-xs text-gray-500">
            <span className="text-green-400">:</span>
            <span className="ml-2">Press <kbd className="bg-gray-700 text-gray-200 px-1 rounded">q</kbd> to quit</span>
          </div>
        </div>
      )}
    </div>
  );
}

function OutputLine({ output }: { output: OutputEntry }) {
  switch (output.type) {
    case "text":
      return (
        <pre className="text-green-300 pl-0 mt-1 mb-1 whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {output.content}
        </pre>
      );
    case "error":
      return (
        <div className="text-red-400 pl-0 mt-1 mb-1">
          {output.content}
        </div>
      );
    case "markdown":
      return (
        <div className="pl-0 mt-2 mb-3">
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


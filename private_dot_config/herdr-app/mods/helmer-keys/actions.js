export const PREFIX_BINDINGS = [
  ["c", "New named tab", "new-tab"],
  ["n", "Next tab", "tab.next"],
  ["p", "Previous tab", "tab.prev"],
  ["v", "Split right", "pane.split", { direction: "right" }],
  ["-", "Split down", "pane.split", { direction: "down" }],
  ["h", "Focus left", "pane.go", { direction: "left" }],
  ["j", "Focus down", "pane.go", { direction: "down" }],
  ["k", "Focus up", "pane.go", { direction: "up" }],
  ["l", "Focus right", "pane.go", { direction: "right" }],
  ["H", "Swap left", "pane.swap", { direction: "left" }],
  ["J", "Swap down", "pane.swap", { direction: "down" }],
  ["K", "Swap up", "pane.swap", { direction: "up" }],
  ["L", "Swap right", "pane.swap", { direction: "right" }],
  ["x", "Close pane (confirm)", "close-pane"],
  ["X", "Close tab (confirm)", "close-tab"],
  ["D", "Close space (confirm)", "close-space"],
  ["z", "Zoom pane", "pane.zoom"],
  ["w", "Workspace picker", "mod.open", { name: "picker" }],
  ["g", "Go to picker", "mod.open", { name: "picker" }],
  ["b", "Toggle sidebar", "layout.toggle", { id: "sidebar" }],
  ["q", "Close window, keep terminals", "window.close"],
  ["N", "New space", "space.new"],
  [",", "Rename tab", "tab.rename"],
  ["T", "Rename tab", "tab.rename"],
  ["W", "Rename space", "space.rename"],
  ["?", "All app shortcuts", "app.help"],
];

export function prefixAction(event) {
  if (event.modifiers?.control || event.modifiers?.platform || event.modifiers?.alt) return null;
  const key = event.key_char || (event.modifiers?.shift ? event.key.toUpperCase() : event.key);
  // Shifted number keys may arrive as their printed symbols instead of digits.
  const numberKey = /^[1-9]$/.test(event.key) ? event.key : key;
  const index = /^[1-9]$/.test(numberKey)
    ? Number(numberKey)
    : event.modifiers?.shift ? "!@#$%^&*(".indexOf(numberKey) + 1 : 0;
  if (index > 0) {
    return { command: event.modifiers?.shift ? "tab.select" : "agent", args: { index } };
  }
  const binding = PREFIX_BINDINGS.find(([shortcut]) => shortcut === key);
  return binding ? { command: binding[2], args: binding[3] ?? {} } : null;
}

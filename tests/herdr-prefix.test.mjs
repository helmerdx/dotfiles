import assert from "node:assert/strict";
import test from "node:test";
import { prefixAction } from "../private_dot_config/herdr-app/mods/helmer-keys/actions.js";

test("prefix then comma opens tab rename", () => {
  const action = prefixAction({ key: ",", key_char: ",", modifiers: {} });
  assert.deepEqual(action, { command: "tab.rename", args: {} });
});

test("prefix then Shift+T remains a tab rename shortcut", () => {
  const action = prefixAction({ key: "t", key_char: "T", modifiers: { shift: true } });
  assert.deepEqual(action, { command: "tab.rename", args: {} });
});

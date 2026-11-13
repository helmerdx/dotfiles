import assert from "node:assert/strict";
import test from "node:test";
import { prefixAction } from "../private_dot_config/herdr-app/mods/helmer-keys/actions.js";

test("prefix then a number selects the corresponding agent", () => {
  for (let index = 1; index <= 9; index += 1) {
    assert.deepEqual(prefixAction({ key: String(index), key_char: String(index), modifiers: {} }), {
      command: "agent", args: { index },
    });
  }
});

test("prefix then Shift+number selects tabs with digit or symbol key events", () => {
  for (let index = 1; index <= 9; index += 1) {
    const digit = String(index);
    const symbol = "!@#$%^&*("[index - 1];
    for (const event of [
      { key: digit, key_char: digit },
      { key: digit, key_char: symbol },
      { key: symbol, key_char: symbol },
      { key: digit },
    ]) {
      assert.deepEqual(prefixAction({ ...event, modifiers: { shift: true } }), {
        command: "tab.select", args: { index },
      });
    }
  }
});

test("modified number shortcuts are ignored and Shift+slash still opens help", () => {
  for (const modifier of ["alt", "control", "platform"]) {
    assert.equal(prefixAction({ key: "1", key_char: "1", modifiers: { [modifier]: true } }), null);
  }
  assert.deepEqual(prefixAction({ key: "/", key_char: "?", modifiers: { shift: true } }), {
    command: "app.help", args: {},
  });
});

test("prefix then comma opens tab rename", () => {
  const action = prefixAction({ key: ",", key_char: ",", modifiers: {} });
  assert.deepEqual(action, { command: "tab.rename", args: {} });
});

test("prefix then Shift+T remains a tab rename shortcut", () => {
  const action = prefixAction({ key: "t", key_char: "T", modifiers: { shift: true } });
  assert.deepEqual(action, { command: "tab.rename", args: {} });
});

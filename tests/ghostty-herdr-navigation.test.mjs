import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("Ghostty leaves Cmd+numbers available to Herdr and preserves prefixed tab navigation", (context) => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), "ghostty-herdr-"));
  context.after(() => rmSync(temporaryDirectory, { recursive: true, force: true }));
  const configDirectory = join(temporaryDirectory, "ghostty");
  mkdirSync(configDirectory);
  copyFileSync(new URL("../private_dot_config/ghostty/config", import.meta.url), join(configDirectory, "config"));

  const result = spawnSync("ghostty", ["+list-keybinds"], {
    encoding: "utf8",
    env: { ...process.env, XDG_CONFIG_HOME: temporaryDirectory },
  });
  if (result.error?.code === "ENOENT") {
    context.skip("Ghostty must be installed to resolve its default keybindings");
    return;
  }
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);

  for (let digit = 1; digit <= 9; digit++) {
    assert.doesNotMatch(
      result.stdout,
      new RegExp(`^keybind = super\\+(?:digit_)?${digit}=`, "m"),
      `Cmd+${digit} must reach Herdr instead of triggering a Ghostty action`,
    );
    assert.match(result.stdout, new RegExp(`^keybind = super\\+b>${digit}=goto_tab:${digit}$`, "m"));
  }
});

import { View, div } from "gpui-kit";
import { h_flex, v_flex, Input, InputState } from "gpui-base";
import { agents, closeOverlay, focused, hc, nextCommand, notify, openOverlay, props, run, theme } from "herdr";
import { PREFIX_BINDINGS, prefixAction } from "./actions.js";

export default class MigratedShortcuts extends View {
  init(_properties, context) {
    this.mode = props()?.mode ?? "service";
    this.origin = props()?.origin ?? focused();
    if (this.mode !== "service") {
      this.handle = context.focus_handle();
      this.handle.focus();
    }
    if (this.mode === "new-tab") {
      this.input = InputState.new({ placeholder: "Tab name" });
      this.input.on("submit", () => this.createTab());
      this.input.focus();
    }
    context.spawn(async (taskContext) => {
      for (;;) {
        const command = await nextCommand();
        try {
          if (this.mode === "prefix" && command === "send-prefix") {
            this.dismiss();
            await this.sendKey("ctrl+space", this.origin?.terminal);
          } else if (this.mode === "service" && command !== "send-prefix") {
            await this.shortcut(command);
          }
        } catch (error) {
          notify({ title: "Shortcut failed", body: String(error), level: "error" });
        }
        taskContext.notify();
      }
    });
  }

  dismiss() {
    if (props()?.overlay) closeOverlay(props().overlay);
  }

  open(mode) {
    openOverlay({
      mod: "helmer-keys",
      kind: "popup",
      at: "top",
      width: 620,
      height: mode === "new-tab" ? 240 : 560,
      props: { mode, origin: focused() },
    });
  }

  async sendKey(key, terminal) {
    if (!terminal) return;
    const response = await hc(["keys", terminal, key]);
    if (response.code !== 0) throw new Error(response.stderr || "The terminal rejected the key.");
  }

  focusAgent(index) {
    // Stable space/tab/pane order, independent of the sidebar's priority sorting.
    const agent = agents()[index - 1];
    if (agent) run("agent.focus", { terminal: agent.address });
  }

  confirmClose(kind) {
    const location = focused();
    const target = kind === "pane" ? location?.pane : location?.[kind];
    if (!target) return;
    const argumentsForTarget = kind === "pane" ? { pane: target } : { id: target, confirmed: true };
    openOverlay({
      mod: "confirm",
      kind: "dialog",
      width: 480,
      height: 220,
      props: {
        title: `Close ${kind}?`,
        detail: "This ends the programs running inside it.",
        command: { name: `${kind}.close`, args: argumentsForTarget },
      },
    });
  }

  async shortcut(command) {
    if (command === "prefix") this.open("prefix");
    else if (command === "new-tab") this.open("new-tab");
    else if (command.startsWith("agent-")) this.focusAgent(Number(command.slice(6)));
    else if (command.startsWith("close-")) this.confirmClose(command.slice(6));
  }

  perform(action) {
    this.dismiss();
    if (action.command === "agent") this.focusAgent(action.args.index);
    else if (action.command === "new-tab") this.open("new-tab");
    else if (action.command.startsWith("close-")) this.confirmClose(action.command.slice(6));
    else run(action.command, action.args);
  }

  createTab() {
    const name = this.input.value().trim();
    if (!name) return;
    this.dismiss();
    const argumentsForTab = { name };
    if (this.origin?.space) argumentsForTab.space = this.origin.space;
    if (this.origin?.cwd) argumentsForTab.folder = this.origin.cwd;
    run("tab.new", argumentsForTab);
  }

  key(event, context) {
    if (event.key === "escape") this.dismiss();
    else if (this.mode === "prefix") {
      const action = prefixAction(event);
      if (action) this.perform(action);
      else this.dismiss();
    } else return;
    context.stop_propagation();
  }

  button(id, label, action, colors) {
    return h_flex().id(id).h(48).px(16).items_center().justify_center()
      .rounded(8).bg(colors.raised).text_color(colors.foreground).text_size(16)
      .cursor_pointer().hover((style) => style.bg(colors.hover)).on_click(action).child(label);
  }

  render(context) {
    const colors = theme();
    if (this.mode === "service") {
      return this.button("prefix-button", "Ctrl+Space", () => this.open("prefix"), colors).w_full();
    }
    const container = v_flex().id("migrated-shortcuts").track_focus(this.handle)
      .on_key_down((event, keyContext) => this.key(event, keyContext))
      .w_full().h(this.mode === "new-tab" ? 240 : 560).min_h(0).p(20).gap(14)
      .bg(colors.popover).text_color(colors.foreground).text_size(16);
    if (this.mode === "new-tab") {
      return container.child(div().text_size(22).font_semibold().child("New tab"))
        .child(div().text_size(14).text_color(colors.muted).child("Choose a name. Escape cancels."))
        .child(Input.new(this.input).h(48).px(12).rounded(8).border_1().border_color(colors.accent)
          .bg(colors.background).text_color(colors.foreground).text_size(16))
        .child(h_flex().justify_end().gap(10)
          .child(this.button("cancel-tab", "Cancel", () => this.dismiss(), colors))
          .child(this.button("create-tab", "Create", () => this.createTab(), colors)));
    }
    return container.child(div().text_size(22).font_semibold().child("Ctrl+Space"))
      .child(div().text_size(14).text_color(colors.muted).child("Choose a shortcut. Escape cancels; Ctrl+Space sends the prefix."))
      .child(v_flex().flex_1().min_h(0).overflow_y_scrollbar().gap(2)
        .children(PREFIX_BINDINGS.map(([key, label, command, argumentsForAction]) =>
          h_flex().id(`prefix-${key}`).min_h(48).px(12).gap(16).items_center().rounded(6)
            .cursor_pointer().hover((style) => style.bg(colors.hover))
            .on_click(() => this.perform({ command, args: argumentsForAction ?? {} }))
            .child(div().w(32).font_semibold().text_color(colors.accent).child(key))
            .child(div().flex_1().child(label)))))
      .child(div().text_size(14).text_color(colors.muted).child("1-9: tabs | Alt+1-9 or Cmd+1-9: agents in workspace order"))
      .child(div().text_size(14).text_color(colors.muted).child("Resize: drag a divider. Copy: select text, then Cmd+C."));
  }
}

import { StateEffect, StateField } from "@codemirror/state";
import { EditorView, keymap, type Panel, showPanel } from "@codemirror/view";

export function createCommandPanelExtension() {
  const toggleCommandPanel = StateEffect.define<boolean>();

  const commandPanelState = StateField.define<boolean>({
    create: () => false,
    update(value, tr) {
      for (const e of tr.effects) {
        if (e.is(toggleCommandPanel)) {
          value = e.value;
        }
      }
      return value;
    },
    provide: (f) => showPanel.from(f, (val) => (val ? createCommandPanel : null)),
  });

  function createCommandPanel(view: EditorView): Panel {
    const input = document.createElement("input");
    input.className = "cm-command-panel-input";
    input.placeholder = "Type a command and press Enter";

    const close = () => {
      view.dispatch({
        effects: toggleCommandPanel.of(false),
      });
      view.focus();
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log(input.value);
        close();
      } else if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    });

    return {
      dom: input,
      top: true,
      mount() {
        input.focus();
      },
    };
  }

  const openCommandPanel = (view: EditorView): boolean => {
    view.dispatch({
      effects: toggleCommandPanel.of(true),
    });
    return true;
  };

  const commandKeymap = [{ key: "Mod-k", run: openCommandPanel, preventDefault: true }];
  return [commandPanelState, keymap.of(commandKeymap)];
}

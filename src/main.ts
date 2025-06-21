import { defaultKeymap } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { createResizeDragger } from "./resize-dragger";
import "./style.css";

// Initial HTML document in the editor
const startDoc = `<!DOCTYPE html>
<html>
  <head><title>Demo</title></head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>`;

new EditorView({
  state: EditorState.create({
    doc: startDoc,
    extensions: [keymap.of(defaultKeymap), html(), updateIframeOnChange()],
  }),
  parent: document.getElementById("editor")!,
});

const preview = document.getElementById("preview") as HTMLIFrameElement;
preview.srcdoc = startDoc;

function updateIframeOnChange() {
  return EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      preview.srcdoc = v.state.doc.toString();
    }
  });
}

createResizeDragger({ draggable: document.getElementById("drag")!, resizable: document.getElementById("container")! });

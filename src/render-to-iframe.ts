import { EditorView } from "@codemirror/view";

export function renderToIframe(iframe: HTMLIFrameElement) {
  return EditorView.updateListener.of((v) => {
    if (v.docChanged) {
      iframe.srcdoc = v.state.doc.toString();
    }
  });
}

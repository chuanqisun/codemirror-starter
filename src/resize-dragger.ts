export function createResizeDragger(options: { draggable: HTMLElement; resizable: HTMLElement }) {
  const { draggable, resizable } = options;
  let startX: number, startCols: string;

  const clamp = (x: number, min: number, max: number) => {
    return x < min ? min : x > max ? max : x;
  };

  const onPointerMove = (e: PointerEvent) => {
    const deltaX = e.clientX - startX;
    const parts = startCols.split(" ");
    let left = parts[0];
    let leftPx = left.endsWith("fr")
      ? resizable.getBoundingClientRect().width * (parseFloat(left) / (parseFloat(parts[0]) + parseFloat(parts[2])))
      : parseFloat(left);
    let newLeft = leftPx + deltaX;

    // clamp so we never go below 0 or past the container width
    const maxLeft = resizable.clientWidth - 5; /* gutter width */
    newLeft = clamp(newLeft, 0, maxLeft);

    resizable.style.gridTemplateColumns = `${newLeft}px 5px 1fr`;
  };

  const endDrag = (e: PointerEvent) => {
    document.body.style.userSelect = "";
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", endDrag);
    draggable.releasePointerCapture(e.pointerId);
  };

  draggable.addEventListener("pointerdown", (e) => {
    // grab initial mouse‑x and grid settings
    startX = e.clientX;
    startCols = getComputedStyle(resizable).gridTemplateColumns;
    // disable text selection during drag
    document.body.style.userSelect = "none";

    // install move/up/cancel listeners on document
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", endDrag);
    document.addEventListener("pointercancel", endDrag);

    // lock pointer events to this element so we still get up/move outside
    draggable.setPointerCapture(e.pointerId);

    e.preventDefault();
  });
}

import { RectangleMarker, layer } from '@codemirror/view';
import { type Extension } from '@uiw/react-codemirror';

export function createErrorlayer(lines: number[]): Extension {
  return layer({
    above: false,
    update() {
      return true;
    },
    markers: (view) => {
      return lines.map((line) => {
        const pos = view.state.doc.line(line).from;
        const block = view.lineBlockAt(pos);
        const { left: domLeft, top: domTop } = view.dom.getBoundingClientRect()
          ?? { left: 0, top: 0 };
        const { left, top } = view.coordsAtPos(pos)
          ?? { left: 0, top: 0 };
        const { left: right } = view.coordsAtPos(pos + block.length)
          ?? { left: 0 };

        return new RectangleMarker(
          'cm-errorlayer',
          left - domLeft,
          top - domTop,
          right - left,
          block.height,
        );
      });
    },
  });
}

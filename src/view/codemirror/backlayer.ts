import { RectangleMarker, layer } from '@codemirror/view';

export const backlayer = layer( {
  above: false,
  update() {
    return true;
  },
  markers: ( view ) => {
    return view.viewportLineBlocks.map( ( block ) => {
      const { left: domLeft, top: domTop } = view.dom.getBoundingClientRect()
        ?? { left: 0, top: 0 };
      const { left, top } = view.coordsAtPos( block.from )
        ?? { left: 0, top: 0 };
      const { left: right } = view.coordsAtPos( block.to )
        ?? { left: 0 };

      return new RectangleMarker(
        'cm-backlayer',
        left - domLeft,
        top - domTop,
        right - left,
        block.height,
      );
    } );
  },
} );

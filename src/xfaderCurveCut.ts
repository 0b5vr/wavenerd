import { smootherstep } from '@0b5vr/experimental';

export function xfaderCurveCut( x: number ): [ number, number ] {
  return [
    smootherstep( 0.95, 0.8, x ),
    smootherstep( 0.05, 0.2, x ),
  ];
}

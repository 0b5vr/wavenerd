import { linearstep } from '@0b5vr/experimental';

export function xfaderCurveLinear( x: number ): [ number, number ] {
  return [
    linearstep( 0.95, 0.05, x ),
    linearstep( 0.05, 0.95, x ),
  ];
}

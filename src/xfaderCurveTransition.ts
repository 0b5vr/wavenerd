import { linearstep } from '@0b5vr/experimental';

export function xfaderCurveTransition( x: number ): [ number, number ] {
  return [
    linearstep( 0.95, 0.5, x ),
    linearstep( 0.05, 0.5, x ),
  ];
}

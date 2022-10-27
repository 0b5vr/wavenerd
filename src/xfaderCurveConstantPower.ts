import { linearstep } from '@0b5vr/experimental';

const HALF_PI = 0.5 * Math.PI;

export function xfaderCurveConstantPower( x: number ): [ number, number ] {
  return [
    Math.sin( HALF_PI * linearstep( 0.95, 0.05, x ) ),
    Math.sin( HALF_PI * linearstep( 0.05, 0.95, x ) ),
  ];
}

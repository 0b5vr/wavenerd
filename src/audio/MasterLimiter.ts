export abstract class MasterLimiter {
  public abstract get input(): AudioNode;
  public abstract get output(): AudioNode;
}

export function hasOwnProperty<X extends { [key: string | number]: any }, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, Y> {
  return obj.hasOwnProperty(prop);
}

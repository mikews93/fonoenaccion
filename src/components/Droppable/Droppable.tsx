import { useEffect, useState } from 'react';
import { Droppable as RbdDroppable, DroppableProps } from 'react-beautiful-dnd';

export const Droppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <RbdDroppable {...props}>{children}</RbdDroppable>;
};

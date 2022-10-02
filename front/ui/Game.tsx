import React, { useEffect, useRef } from 'react';
import { Engine } from '../game/engine';

type Props = {
  id: string;
  onClose: Function;
};

export const Game: React.FC<Props> = (props) => {
  const ref = useRef(null);
  useEffect(() => {
    new Engine(ref.current as any, props.id, props.onClose);
  }, []);
  return <div ref={ref}></div>;
};

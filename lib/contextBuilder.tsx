import React, { createContext, PropsWithChildren, useContext } from "react";

export function contextBuilder<T>(
  hook: () => T = () => ({} as T),
  defaultValue?: Partial<T>
) {
  const Context = createContext(defaultValue ?? ({} as T));
  const _useContext = () => useContext(Context);

  const Provider = (props: PropsWithChildren) => {
    const { children } = props;

    const state = hook();

    return <Context.Provider value={state}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    Consumer: Context.Consumer,
    useContext: _useContext,
  };
}

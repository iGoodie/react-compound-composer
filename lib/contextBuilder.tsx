import React, { createContext, PropsWithChildren, useContext } from "react";

export function contextBuilder<P extends PropsWithChildren, T>(
  hook: (rootProps: P) => T = () => ({} as T)
) {
  const Context = createContext(null as T);
  
  const _useContext = () => {
    const ctx = useContext(Context);
    if (ctx == null) {
      throw new Error("useContext() MUST be called under an appropriate Provider");
    }
    return ctx as T;
  };

  const Provider = (props: P) => {
    const { children } = props;

    const state = hook(props);

    return <Context.Provider value={state}>{children}</Context.Provider>;
  };

  return {
    Provider,
    Consumer: Context.Consumer,
    useContext: _useContext,
  };
}

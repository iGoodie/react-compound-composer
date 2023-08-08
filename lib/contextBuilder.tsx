import React, { createContext, PropsWithChildren, useContext } from "react";

export function contextBuilder<T>(hook: () => T, defaultValue?: Partial<T>) {
  type State = ReturnType<typeof hook>;

  const Context = createContext(defaultValue ?? ({} as State));

  const useContextHook = () => useContext(Context);

  const Provider = (props: PropsWithChildren) => {
    const { children } = props;

    const state = hook();

    return <Context.Provider value={state}>{children}</Context.Provider>;
  };

  return {
    Context,
    Provider,
    useContext: useContextHook,
  };
}

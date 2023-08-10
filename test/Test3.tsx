import React, { FC, PropsWithChildren } from "react";
import { contextBuilder } from "../lib/contextBuilder";
import { compoundBuilder } from "../lib/compoundBuilder";

type CounterRootProps = PropsWithChildren<{
  foo: string;
}>;

const { Provider, useContext } = contextBuilder((props: CounterRootProps) => {
  const foobar = props.foo + "bar";
  return { foobar };
});

const CounterRoot: FC<CounterRootProps> = (props) => {
  const ctx = useContext();
  return <div>{ctx.foobar}</div>;
};

const Counter = compoundBuilder({
  name: "Counter",
  provider: Provider,
  flattenRoot: true,
  components: {
    Root: CounterRoot,
    Body: CounterRoot,
  },
});

<main>
  <Counter foo="foo">
    <Counter.Body foo="foo">
      <p>Testing</p>
    </Counter.Body>
  </Counter>
</main>;

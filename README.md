<!-- Logo -->
<p align="center">
  <img src="https://raw.githubusercontent.com/iGoodie/react-compound-composer/master/.github/assets/logo.svg" height="200px" alt="Logo"/>
</p>

<!-- Slogan -->
<p align="center">
   Spend less time crafting your Compound Components structure
</p>
<!-- Badges -->
<p align="center">

  <!-- Main Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/main-badge.svg" height="20px"/>
  <a href="https://www.npmjs.com/package/react-compound-composer">
    <img src="https://img.shields.io/npm/v/react-compound-composer"/>
  </a>
  <a href="https://github.com/iGoodie/react-compound-composer/tags">
    <img src="https://img.shields.io/github/v/tag/iGoodie/react-compound-composer"/>
  </a>
  <a href="https://github.com/iGoodie/paper-editor">
    <img src="https://img.shields.io/github/languages/top/iGoodie/react-compound-composer"/>
  </a>

  <br/>

  <!-- Github Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/github-badge.svg" height="20px"/>
  <a href="https://github.com/iGoodie/react-compound-composer/commits/master">
    <img src="https://img.shields.io/github/last-commit/iGoodie/react-compound-composer"/>
  </a>
  <a href="https://github.com/iGoodie/react-compound-composer/issues">
    <img src="https://img.shields.io/github/issues/iGoodie/react-compound-composer"/>
  </a>
  <a href="https://github.com/iGoodie/react-compound-composer/tree/master/src">
    <img src="https://img.shields.io/github/languages/code-size/iGoodie/react-compound-composer"/>
  </a>

  <br/>

  <!-- Support Badges -->
  <img src="https://raw.githubusercontent.com/iGoodie/paper-editor/master/.github/assets/support-badge.svg" height="20px"/>
  <a href="https://discord.gg/KNxxdvN">
    <img src="https://img.shields.io/discord/610497509437210624?label=discord"/>
  </a>
  <a href="https://www.patreon.com/iGoodie">
    <img src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3DiGoodie%26type%3Dpatrons"/>
  </a>
</p>

# Description

This library aims to make it easier to develop and maintain **Compound Components** by encapsulating **context creation** and **compound composition** logic under two core helpers.

Check those amazing posts to learn more about Compound Components:

- https://www.smashingmagazine.com/2021/08/compound-components-react/
- https://betterprogramming.pub/compound-component-design-pattern-in-react-34b50e32dea0
- https://blog.logrocket.com/understanding-react-compound-components/

# Examples/Demo

- [Stackblitz Collection](https://stackblitz.com/@iGoodie/collections/react-compound-composer)

1. [Simple Counter Example](https://stackblitz.com/edit/stackblitz-starters-e639ls?file=src%2FCounter.component.tsx): An almost in-line example of a Counter with its own state. Here just for a very quick proof-of-concept.
2. [A Better Structured Example](https://stackblitz.com/edit/stackblitz-starters-ltkqyc?file=src%2Fcomponents%2Faccordion%2Faccordion.tsx): An example of an Accordion compound
3. [Nested Compounds Example](https://stackblitz.com/edit/stackblitz-starters-aexdiu?file=src%2Fcomponents%2Faccordion%2Fbody%2Faccordion-body.tsx): An example of nested compound
4. [Flattened Root Example](https://stackblitz.com/edit/stackblitz-starters-yhr2uv?file=src%2FApp.tsx): An example of how you can flatten `Root` components

# How to Use?

## 1. Create your Context

Start off by creating your context. This context will be available via a hook on all the sub-components. A good way to keep a dispatch-editable state across the components.

```tsx
import { contextBuilder } from "react-compound-composer";

const {
  Context: CounterContext, // Created context is also returned, just for convenience
  Provider: CounterProvider,
  useContext: useCounterContext,
} = contextBuilder(() => {
  const [count, setCount] = useState(0);

  return {
    count,
    increase: (count: number) => setCount((c) => c + count),
    decrease: (count: number) => setCount((c) => c - count),
  };
});
```

## 2. Create your Root & Sub Components

Create a few components to be composed under the compound.

```tsx
import React from "react";

const CounterRoot = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
      }}
    >
      {props.children}
    </div>
  );
};
```

```tsx
import React from "react";

const CounterCount = () => {
  const ctx = useCounterContext();
  return <span>{ctx.count}</span>;
};
```

```tsx
import React from "react";

const CounterIncrease = () => {
  const ctx = useCounterContext();
  return <button onClick={() => ctx.increase(1)}>Increase</button>;
};
```

```tsx
import React from "react";

const CounterDecrease = () => {
  const ctx = useCounterContext();
  return <button onClick={() => ctx.decrease(1)}>Decrease</button>;
};
```

## 3. Compose your Compound with them!

Finally compose your Compound with the components you've created.

```tsx
import { compoundBuilder } from "react-compound-composer";

export const Counter = compoundBuilder({
  name: "Counter",
  provider: CounterProvider,
  components: {
    Root: CounterRoot,
    Count: CounterCount,
    Increase: CounterIncrease,
    Decrease: CounterDecrease,
  },
});
```

## 4. Enjoy your Compound!

Use your compound as desired.

```tsx
export default function App() {
  return (
    <main>
      <Counter.Root>
        <Counter.Increase />
        <Counter.Count />
        <Counter.Decrease />
      </Counter.Root>
    </main>
  );
}
```

## How to Flatten `Root` Components?

If you prefer using the root components without actually using their `Root` properties, you can set the `flattenRoot` option to `true`. Like so:

```tsx
import { compoundBuilder } from "react-compound-composer";

export const Counter = compoundBuilder({
  name: "Counter",
  provider: CounterProvider,
  flattenRoot: true,
  components: {
    Root: CounterRoot,
    Count: CounterCount,
    Increase: CounterIncrease,
    Decrease: CounterDecrease,
  },
});
```

and use the Compound like so:

```tsx
export default function App() {
  return (
    <main>
      <Counter>
        <Counter.Increase />
        <Counter.Count />
        <Counter.Decrease />
      </Counter>
    </main>
  );
}
```

## License

&copy; 2023 Taha Anılcan Metinyurt (iGoodie)

For any part of this work for which the license is applicable, this work is licensed under the [Attribution-ShareAlike 4.0 International](http://creativecommons.org/licenses/by-sa/4.0/) license. (See LICENSE).

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>

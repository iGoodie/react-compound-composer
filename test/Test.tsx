import React from "react";
import { compoundBuilder } from "../lib/compoundBuilder";
import { contextBuilder } from "../lib/contextBuilder";

const Ctx0 = contextBuilder();
const Ctx1 = contextBuilder();
const Ctx2 = contextBuilder();

const SubCompound = compoundBuilder({
  name: "SubCompound",
  provider: Ctx0.Provider,
  flattenRoot: true,
  components: {
    Root: (props) => <div></div>,
    SubTitle: () => <div />,
    SubDesc: () => <div />,
  },
});

console.log(SubCompound);

console.log("=========");

const Compound1 = compoundBuilder({
  name: "Compound1",
  provider: Ctx1.Provider,
  components: {
    Root: (props) => <div></div>,
    Title: (props: { a: 1 }) => <div />,
    Desc: () => <div />,
    Subber: SubCompound,
  },
});

console.log(Compound1);

console.log("=========");

const Compound2 = compoundBuilder({
  name: "Compound2",
  provider: Ctx2.Provider,
  flattenRoot: true,
  components: {
    Root: (props) => <div></div>,
    Title: (props: { a: 1 }) => <div />,
    Desc: () => <div />,
    Subber: SubCompound,
  },
});

console.log("..........")

console.log(SubCompound);

console.log("=========");

console.log(Compound1);

console.log("=========");

console.log(Compound2);

const u1 = (
  <main>
    <Compound1.Root>
      <Compound1.Title a={1} />
      <Compound1.Desc />
      <Compound1.Subber>
        <Compound1.Subber.SubTitle />
        <Compound1.Subber.SubDesc />
      </Compound1.Subber>
    </Compound1.Root>
  </main>
);

const u2 = (
  <main>
    <Compound2>
      <Compound2.Title a={1} />
      <Compound2.Desc />
      <Compound2.Subber>
        <Compound2.Subber.SubTitle />
        <Compound2.Subber.SubDesc />
      </Compound2.Subber>
    </Compound2>
  </main>
);

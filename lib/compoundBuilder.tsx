import React, { ComponentProps, FC, PropsWithChildren } from "react";

type CompoundResult<K> = {
  [
    // @ts-ignore
    key: K[number]
  ]: FC | CompoundResult<any>;
};

export function compoundBuilder<
  R extends FC<PropsWithChildren>,
  K extends string[],
  S extends CompoundResult<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren>;
  components: { Root: R } & S;
}): S {
  const Compound: any = {};

  const RootElement: FC<ComponentProps<(typeof opts.components)["Root"]>> = (
    props
  ) => (
    <opts.provider>
      {/* @ts-ignore */}
      <opts.components.Root {...props} />
    </opts.provider>
  );

  Compound.Root = RootElement;
  Compound.Root.displayName = opts.name;

  Object.entries(opts.components).map(([subName, subComponent]) => {
    if (subName === "Root") return;

    if (subComponent.name != null) {
      Compound[subName] = subComponent;
      return;
    }

    Compound[subName] = subComponent;
    Compound[subName].displayName = opts.name + subName;
  });

  return Compound;
}

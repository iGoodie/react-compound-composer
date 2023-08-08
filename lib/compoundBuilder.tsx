import React, { ComponentProps, FC, PropsWithChildren } from "react";

export function compoundBuilder<
  R extends FC,
  K extends string[],
  // @ts-ignore
  S extends { [key: K[number]]: FC }
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
    Compound[subName] = subComponent;
    Compound[subName].displayName = opts.name + subName;
  });

  return Compound;
}

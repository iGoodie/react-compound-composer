import React, { ComponentProps, FC, PropsWithChildren } from "react";

export function compoundBuilder<
  K extends string[],
  R extends FC,
  // @ts-ignore
  S extends { [key: K[number]]: FC }
>(opts: {
  rootName: string;
  provider: FC<PropsWithChildren>;
  subComponents: { Root: R } & S;
}): S {
  const Compound: any = {};

  const RootElement: FC<ComponentProps<(typeof opts.subComponents)["Root"]>> = (
    props
  ) => (
    <opts.provider>
      {/* @ts-ignore */}
      <opts.subComponents.Root {...props} />
    </opts.provider>
  );

  Compound.Root = RootElement;
  Compound.Root.displayName = opts.rootName;

  Object.entries(opts.subComponents).map(([subName, subComponent]) => {
    if (subName === "Root") return;
    Compound[subName] = subComponent;
    Compound[subName].displayName = opts.rootName + subName;
  });

  return Compound;
}

import React, { ComponentProps, FC, PropsWithChildren } from "react";

type FlattenedCompound<T> = {
  [K in keyof T]: T[K] extends { Root: infer R }
    ? Omit<T[K], "Root"> & R
    : T[K] extends Record<string, FC>
    ? FlattenedCompound<T[K]>
    : T[K];
};

type Compound<R extends FC<PropsWithChildren>, K> = {
  Root: R;
} & SubCompounds<K>;

type SubCompounds<K> = {
  [
    // @ts-ignore
    key: K[number]
  ]: FC | SubCompounds<any>;
};

function isCompound(value: any): value is Compound<any, any> {
  return value.Root != null && Object.values(value).every(isReactFC);
}

function isReactFC(value: any): value is React.FC {
  return typeof value === "function";
}

function flattenRoot<
  K extends string[],
  R extends FC<PropsWithChildren>,
  S extends SubCompounds<K>
>(
  Compound: { Root: R } & S
): React.FC<ComponentProps<R>> & FlattenedCompound<S> {
  const FlattenedCompound: any = Compound.Root;

  Object.keys(Compound).map((fieldName) => {
    const subName = fieldName as keyof S;
    if (subName === "Root") return;

    const subComponent = Compound[subName];

    if (isCompound(subComponent)) {
      // @ts-ignore
      FlattenedCompound[subName] = flattenRoot(subComponent);
      return;
    }

    FlattenedCompound[subName] = subComponent;
  });

  return FlattenedCompound;
}

export function compoundBuilder<
  R extends FC<PropsWithChildren>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren>;
  flattenRoot: true;
  components: { Root: R } & S;
}): ReturnType<typeof flattenRoot<K, R, S>>;

export function compoundBuilder<
  R extends FC<PropsWithChildren>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren>;
  flattenRoot?: boolean;
  components: { Root: R } & S;
}): S;

export function compoundBuilder<
  R extends FC<PropsWithChildren>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren>;
  flattenRoot?: boolean;
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

    if (isCompound(subComponent)) {
      const subCompound = subComponent;
      Compound[subName] = subCompound;
      Object.values(subCompound).forEach((field) => {
        field.displayName = opts.name + (field.displayName ?? "");
      });
      return;
    }

    Compound[subName] = subComponent;
    Compound[subName].displayName = opts.name + subName;
  });

  return opts.flattenRoot ? flattenRoot(Compound) : Compound;
}

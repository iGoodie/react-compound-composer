import React, { ComponentProps, FC, PropsWithChildren } from "react";

type FlattenedCompound<T> = {
  [K in keyof T]: T[K] extends { Root: infer R }
    ? Omit<T[K], "Root"> & R
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

function cloneFC<F extends FC>(Component: F): F {
  const ClonedComponent: FC<any> = (props) => <Component {...props} />;
  ClonedComponent.displayName = Component.displayName;
  return ClonedComponent as F;
}

function cloneCompound<
  K extends string[],
  R extends FC<PropsWithChildren>,
  S extends SubCompounds<K>,
  C extends { Root: R } & S,
  CI extends C | FC
>(Compound: CI): CI {
  const ClonedCompound: any = isReactFC(Compound)
    ? cloneFC(Compound)
    : { Root: cloneFC(Compound.Root) };

  Object.entries(Compound).forEach(([fieldName, field]) => {
    if (isReactFC(field) || isCompound(field)) {
      ClonedCompound[fieldName] = cloneCompound(field);
    }
  });

  return ClonedCompound;
}

function flattenRoot<
  K extends string[],
  R extends FC<PropsWithChildren>,
  S extends SubCompounds<K>
>(
  Compound: { Root: R } & S
): React.FC<ComponentProps<R>> & FlattenedCompound<Exclude<S, "Root">> {
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
  R extends FC<PropsWithChildren<any>>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren<any>>;
  flattenRoot: true;
  components: { Root: R } & S;
}): ReturnType<typeof flattenRoot<K, R, S>>;

export function compoundBuilder<
  R extends FC<PropsWithChildren<any>>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren<any>>;
  flattenRoot?: boolean;
  components: { Root: R } & S;
}): S;

export function compoundBuilder<
  R extends FC<PropsWithChildren<any>>,
  K extends string[],
  S extends SubCompounds<K>
>(opts: {
  name: string;
  provider: FC<PropsWithChildren<any>>;
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

    let isFlattenedRoot: boolean = false;

    if (
      isCompound(subComponent) ||
      (isFlattenedRoot =
        isReactFC(subComponent) && Object.values(subComponent).some(isReactFC))
    ) {
      const subCompound = cloneCompound(
        subComponent as any as Compound<any, any> | FC
      );
      Compound[subName] = subCompound;

      const subDisplayName = opts.name + "." + subName;

      if (isFlattenedRoot) {
        (subCompound as FC).displayName = subDisplayName;
      }
      Object.entries(subCompound).forEach(([fieldName, field]) => {
        if (fieldName === "Root") {
          field.displayName = subDisplayName;
          return;
        }

        if (!isReactFC(field)) return;
        const [oldRootName, ...rest] = (field.displayName ?? "").split(".");
        field.displayName = subDisplayName + "." + rest.join(".");
      });
      return;
    }

    Compound[subName] = subComponent;
    Compound[subName].displayName = opts.name + "." + subName;
  });

  return opts.flattenRoot ? flattenRoot(Compound) : Compound;
}

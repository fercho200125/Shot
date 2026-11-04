import { lazy, Suspense, type ComponentType } from "react";

export default function dynamic<P extends object>(
  loader: () => Promise<ComponentType<P> | { default: ComponentType<P> }>,
  opts: { loading?: () => React.ReactNode; ssr?: boolean } = {},
) {
  const L = lazy(async () => {
    const m = await loader();
    return { default: (typeof m === "function" ? m : (m as { default: ComponentType<P> }).default) as ComponentType<P> };
  });
  return function Dynamic(props: P) {
    return (
      <Suspense fallback={opts.loading ? opts.loading() : null}>
        <L {...props} />
      </Suspense>
    );
  };
}

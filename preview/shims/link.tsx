import { forwardRef, type AnchorHTMLAttributes } from "react";
import { navigate, toHash } from "../router";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; prefetch?: boolean; scroll?: boolean; replace?: boolean };

const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, onClick, prefetch: _p, scroll: _s, replace: _r, ...rest }, ref) {
  return (
    <a
      ref={ref}
      href={`#${toHash(href)}`}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
});
export default Link;

import { navigate, useRoute } from "../router";

export function usePathname() {
  return useRoute().pathname;
}
export function useSearchParams() {
  return useRoute().search;
}
export function useRouter() {
  return { push: navigate, replace: navigate, back: () => history.back(), refresh: () => {}, prefetch: () => {} };
}
export function notFound(): never {
  throw new Error("NOT_FOUND");
}

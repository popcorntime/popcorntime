/** biome-ignore-all lint/suspicious/noExplicitAny: mock */
const base = vi.fn<(message: unknown, data?: unknown) => string | number>();
(base as any).success = vi.fn();
(base as any).info = vi.fn();
(base as any).warning = vi.fn();
(base as any).error = vi.fn();
(base as any).loading = vi.fn();
(base as any).dismiss = vi.fn();

export const toast = base as unknown as typeof import("sonner").toast;
export const pluginShellOpen = vi.fn();

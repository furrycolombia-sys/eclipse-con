/**
 * Returns a `data-testid` attribute object for stable E2E selectors.
 * @param id - The test identifier to attach.
 * @example
 * <div {...tid("submit-button")} />
 */
export function tid(id: string) {
  return { "data-testid": id };
}

type ClassName = string | false | null | undefined;

/** Joins optional class names without adding a runtime dependency. */
export function cx(...classNames: ClassName[]): string {
  return classNames.filter(Boolean).join(" ");
}


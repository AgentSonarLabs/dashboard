export const RUN_STATUSES = ["running", "success", "error"] as const;
export const SPAN_TYPES = ["llm", "tool", "agent", "error", "session"] as const;
export const SPAN_STATUSES = ["running", "success", "error"] as const;
export const LOG_LEVELS = ["trace", "debug", "info", "warn", "error", "fatal"] as const;
export const FINDING_TYPES = [
  "long_running",
  "repeated_tool",
  "repeated_error",
  "no_activity",
  "possible_loop",
] as const;
export const FINDING_SEVERITIES = ["info", "warning", "critical"] as const;

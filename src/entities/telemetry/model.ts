import type {
  FINDING_SEVERITIES,
  FINDING_TYPES,
  LOG_LEVELS,
  RUN_STATUSES,
  SPAN_STATUSES,
  SPAN_TYPES,
} from "./constants";

export type RunStatus = (typeof RUN_STATUSES)[number];
export type SpanType = (typeof SPAN_TYPES)[number];
export type SpanStatus = (typeof SPAN_STATUSES)[number];
export type LogLevel = (typeof LOG_LEVELS)[number];
export type FindingType = (typeof FINDING_TYPES)[number];
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];
export type Metadata = Record<string, unknown>;

/** Dashboard-side representation of the backend wire contract. */
export interface Run {
  id: string;
  agent: string;
  status: RunStatus;
  startedAt: number;
  endedAt: number | null;
  duration: number | null;
  tokens: number | null;
  cost: number | null;
}

export interface Span {
  id: string;
  runId: string;
  parentId: string | null;
  type: SpanType;
  name: string;
  status: SpanStatus;
  startedAt: number;
  endedAt: number | null;
  duration: number | null;
  metadata: Metadata;
}

export interface LogEntry {
  id: string;
  runId: string;
  spanId: string | null;
  timestamp: number;
  level: LogLevel;
  message: string;
  metadata: Metadata;
}

export interface AgentError {
  id: string;
  runId: string;
  spanId: string | null;
  type: string;
  message: string;
  stack: string | null;
  agent: string;
  timestamp: number;
}

export interface Finding {
  id: string;
  runId: string;
  type: FindingType;
  severity: FindingSeverity;
  message: string;
  createdAt: number;
}

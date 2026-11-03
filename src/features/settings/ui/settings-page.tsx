"use client";

import type { EffectiveConfig } from "@/entities/telemetry/model";
import { useResource } from "@/shared/hooks/use-resource";
import { ResourceState } from "@/shared/ui/resource-state";

export function SettingsPage() {
  const { data, error, loading } = useResource<{ config: EffectiveConfig }>("/api/config");
  const config = data?.config;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SYSTEM / SETTINGS</p>
          <h1>Runtime configuration</h1>
          <p className="page-description">Effective settings reported by the connected backend.</p>
        </div>
      </div>
      <ResourceState loading={loading} error={error}>
        {config ? (
          <div className="settings-grid">
            <section className="panel settings-panel">
              <div className="panel-heading">
                <div>
                  <h2>Endpoints</h2>
                  <p>Collector and dashboard listeners</p>
                </div>
              </div>
              <Setting label="OTLP endpoint" value={config.endpoint} />
              <Setting
                label="Collector bind"
                value={`${config.collector.host}:${config.collector.port}`}
              />
              <Setting
                label="Dashboard bind"
                value={`${config.dashboard.host}:${config.dashboard.port}`}
              />
            </section>
            <section className="panel settings-panel">
              <div className="panel-heading">
                <div>
                  <h2>Storage</h2>
                  <p>Local persistence</p>
                </div>
              </div>
              <Setting label="Database file" value={config.database.path} />
            </section>
            <section className="panel settings-panel">
              <div className="panel-heading">
                <div>
                  <h2>Detection thresholds</h2>
                  <p>Current deterministic finding rules</p>
                </div>
              </div>
              <Setting label="Long running" value={`${config.detection.longRunningMs} ms`} />
              <Setting
                label="Repeated tool calls"
                value={`${config.detection.repeatedToolCount} calls`}
              />
              <Setting
                label="Repeated errors"
                value={`${config.detection.repeatedErrorCount} errors`}
              />
              <Setting label="No activity" value={`${config.detection.noActivityMs} ms`} />
              <Setting
                label="Possible loop"
                value={`${config.detection.loopRepeatCount} repeats`}
              />
            </section>
          </div>
        ) : null}
      </ResourceState>
    </>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

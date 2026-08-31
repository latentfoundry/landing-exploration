"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

const chapters = [
  {
    id: "model",
    rail: "Model",
    lead: "Build a living world model of your organisation.",
    continuation: "Connect roles, workflows, systems and constraints to show how work actually happens.",
    note: "Keep every entity and relationship traceable to its source material.",
    screen: "Organisational world model",
  },
  {
    id: "simulate",
    rail: "Simulate",
    lead: "Simulate what happens next.",
    continuation: "See how one decision changes your teams, operations and customers before you commit.",
    note: null,
    screen: "Decision simulation",
  },
  {
    id: "calibrate",
    rail: "Calibrate",
    lead: "Learn from what happens.",
    continuation: "Compare forecasts with rollout evidence and improve the next decision.",
    note: "Turn prediction error into a better model.",
    screen: "Forecast calibration",
  },
] as const;

const benchmarkSteps = [
  {
    label: "Same evidence",
    detail: "Both systems received the same pre-incident evidence.",
  },
  {
    label: "Same test",
    detail: "Each reconstructed the causal path before seeing the outcome.",
  },
  {
    label: "Checked against reality",
    detail: "Predictions were compared with what happened and repeated for consistency.",
  },
] as const;

const benchmarkScores = [
  { label: "Afterflow", value: 93, accent: true },
  { label: "GPT-5.5 baseline", value: 36, accent: false },
] as const;

function FocusWords({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span
      data-reveal="focus"
      data-reveal-delay={Math.round(delay * 1000)}
      data-reveal-duration={720}
      data-reveal-threshold={0.12}
    >
      {children}
    </span>
  );
}

const modelConnectors = [
  {
    id: "workday",
    name: "Workday",
    detail: "Org chart",
    desktop: { x: 24, y: 54, introX: 270, introY: 178, path: "M164 77 C200 77 220 94 254 100" },
    mobile: { x: 8, y: 90, introX: 104, introY: 190, path: "M90 108 C98 108 103 110 110 110" },
  },
  {
    id: "excel",
    name: "Excel",
    detail: "Operating baseline",
    desktop: { x: 836, y: 226, introX: 430, introY: 178, path: "M836 249 C770 249 660 250 564 250" },
    mobile: { x: 300, y: 262, introX: 204, introY: 190, path: "M300 280 C280 280 255 280 233 280" },
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    detail: "Tech register",
    desktop: { x: 24, y: 400, introX: 430, introY: 256, path: "M164 423 C200 423 230 405 266 400" },
    mobile: { x: 8, y: 432, introX: 104, introY: 282, path: "M90 450 C98 450 103 450 110 450" },
  },
  {
    id: "confluence",
    name: "Confluence",
    detail: "Policies & pages",
    desktop: { x: 836, y: 400, introX: 590, introY: 256, path: "M836 423 C805 423 780 414 749 410" },
    mobile: { x: 300, y: 442, introX: 204, introY: 282, path: "M300 460 C292 460 286 460 280 460" },
  },
  {
    id: "jira",
    name: "Jira",
    detail: "Tickets & builds",
    desktop: { x: 836, y: 54, introX: 590, introY: 178, path: "M836 77 C805 77 780 94 751 100" },
    mobile: { x: 300, y: 90, introX: 204, introY: 236, path: "M300 108 C292 108 286 110 280 110" },
  },
  {
    id: "slack",
    name: "Slack",
    detail: "Chats & decisions",
    desktop: { x: 24, y: 226, introX: 270, introY: 256, path: "M164 249 C200 249 225 250 257 250" },
    mobile: { x: 8, y: 262, introX: 104, introY: 236, path: "M90 280 C91 280 92 280 93 280" },
  },
] as const;

type ModelConnector = (typeof modelConnectors)[number];
type ModelConnectorId = ModelConnector["id"];
type ContextNodeKind = "cohort" | "person" | "workflow" | "system" | "policy" | "core";

type ContextNodeSpec = {
  id: string;
  type: string;
  name: readonly string[];
  role?: string;
  cx: number;
  cy: number;
  r: number;
  kind: ContextNodeKind;
  delay: string;
};

type ContextEdgeSpec = {
  id: string;
  path: string;
  label: string;
  labelX: number;
  labelY: number;
  edgeAt: string;
  labelAt: string;
  key?: boolean;
  signal?: boolean;
  signalAt?: string;
};

const desktopContextNodes: readonly ContextNodeSpec[] = [
  { id: "support", type: "Cohort", name: ["Enterprise", "Support"], cx: 300, cy: 100, r: 46, kind: "cohort", delay: "3.02s" },
  { id: "maya", type: "Person", name: ["Maya Chen"], role: "VP, Customer Operations", cx: 295, cy: 250, r: 42, kind: "person", delay: "3.42s" },
  { id: "service-cloud", type: "System", name: ["Service", "Cloud"], cx: 310, cy: 400, r: 44, kind: "system", delay: "3.18s" },
  { id: "priority-escalation", type: "Workflow", name: ["Priority account", "escalation"], cx: 500, cy: 250, r: 64, kind: "core", delay: "3.1s" },
  { id: "platform", type: "Cohort", name: ["Platform", "Reliability"], cx: 705, cy: 100, r: 46, kind: "cohort", delay: "3.34s" },
  { id: "leon", type: "Person", name: ["Leon Patel"], role: "Director, Platform", cx: 615, cy: 170, r: 40, kind: "person", delay: "4.98s" },
  { id: "engineering-handoff", type: "Workflow", name: ["Engineering", "handoff"], cx: 640, cy: 330, r: 50, kind: "workflow", delay: "4.72s" },
  { id: "p1-policy", type: "Policy", name: ["P1 escalation", "policy"], cx: 705, cy: 410, r: 48, kind: "policy", delay: "3.26s" },
];

const mobileContextNodes: readonly ContextNodeSpec[] = [
  { id: "support", type: "Cohort", name: ["Enterprise", "Support"], cx: 140, cy: 110, r: 30, kind: "cohort", delay: "3.02s" },
  { id: "maya", type: "Person", name: ["Maya Chen"], role: "VP, Customer Ops", cx: 118, cy: 280, r: 25, kind: "person", delay: "3.42s" },
  { id: "service-cloud", type: "System", name: ["Service", "Cloud"], cx: 140, cy: 450, r: 30, kind: "system", delay: "3.18s" },
  { id: "priority-escalation", type: "Workflow", name: ["Priority account", "escalation"], cx: 195, cy: 280, r: 38, kind: "core", delay: "3.1s" },
  { id: "platform", type: "Cohort", name: ["Platform", "Reliability"], cx: 250, cy: 110, r: 30, kind: "cohort", delay: "3.34s" },
  { id: "leon", type: "Person", name: ["Leon Patel"], role: "Director, Platform", cx: 285, cy: 200, r: 24, kind: "person", delay: "4.98s" },
  { id: "engineering-handoff", type: "Workflow", name: ["Engineering", "handoff"], cx: 250, cy: 350, r: 28, kind: "workflow", delay: "4.72s" },
  { id: "p1-policy", type: "Policy", name: ["P1 escalation", "policy"], cx: 250, cy: 460, r: 30, kind: "policy", delay: "3.26s" },
];

const desktopContextEdges: readonly ContextEdgeSpec[] = [
  { id: "maya-support", path: "M296 212 C297 190 298 168 299 146", label: "leads", labelX: 271, labelY: 179, edgeAt: "3.86s", labelAt: "4.32s" },
  { id: "support-priority", path: "M337 128 C380 150 415 184 449 212", label: "runs", labelX: 393, labelY: 148, edgeAt: "3.94s", labelAt: "4.4s", signal: true, signalAt: "6.18s" },
  { id: "maya-priority", path: "M333 250 C370 250 402 250 436 250", label: "owns", labelX: 385, labelY: 230, edgeAt: "4.02s", labelAt: "4.48s", key: true },
  { id: "policy-priority", path: "M670 383 C620 395 565 355 550 289", label: "governs", labelX: 583, labelY: 371, edgeAt: "4.1s", labelAt: "4.56s", key: true, signal: true, signalAt: "6.18s" },
  { id: "priority-service-cloud", path: "M450 290 C414 317 379 346 345 373", label: "records in", labelX: 399, labelY: 348, edgeAt: "4.18s", labelAt: "4.64s", signal: true, signalAt: "6.34s" },
  { id: "priority-engineering", path: "M556 282 C575 291 590 300 604 309", label: "triggers", labelX: 590, labelY: 282, edgeAt: "4.42s", labelAt: "4.88s", key: true, signal: true, signalAt: "6.34s" },
  { id: "engineering-platform", path: "M651 290 C669 245 681 190 692 144", label: "assigns to", labelX: 706, labelY: 225, edgeAt: "5.02s", labelAt: "5.48s", signal: true, signalAt: "6.5s" },
  { id: "leon-platform", path: "M643 148 C651 141 660 134 669 128", label: "leads", labelX: 636, labelY: 118, edgeAt: "5.4s", labelAt: "5.86s" },
  { id: "leon-engineering", path: "M621 206 C625 235 630 263 634 289", label: "owns", labelX: 600, labelY: 249, edgeAt: "5.48s", labelAt: "5.94s" },
];

const mobileContextEdges: readonly ContextEdgeSpec[] = [
  { id: "maya-support", path: "M121 255 C126 220 133 175 136 140", label: "leads", labelX: 128, labelY: 198, edgeAt: "3.86s", labelAt: "4.32s" },
  { id: "support-priority", path: "M149 139 C160 170 173 215 183 244", label: "runs", labelX: 168, labelY: 194, edgeAt: "3.94s", labelAt: "4.4s", signal: true, signalAt: "6.18s" },
  { id: "maya-priority", path: "M143 280 C148 280 152 280 157 280", label: "owns", labelX: 148, labelY: 248, edgeAt: "4.02s", labelAt: "4.48s", key: true },
  { id: "policy-priority", path: "M241 431 C217 415 206 375 206 316", label: "governs", labelX: 222, labelY: 386, edgeAt: "4.1s", labelAt: "4.56s", key: true, signal: true, signalAt: "6.18s" },
  { id: "priority-service-cloud", path: "M183 316 C170 355 159 395 149 421", label: "records", labelX: 168, labelY: 372, edgeAt: "4.18s", labelAt: "4.64s", signal: true, signalAt: "6.34s" },
  { id: "priority-engineering", path: "M219 310 C224 316 228 322 233 328", label: "triggers", labelX: 246, labelY: 312, edgeAt: "4.42s", labelAt: "4.88s", key: true, signal: true, signalAt: "6.34s" },
  { id: "engineering-platform", path: "M250 322 C250 260 250 200 250 140", label: "assigns", labelX: 254, labelY: 246, edgeAt: "5.02s", labelAt: "5.48s", signal: true, signalAt: "6.5s" },
  { id: "leon-platform", path: "M276 178 C270 160 265 145 261 138", label: "leads", labelX: 274, labelY: 157, edgeAt: "5.4s", labelAt: "5.86s" },
  { id: "leon-engineering", path: "M279 223 C270 255 261 290 256 323", label: "owns", labelX: 271, labelY: 272, edgeAt: "5.48s", labelAt: "5.94s" },
];

const phoneContextNodes: readonly ContextNodeSpec[] = [
  { id: "priority-escalation", type: "Workflow", name: ["Priority", "escalation"], cx: 170, cy: 105, r: 46, kind: "core", delay: "1.72s" },
  { id: "platform", type: "Cohort", name: ["Platform", "Reliability"], cx: 48, cy: 64, r: 40, kind: "cohort", delay: "1.86s" },
  { id: "p1-policy", type: "Policy", name: ["P1", "escalation", "policy"], cx: 290, cy: 64, r: 40, kind: "policy", delay: "1.94s" },
  { id: "support", type: "Cohort", name: ["Enterprise", "Support"], cx: 52, cy: 197, r: 40, kind: "cohort", delay: "2.02s" },
  { id: "maya", type: "Person", name: ["Maya", "Chen"], cx: 170, cy: 202, r: 36, kind: "person", delay: "2.1s" },
  { id: "service-cloud", type: "System", name: ["Service", "Cloud"], cx: 288, cy: 197, r: 40, kind: "system", delay: "2.18s" },
];

const phoneContextEdges: readonly ContextEdgeSpec[] = [
  { id: "priority-platform-phone", path: "M133 85 C114 74 96 68 78 66", label: "routes to", labelX: 103, labelY: 69, edgeAt: "2.4s", labelAt: "2.8s" },
  { id: "policy-priority-phone", path: "M262 69 C243 77 225 87 209 93", label: "governs", labelX: 237, labelY: 79, edgeAt: "2.48s", labelAt: "2.88s", key: true },
  { id: "support-priority-phone", path: "M75 176 C98 160 119 143 139 130", label: "runs", labelX: 105, labelY: 153, edgeAt: "2.56s", labelAt: "2.96s" },
  { id: "maya-priority-phone", path: "M170 174 V147", label: "owns", labelX: 148, labelY: 161, edgeAt: "2.64s", labelAt: "3.04s", key: true },
  { id: "priority-service-phone", path: "M201 130 C221 143 242 160 265 176", label: "records in", labelX: 237, labelY: 153, edgeAt: "2.72s", labelAt: "3.12s" },
];

function ConnectorMark({ kind, x = 0, y = 0, size = 24 }: { kind: ModelConnectorId; x?: number; y?: number; size?: number }) {
  if (kind === "slack") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="10" y="2" width="4" height="9" rx="2" fill="#36c5f0" />
        <rect x="13" y="10" width="9" height="4" rx="2" fill="#2eb67d" />
        <rect x="10" y="13" width="4" height="9" rx="2" fill="#ecb22e" />
        <rect x="2" y="10" width="9" height="4" rx="2" fill="#e01e5a" />
      </svg>
    );
  }

  if (kind === "excel") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#107c41" />
        <path d="m7 8 3.2 4L7 16h2.4l2.1-2.7 2.1 2.7H16l-3.2-4L16 8h-2.4l-2.1 2.7L9.4 8H7Z" fill="#fff" />
      </svg>
    );
  }

  if (kind === "servicenow") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="#81b5a1" />
        <path d="M7 13.2a5 5 0 0 1 10 0" fill="none" stroke="#0c2420" strokeLinecap="round" strokeWidth="2.2" />
        <circle cx="12" cy="13.4" r="1.5" fill="#0c2420" />
      </svg>
    );
  }

  if (kind === "confluence") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7.5c3.7 2.2 6 2.2 9.4-.2l2.2-1.6 2.5 3.4-2.2 1.6c-5 3.6-9.1 3.5-14.4.4L5 7.5Z" fill="#2684ff" />
        <path d="M19 16.5c-3.7-2.2-6-2.2-9.4.2l-2.2 1.6-2.5-3.4 2.2-1.6c5-3.6 9.1-3.5 14.4-.4L19 16.5Z" fill="#0065ff" />
      </svg>
    );
  }

  if (kind === "jira") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#2684ff" d="M12 2 5.4 8.6a4.8 4.8 0 0 0 6.6 0A4.8 4.8 0 0 0 18.6 8.6L12 2Z" />
        <path fill="#2684ff" d="m12 9.2-4.7 4.7a4 4 0 0 0 4.7 0 4 4 0 0 0 4.7 0L12 9.2Z" opacity=".82" />
        <path fill="#2684ff" d="m12 15.2-3.4 3.4L12 22l3.4-3.4-3.4-3.4Z" opacity=".64" />
      </svg>
    );
  }

  if (kind === "workday") {
    return (
      <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 14.5C5.5 7.9 9 4.7 12 4.7s6.5 3.2 8 9.8" fill="none" stroke="#f68d2e" strokeLinecap="round" strokeWidth="2.4" />
        <path d="M7.5 18.2h9" fill="none" stroke="#0875e1" strokeLinecap="round" strokeWidth="2" />
      </svg>
    );
  }

  return null;
}

function ConnectorTile({ connector, compact, index }: { connector: ModelConnector; compact: boolean; index: number }) {
  const layout = compact ? connector.mobile : connector.desktop;
  const tileWidth = compact ? 82 : 140;
  const tileHeight = compact ? 36 : 46;
  const logoSize = compact ? 16 : 22;
  const logoX = compact ? 8 : 12;
  const logoY = compact ? 10 : 12;
  const textX = compact ? 29 : 43;
  const motionStyle = {
    "--connector-shift-x": `${layout.introX - layout.x}px`,
    "--connector-shift-y": `${layout.introY - layout.y}px`,
    "--connector-delay": `${index * 0.07}s`,
  } as CSSProperties;

  return (
    <g className={`model-context__connector model-context__connector--${connector.id}`} transform={`translate(${layout.x} ${layout.y})`}>
      <g className="model-context__connector-motion" style={motionStyle}>
        <g className="model-context__connector-reveal">
          <rect width={tileWidth} height={tileHeight} rx="2" />
          <ConnectorMark kind={connector.id} x={logoX} y={logoY} size={logoSize} />
          <text className="model-context__connector-name" x={textX} y={compact ? 23 : 28}>{connector.name}</text>
        </g>
      </g>
    </g>
  );
}

function ContextNode({ node, compact }: { node: ContextNodeSpec; compact: boolean }) {
  const lineHeight = compact ? 10 : 14;
  const typeY = compact ? -10 : -14;
  const nameStart = node.name.length === 3
    ? compact ? -7 : -11
    : node.name.length > 1
      ? compact ? 2 : 3
      : compact ? 4 : 7;

  return (
    <g className={`model-context__node model-context__node--${node.id}`} transform={`translate(${node.cx} ${node.cy})`} style={{ "--node-delay": node.delay } as CSSProperties}>
      <g className="model-context__node-motion">
        <circle className={`model-context__entity-ring is-${node.kind}`} pathLength="1" r={node.r} />
        <circle className="model-context__node-seed" r={compact ? 1.6 : 2.2} />
        <g className="model-context__node-copy">
          <text className="model-context__node-type" textAnchor="middle" y={typeY}>{node.type}</text>
          <text className="model-context__node-name" textAnchor="middle">
            {node.name.map((line, lineIndex) => (
              <tspan x="0" y={nameStart + lineIndex * lineHeight} key={line}>{line}</tspan>
            ))}
          </text>
        </g>
      </g>
    </g>
  );
}

function RelationTag({ edge, compact }: { edge: ContextEdgeSpec; compact: boolean }) {
  const width = compact ? Math.max(40, edge.label.length * 6.4 + 12) : Math.max(48, edge.label.length * 7.2 + 16);
  const height = compact ? 18 : 20;

  return (
    <g
      className={`model-context__relation-label${edge.key ? " is-key" : ""}`}
      transform={`translate(${edge.labelX} ${edge.labelY})`}
      style={{ "--label-at": edge.labelAt } as CSSProperties}
    >
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx="2" />
      <text textAnchor="middle" y={compact ? 4 : 4.5}>{edge.label}</text>
    </g>
  );
}

function ContextGraph({ compact = false }: { compact?: boolean }) {
  const nodes = compact ? mobileContextNodes : desktopContextNodes;
  const edges = compact ? mobileContextEdges : desktopContextEdges;
  const arrowId = compact ? "context-arrow-mobile" : "context-arrow-desktop";
  const fieldMaskId = compact ? "context-field-mobile" : "context-field-desktop";
  const field = compact
    ? { cx: 195, cy: 280, r: 220, width: 390, height: 570 }
    : { cx: 500, cy: 250, r: 330, width: 1000, height: 500 };

  return (
    <svg
      className={`model-context__graph model-context__graph--${compact ? "mobile" : "desktop"}`}
      viewBox={compact ? "0 0 390 570" : "0 0 1000 500"}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id={arrowId} markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
          <path className="model-context__arrowhead" d="M0 0 5 2.5 0 5Z" />
        </marker>
        <mask id={fieldMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width={field.width} height={field.height}>
          <rect width={field.width} height={field.height} fill="#000" />
          <circle className="model-context__field-mask" cx={field.cx} cy={field.cy} r={field.r} fill="#fff" />
        </mask>
      </defs>

      <text className="model-context__caption" x={compact ? 8 : 24} y={compact ? 30 : 26}>Fragmented source material</text>
      <text className="model-context__caption is-right" x={compact ? 382 : 976} y={compact ? 30 : 26} textAnchor="end">Organisational context</text>

      <g className="model-context__source-paths">
        {modelConnectors.map((connector, index) => {
          const layout = compact ? connector.mobile : connector.desktop;
          return (
            <path
              d={layout.path}
              pathLength="1"
              key={connector.id}
              style={{ "--route-delay": `${index * 0.08}s` } as CSSProperties}
            />
          );
        })}
      </g>

      <circle className="model-context__field-wave" cx={field.cx} cy={field.cy} r={field.r} />

      <g className="model-context__field" mask={`url(#${fieldMaskId})`}>
        <g className="model-context__relationships">
          {edges.map((edge) => (
            <path
              d={edge.path}
              pathLength="1"
              markerEnd={`url(#${arrowId})`}
              key={edge.id}
              style={{ "--edge-at": edge.edgeAt } as CSSProperties}
            />
          ))}
        </g>

        <g className="model-context__signal-paths">
          {edges.filter((edge) => edge.signal).map((edge) => (
            <path
              d={edge.path}
              pathLength="1"
              key={edge.id}
              style={{ "--signal-at": edge.signalAt ?? "6.34s" } as CSSProperties}
            />
          ))}
        </g>

        <g className="model-context__nodes">
          {nodes.map((node) => <ContextNode compact={compact} key={node.id} node={node} />)}
        </g>

        <g className="model-context__relation-labels">
          {edges.map((edge) => <RelationTag compact={compact} edge={edge} key={edge.id} />)}
        </g>
      </g>

      <g className="model-context__connectors">
        {modelConnectors.map((connector, index) => (
          <ConnectorTile compact={compact} connector={connector} index={index} key={connector.id} />
        ))}
      </g>
    </svg>
  );
}

function MobileModelContext() {
  const sources = [
    modelConnectors[0],
    modelConnectors[5],
    modelConnectors[4],
    modelConnectors[1],
    modelConnectors[2],
    modelConnectors[3],
  ] as const;

  return (
    <div className="model-context__mobile">
      <header className="model-context__mobile-header">
        <span>Source systems</span>
        <small>6 systems</small>
      </header>

      <div className="model-context__mobile-sources">
        {sources.map((connector, index) => {
          const column = index % 3;
          const row = Math.floor(index / 3);
          return (
            <div
              className="model-context__mobile-source"
              key={connector.id}
              style={{
                "--mobile-source-at": `${index * 0.06}s`,
                "--mobile-source-shift-x": `${(1 - column) * 98}px`,
                "--mobile-source-shift-y": `${row === 0 ? 24 : -24}px`,
              } as CSSProperties}
            >
              <ConnectorMark kind={connector.id} size={17} />
              <span>{connector.name}</span>
            </div>
          );
        })}
      </div>

      <div className="model-context__mobile-assembly">
        <span>Assembling context</span>
        <i aria-hidden="true" />
      </div>

      <div className="model-context__mobile-graph">
        <header>
          <span>Context graph</span>
          <small>6 linked entities</small>
        </header>
        <svg
          className="model-context__mobile-graph-svg"
          viewBox="0 0 340 240"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <defs>
            <marker id="context-arrow-phone" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <path className="model-context__arrowhead" d="M0 0 5 2.5 0 5Z" />
            </marker>
          </defs>
          <g className="model-context__relationships">
            {phoneContextEdges.map((edge) => (
              <path
                d={edge.path}
                key={edge.id}
                markerEnd="url(#context-arrow-phone)"
                pathLength="1"
                style={{ "--edge-at": edge.edgeAt } as CSSProperties}
              />
            ))}
          </g>
          <g className="model-context__nodes">
            {phoneContextNodes.map((node) => <ContextNode compact={false} key={node.id} node={node} />)}
          </g>
          <g className="model-context__relation-labels">
            {phoneContextEdges.map((edge) => <RelationTag compact edge={edge} key={edge.id} />)}
          </g>
        </svg>
      </div>
    </div>
  );
}

function ModelContextVisual() {
  return (
    <figure
      className="model-context"
      role="img"
      aria-label="Workday org charts, Excel operating baselines, ServiceNow technology registers, Confluence policies, Jira build records and Slack conversations form an organisational context graph of team cohorts, responsible people, workflows, systems and policies."
    >
      <Image
        className="model-context__world"
        src="/afterflow-organisational-twin.png"
        alt=""
        fill
        sizes="(max-width: 1023px) calc(100vw - 36px), 1074px"
      />
      <div className="model-context__wash" aria-hidden="true" />

      <div className="model-context__surface" aria-hidden="true">
        <ContextGraph />
        <MobileModelContext />
      </div>
    </figure>
  );
}

type SimulationZonePattern = "support" | "operations" | "engineering" | "customers";

type SimulationZoneSpec = {
  id: SimulationZonePattern;
  label: string;
  impact: string;
  pattern: SimulationZonePattern;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: string;
  compactImpact?: string;
  guardrail?: boolean;
};

type SimulationPhase = "ready" | "running" | "complete";
type SimulationStage = "deploy" | "trace" | "calculate";

type SimulationPathSpec = {
  id: "pilot" | "priority" | "enterprise";
  name: string;
  shortName: string;
  scope: string;
  initiativeLabel: string;
  deploymentDetail: string;
  mapStatus: string;
  annualCases: string;
  adoption: string;
  timeSaved: string;
  labourRate: string;
  capacityValue: string;
  yearOneCost: string;
  roi: string;
  netBenefit: string;
  compactNetBenefit: string;
  zones: Record<SimulationZonePattern, { impact: string; compactImpact?: string }>;
};

const simulationPaths: SimulationPathSpec[] = [
  {
    id: "pilot",
    name: "Support pilot",
    shortName: "Pilot",
    scope: "1 queue",
    initiativeLabel: "AI-assisted priority triage",
    deploymentDetail: "Moving AI-assisted priority triage into production",
    mapStatus: "Pilot · Year 1",
    annualCases: "3K / year",
    adoption: "70%",
    timeSaved: "8 min",
    labourRate: "$75 / hour",
    capacityValue: "$21K",
    yearOneCost: "$20K",
    roi: "5%",
    netBenefit: "$1K net benefit",
    compactNetBenefit: "$1K net",
    zones: {
      support: { impact: "280 h released / yr", compactImpact: "280 h / yr" },
      engineering: { impact: "Humans approve P1", compactImpact: "P1 approval" },
      operations: { impact: "2.1K cases summarised", compactImpact: "2.1K summarised" },
      customers: { impact: "Faster agent review", compactImpact: "Faster review" },
    },
  },
  {
    id: "priority",
    name: "Priority rollout",
    shortName: "Priority",
    scope: "3 queues",
    initiativeLabel: "AI-assisted priority triage",
    deploymentDetail: "Moving AI-assisted priority triage into production",
    mapStatus: "3 queues · Year 1",
    annualCases: "12K / year",
    adoption: "80%",
    timeSaved: "10 min",
    labourRate: "$75 / hour",
    capacityValue: "$120K",
    yearOneCost: "$80K",
    roi: "50%",
    netBenefit: "$40K net benefit",
    compactNetBenefit: "$40K net",
    zones: {
      support: { impact: "1.6K h released / yr", compactImpact: "1.6K h / yr" },
      engineering: { impact: "Humans approve P1", compactImpact: "P1 approval" },
      operations: { impact: "9.6K cases pre-routed", compactImpact: "9.6K pre-routed" },
      customers: { impact: "Priority cases routed first", compactImpact: "Priority first" },
    },
  },
  {
    id: "enterprise",
    name: "Enterprise rollout",
    shortName: "Full",
    scope: "8 queues",
    initiativeLabel: "AI-assisted priority triage",
    deploymentDetail: "Moving AI-assisted priority triage into production",
    mapStatus: "8 queues · Year 1",
    annualCases: "30K / year",
    adoption: "70%",
    timeSaved: "12 min",
    labourRate: "$75 / hour",
    capacityValue: "$315K",
    yearOneCost: "$240K",
    roi: "31%",
    netBenefit: "$75K net benefit",
    compactNetBenefit: "$75K net",
    zones: {
      support: { impact: "4.2K h released / yr", compactImpact: "4.2K h / yr" },
      engineering: { impact: "Humans approve P1", compactImpact: "P1 approval" },
      operations: { impact: "21K cases pre-routed", compactImpact: "21K pre-routed" },
      customers: { impact: "Faster routing across queues", compactImpact: "Faster routing" },
    },
  },
];

const simulationZoneCopy = [
  {
    id: "support",
    label: "Enterprise support",
    pattern: "support",
    delay: "1.68s",
  },
  {
    id: "engineering",
    label: "Platform reliability",
    pattern: "engineering",
    delay: "1.9s",
    guardrail: true,
  },
  {
    id: "operations",
    label: "Service operations",
    pattern: "operations",
    delay: "2.12s",
  },
  {
    id: "customers",
    label: "Priority customers",
    pattern: "customers",
    delay: "2.34s",
  },
] as const;

function SimulationTwinZone({
  zone,
  compact,
}: {
  zone: SimulationZoneSpec;
  compact: boolean;
}) {
  const padding = compact ? 10 : 16;
  const fixtureTop = zone.y + (compact ? 57 : 66);
  const fixtureHeight = compact ? 18 : 25;
  const fixtureWidth = compact ? 34 : 54;
  const fixtureGap = compact ? 8 : 12;
  const impactWidth = compact
    ? zone.pattern === "customers"
      ? 120
      : zone.pattern === "engineering"
        ? 104
        : zone.pattern === "support"
          ? 98
          : 94
    : zone.pattern === "customers"
      ? 210
      : zone.pattern === "engineering"
        ? 160
        : zone.pattern === "support"
          ? 160
          : 178;
  const impactHeight = compact ? 18 : 24;
  const impactX = zone.x + zone.width - impactWidth - padding;
  const impactY = zone.y + zone.height - impactHeight - (compact ? 10 : 13);

  return (
    <g
      className={`simulation-twin__zone simulation-twin__zone--${zone.pattern}${zone.guardrail ? " is-guardrail" : ""}`}
      style={{ "--zone-at": zone.delay } as CSSProperties}
    >
      <rect className="simulation-twin__zone-floor" x={zone.x} y={zone.y} width={zone.width} height={zone.height} />
      <rect className="simulation-twin__zone-activation" x={zone.x} y={zone.y} width={zone.width} height={zone.height} />
      <path
        className="simulation-twin__zone-depth"
        d={`M${zone.x + 1} ${zone.y + zone.height}H${zone.x + zone.width}V${zone.y + 2}`}
      />
      <path
        className="simulation-twin__zone-wall"
        d={`M${zone.x} ${zone.y + zone.height}V${zone.y}H${zone.x + zone.width}V${zone.y + zone.height}`}
      />

      <text className="simulation-twin__zone-label" x={zone.x + padding} y={zone.y + (compact ? 20 : 25)}>{zone.label}</text>

      {zone.pattern === "customers" ? (
        <g className="simulation-twin__customer-cohort">
          {[0, 1, 2].map((item) => {
            const cx = zone.x + padding + (compact ? 21 : 29) + item * (compact ? 43 : 64);
            const cy = fixtureTop + (compact ? 11 : 14);
            return (
              <g key={item} transform={`translate(${cx} ${cy})`}>
                <circle r={compact ? 15 : 20} />
                <circle className="simulation-twin__person" cy={compact ? -2 : -3} r={compact ? 3 : 4} />
                <path d={compact ? "M-6 7 C-4 2 4 2 6 7" : "M-8 10 C-6 3 6 3 8 10"} />
              </g>
            );
          })}
          <path
            className="simulation-twin__customer-service-line"
            d={`M${zone.x + padding} ${fixtureTop + fixtureHeight + (compact ? 11 : 17)}H${zone.x + zone.width - padding}`}
          />
        </g>
      ) : zone.pattern === "operations" ? (
        <g className="simulation-twin__operation-lanes">
          {[0, 1, 2].map((item) => {
            const y = fixtureTop + item * (compact ? 16 : 22);
            return (
              <g key={item}>
                <path d={`M${zone.x + padding} ${y}H${zone.x + zone.width - padding - (compact ? 28 : 40)}`} />
                <circle className="simulation-twin__person" cx={zone.x + padding + item * (compact ? 27 : 41)} cy={y} r={compact ? 3 : 4} />
                <rect x={zone.x + zone.width - padding - (compact ? 22 : 31)} y={y - (compact ? 4 : 5)} width={compact ? 22 : 31} height={compact ? 8 : 10} />
              </g>
            );
          })}
        </g>
      ) : zone.pattern === "engineering" ? (
        <g className="simulation-twin__reliability-flow">
          <path d={`M${zone.x + padding} ${fixtureTop + fixtureHeight / 2}H${zone.x + zone.width - padding}`} />
          {[0, 1, 2].map((item) => {
            const x = zone.x + padding + item * (fixtureWidth + fixtureGap);
            return (
              <g key={item} transform={`translate(${x} ${fixtureTop})`}>
                <rect width={fixtureWidth} height={fixtureHeight} />
                <circle cx={compact ? 7 : 10} cy={fixtureHeight / 2} r={compact ? 2 : 2.6} />
                <path d={`M${compact ? 13 : 18} ${fixtureHeight / 2}H${fixtureWidth - (compact ? 6 : 9)}`} />
                {item === 1 ? (
                  <circle className="simulation-twin__person" cx={fixtureWidth / 2} cy={fixtureHeight + (compact ? 9 : 12)} r={compact ? 3.2 : 4.2} />
                ) : null}
              </g>
            );
          })}
        </g>
      ) : (
        <g className="simulation-twin__workstations">
          {[0, 1, 2].map((item) => {
            const x = zone.x + padding + item * (fixtureWidth + fixtureGap);
            return (
              <g key={item} transform={`translate(${x} ${fixtureTop})`}>
                <rect width={fixtureWidth} height={fixtureHeight} />
                <path d={`M${compact ? 6 : 9} ${compact ? 6 : 8}H${fixtureWidth - (compact ? 6 : 9)}V${compact ? 11 : 15}H${compact ? 6 : 9}Z`} />
                <circle className="simulation-twin__person" cx={fixtureWidth / 2} cy={fixtureHeight + (compact ? 9 : 12)} r={compact ? 3.2 : 4.2} />
                <path className="simulation-twin__chair" d={`M${fixtureWidth / 2 - (compact ? 7 : 9)} ${fixtureHeight + (compact ? 15 : 20)}H${fixtureWidth / 2 + (compact ? 7 : 9)}`} />
              </g>
            );
          })}
        </g>
      )}

      <g transform={`translate(${impactX} ${impactY})`}>
        <g className="simulation-twin__zone-impact">
          <rect pathLength="1" width={impactWidth} height={impactHeight} />
          <circle cx={compact ? 9 : 11} cy={impactHeight / 2} r={compact ? 2 : 2.5} />
          <text x={compact ? 16 : 19} y={impactHeight / 2 + (compact ? 3 : 3.5)}>{zone.impact}</text>
        </g>
      </g>
    </g>
  );
}

function SimulationTwinMap({ compact = false, path }: { compact?: boolean; path: SimulationPathSpec }) {
  const zones: SimulationZoneSpec[] = simulationZoneCopy.map((zone, index) => {
    const desktopLayouts = [
      { x: 24, y: 58, width: 288, height: 162 },
      { x: 448, y: 58, width: 288, height: 162 },
      { x: 24, y: 280, width: 288, height: 164 },
      { x: 448, y: 280, width: 288, height: 164 },
    ];
    const mobileLayouts = [
      { x: 12, y: 52, width: 166, height: 134 },
      { x: 212, y: 52, width: 166, height: 134 },
      { x: 12, y: 238, width: 166, height: 134 },
      { x: 212, y: 238, width: 166, height: 134 },
    ];

    return {
      ...zone,
      ...path.zones[zone.pattern],
      ...(compact ? mobileLayouts[index] : desktopLayouts[index]),
    };
  });
  const routes = compact
    ? [
        "M190 212 C176 200 178 118 140 118",
        "M200 212 C214 200 212 118 229 118",
        "M190 216 C176 226 178 311 157 311",
        "M200 216 C214 226 212 306 228 306",
      ]
    : [
        "M370 248 C340 235 326 137 226 137",
        "M390 248 C420 235 434 137 474 137",
        "M370 258 C340 274 326 368 288 368",
        "M390 258 C420 274 434 360 473 360",
      ];
  const routeDelays = ["1.18s", "1.36s", "1.54s", "1.72s"];
  const gateX = compact ? 195 : 380;
  const gateY = compact ? 214 : 253;

  return (
    <svg
      className={`simulation-twin__map simulation-twin__map--${compact ? "mobile" : "desktop"}`}
      viewBox={compact ? "0 0 390 400" : "0 0 760 500"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <text className="simulation-twin__caption" x={compact ? 12 : 24} y={compact ? 20 : 25}>
        {compact ? "Priority support model" : "Priority support operating model"}
      </text>
      <text className="simulation-twin__caption is-right" x={compact ? 378 : 736} y={compact ? 20 : 25} textAnchor="end">
        {path.mapStatus}
      </text>

      <rect
        className="simulation-twin__corridor"
        x={compact ? 184 : 326}
        y={compact ? 40 : 45}
        width={compact ? 22 : 108}
        height={compact ? 344 : 410}
      />
      <path
        className="simulation-twin__initiative-track"
        pathLength="1"
        d={compact ? "M195 40V199" : "M380 45V230"}
      />
      <path
        className="simulation-twin__initiative-charge"
        pathLength="1"
        d={compact ? "M195 40V199" : "M380 45V230"}
      />
      <circle
        className="simulation-twin__deployment-wave"
        cx={gateX}
        cy={gateY}
        pathLength="1"
        r={compact ? 38 : 64}
      />

      {zones.map((zone) => <SimulationTwinZone compact={compact} key={zone.id} zone={zone} />)}

      <g className="simulation-twin__routes">
        {routes.map((route, index) => (
          <path
            d={route}
            key={route}
            pathLength="1"
            style={{ "--route-at": routeDelays[index] } as CSSProperties}
          />
        ))}
      </g>

      <g transform={`translate(${gateX} ${gateY})`}>
        <g className="simulation-twin__production-gate">
          <rect
            className="simulation-twin__production-lock"
            x={compact ? -20 : -31}
            y={compact ? -20 : -29}
            width={compact ? 40 : 62}
            height={compact ? 40 : 58}
            pathLength="1"
          />
          <rect pathLength="1" x={compact ? -14 : -22} y={compact ? -14 : -20} width={compact ? 28 : 44} height={compact ? 28 : 40} />
          <path
            pathLength="1"
            d={compact ? "M-14 0H-4M4 0H14M0-14V-4M0 4V14" : "M-22 0H-6M6 0H22M0-20V-6M0 6V20"}
          />
          <circle className="simulation-twin__production-core" r={compact ? 3 : 4} />
        </g>
      </g>
      <text className="simulation-twin__gate-label" x={gateX} y={gateY + (compact ? 25 : 33)} textAnchor="middle">Production</text>

      <g className="simulation-twin__initiative-stage" transform={`translate(${gateX} ${gateY})`}>
        <g
          className="simulation-twin__initiative-token"
          style={{ "--initiative-shift": compact ? "-166px" : "-205px" } as CSSProperties}
        >
          <circle r={compact ? 8 : 11} />
          <path d={compact ? "M0-3L3 0 0 3-3 0Z" : "M0-4L4 0 0 4-4 0Z"} />
        </g>
      </g>

      <g className="simulation-twin__route-signals">
        {routes.map((route, index) => (
          <path
            d={route}
            key={route}
            pathLength="1"
            style={{ "--signal-at": routeDelays[index] } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

function SimulationMobileFlow({ path }: { path: SimulationPathSpec }) {
  const impacts = [
    { label: "Teams", value: path.zones.support.compactImpact ?? path.zones.support.impact, delay: "1.48s" },
    { label: "Operations", value: path.zones.operations.compactImpact ?? path.zones.operations.impact, delay: "1.92s" },
    { label: "Customers", value: path.zones.customers.compactImpact ?? path.zones.customers.impact, delay: "2.36s" },
  ] as const;

  return (
    <div className="simulation-twin__mobile-flow" aria-hidden="true">
      <header>
        <span>Rollout flow</span>
        <small>Illustrative · {path.mapStatus.replace("Year 1", "Y1")}</small>
      </header>

      <div className="simulation-twin__mobile-deployment">
        <strong>{path.initiativeLabel}</strong>
        <div className="simulation-twin__mobile-spine"><i /></div>
        <div className="simulation-twin__mobile-production"><i />Production</div>
      </div>

      <ol className="simulation-twin__mobile-impacts">
        {impacts.map((impact) => (
          <li key={impact.label} style={{ "--mobile-impact-at": impact.delay } as CSSProperties}>
            <span>{impact.label}</span>
            <strong>{impact.value}</strong>
          </li>
        ))}
      </ol>

      <div className="simulation-twin__mobile-guardrail">
        <span>Guardrail</span>
        <strong>{path.zones.engineering.compactImpact ?? path.zones.engineering.impact}</strong>
      </div>
    </div>
  );
}

const simulationProgress = ["Deploy", "Trace", "Value", "Done"] as const;

function SimulationTwinVisual() {
  const reduceMotion = useReducedMotion();
  const figureRef = useRef<HTMLElement | null>(null);
  const hasAutoPlayed = useRef(false);
  const [selectedPath, setSelectedPath] = useState(1);
  const [phase, setPhase] = useState<SimulationPhase>("ready");
  const [stage, setStage] = useState<SimulationStage>("deploy");
  const [completedPaths, setCompletedPaths] = useState<number[]>([]);
  const [runId, setRunId] = useState(0);
  const path = simulationPaths[selectedPath];

  useEffect(() => {
    const node = figureRef.current;
    if (!node || hasAutoPlayed.current) return;

    const begin = () => {
      if (hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;
      setStage("deploy");
      setRunId((current) => current + 1);
      setPhase("running");
    };

    if (typeof IntersectionObserver === "undefined") {
      begin();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        begin();
        observer.disconnect();
      }
    }, { threshold: [0.3] });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "running") return;

    const timers: number[] = [];
    if (reduceMotion) {
      timers.push(window.setTimeout(() => {
        setCompletedPaths((current) => current.includes(selectedPath) ? current : [...current, selectedPath]);
        setPhase("complete");
      }, 0));
    } else {
      timers.push(window.setTimeout(() => setStage("trace"), 1120));
      timers.push(window.setTimeout(() => setStage("calculate"), 3150));
      timers.push(window.setTimeout(() => {
        setCompletedPaths((current) => current.includes(selectedPath) ? current : [...current, selectedPath]);
        setPhase("complete");
      }, 5400));
    }

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [phase, reduceMotion, runId, selectedPath]);

  const selectPath = (index: number) => {
    if (phase === "running") return;
    setSelectedPath(index);

    if (completedPaths.includes(index)) {
      setPhase("complete");
      return;
    }

    hasAutoPlayed.current = true;
    setStage("deploy");
    setRunId((current) => current + 1);
    setPhase("running");
  };

  const activeProgress = phase === "complete"
    ? 3
    : phase === "running"
      ? stage === "deploy" ? 0 : stage === "trace" ? 1 : 2
      : -1;
  const status = phase === "complete"
    ? {
        title: `${path.name} complete`,
        detail: `${path.roi} Year 1 ROI · ${path.netBenefit}`,
      }
    : phase === "running"
      ? stage === "deploy"
        ? { title: `Deploying ${path.name}`, detail: path.deploymentDetail }
        : stage === "trace"
          ? { title: "Tracing operational impact", detail: "Updating support, operations, reliability and customers" }
          : { title: "Calculating Year 1 results", detail: "Resolving capacity, cost, net benefit and ROI" }
      : { title: "Simulation ready", detail: "Starts automatically when this section appears" };
  const announcement = phase === "running"
    ? `${path.name} simulation started.`
    : phase === "complete"
      ? `${path.name} complete. Year 1 ROI ${path.roi}.`
      : "";

  return (
    <figure
      className={`simulation-twin is-${phase}`}
      ref={figureRef}
    >
      <Image
        className="simulation-twin__world"
        src="/afterflow-organisational-twin.png"
        alt=""
        fill
        sizes="(max-width: 1023px) calc(100vw - 36px), 1074px"
      />
      <div className="simulation-twin__wash" aria-hidden="true" />

      <div className="simulation-twin__surface">
        <div className="simulation-twin__map-frame" key={`${path.id}-${runId}`}>
          <SimulationTwinMap path={path} />
          <SimulationMobileFlow path={path} />
        </div>

        <aside className="simulation-twin__output" aria-label="Simulation controls and results">
          <header className="simulation-twin__output-header">
            <span>Illustrative scenario</span>
            <strong>AI-assisted priority triage</strong>
            <small>{path.name} · {path.scope} · Year 1</small>
          </header>

          <section className="simulation-twin__setup" aria-label="Scenario setup">
            <span>Scenario setup</span>
            <dl>
              <div>
                <dt>Eligible cases</dt>
                <dd>{path.annualCases}</dd>
              </div>
              <div>
                <dt>Expected adoption</dt>
                <dd>{path.adoption}</dd>
              </div>
              <div>
                <dt>Time saved / case</dt>
                <dd>{path.timeSaved}</dd>
              </div>
              <div>
                <dt>Labour rate</dt>
                <dd>{path.labourRate}</dd>
              </div>
            </dl>
          </section>

          <div className="simulation-twin__controls">
            <div className="simulation-twin__controls-heading">
              <span>Compare rollout paths</span>
            </div>
            <div
              aria-busy={phase === "running"}
              aria-label="Choose a rollout path"
              className="simulation-twin__path-options"
              role="group"
            >
              {simulationPaths.map((candidate, index) => {
                const isComplete = completedPaths.includes(index);
                return (
                  <button
                    aria-pressed={selectedPath === index}
                    aria-disabled={phase === "running"}
                    className={isComplete ? "is-simulated" : undefined}
                    key={candidate.id}
                    onClick={() => selectPath(index)}
                    type="button"
                  >
                    <span>{candidate.shortName}</span>
                    <small>{isComplete ? `${candidate.roi} ROI` : candidate.scope}</small>
                  </button>
                );
              })}
            </div>
            <ol className="simulation-twin__progress" aria-label="Simulation progress">
              {simulationProgress.map((label, index) => (
                <li
                  className={index === activeProgress ? "is-active" : index < activeProgress ? "is-done" : undefined}
                  aria-current={index === activeProgress ? "step" : undefined}
                  key={label}
                >
                  {label}
                </li>
              ))}
            </ol>
            <div className="simulation-twin__status">
              <strong>{status.title}</strong>
              <small>{status.detail}</small>
            </div>
            <span className="sr-only" aria-live="polite">{announcement}</span>
          </div>

          <div className="simulation-twin__roi">
            <dl>
              <div style={{ "--output-at": "3.62s" } as CSSProperties}>
                <dt>Capacity value</dt>
                <dd>{path.capacityValue}</dd>
              </div>
              <div style={{ "--output-at": "3.88s" } as CSSProperties}>
                <dt>Year 1 cost</dt>
                <dd>{path.yearOneCost}</dd>
              </div>
            </dl>
            <div className="simulation-twin__roi-result">
              <strong>{path.roi}</strong>
              <span>ROI</span>
              <small>{path.compactNetBenefit}</small>
            </div>
          </div>
        </aside>
      </div>
      <figcaption className="sr-only">
        In this illustrative example, AI-assisted priority triage plays automatically when the illustration enters view. The simulation moves the selected rollout into production, traces its effect on support, operations, reliability and customers, then resolves Year 1 capacity, cost, net benefit and ROI. Selecting a new path runs it automatically; completed paths remain available for comparison.
      </figcaption>
    </figure>
  );
}

function CalibrationVisual({ title }: { title: string }) {
  const observedPoints = [
    { x: 45, y: 264, at: "1.5s" },
    { x: 195, y: 225, at: "1.85s" },
    { x: 350, y: 182, at: "2.2s" },
    { x: 515, y: 143, at: "2.55s" },
  ] as const;

  return (
    <figure className="calibration-loop">
      <Image
        className="calibration-loop__world"
        src="/afterflow-organisational-twin.png"
        alt=""
        fill
        sizes="(max-width: 1023px) calc(100vw - 36px), 1074px"
      />
      <div className="calibration-loop__wash" aria-hidden="true" />

      <div className="calibration-loop__surface" aria-hidden="true">
        <header className="calibration-loop__header">
          <div>
            <span>Rollout evidence</span>
            <strong>{title}</strong>
          </div>
          <div className="calibration-loop__phase">
            <span className="is-baseline"><i /> Forecast loaded</span>
            <span className="is-reading"><i /> Reading rollout</span>
            <span className="is-final"><i /> Model calibrated</span>
          </div>
        </header>

        <div className="calibration-loop__body">
          <section className="calibration-loop__chart">
            <header>
              <div>
                <strong>AI-assisted priority triage</strong>
                <small>Time saved / case</small>
              </div>
              <div className="calibration-loop__legend">
                <span><i className="is-predicted" /> Predicted</span>
                <span><i className="is-actual" /> Actual</span>
                <span><i className="is-calibrated" /> Recalibrated</span>
              </div>
            </header>

            <div className="calibration-loop__plot">
              <svg viewBox="0 0 720 320" preserveAspectRatio="xMidYMid meet" focusable="false">
                <defs>
                  <linearGradient id="calibration-forecast-field" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#0bd3b6" stopOpacity="0.03" />
                    <stop offset="0.62" stopColor="#0bd3b6" stopOpacity="0.13" />
                    <stop offset="1" stopColor="#0bd3b6" stopOpacity="0.06" />
                  </linearGradient>
                  <linearGradient id="calibration-updated-field" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#35ead0" stopOpacity="0.04" />
                    <stop offset="1" stopColor="#35ead0" stopOpacity="0.2" />
                  </linearGradient>
                </defs>

                <g className="calibration-loop__grid">
                  {[55, 125, 195, 265].map((y) => <path d={`M45 ${y} H690`} key={`h-${y}`} />)}
                  {[45, 195, 350, 515, 690].map((x) => <path d={`M${x} 35 V275`} key={`v-${x}`} />)}
                </g>

                <path
                  className="calibration-loop__forecast-band"
                  d="M45 235 C120 207 155 182 195 166 S300 108 350 96 S465 58 515 54 S625 36 690 32 L690 82 C625 86 565 94 515 104 S405 134 350 150 S245 190 195 216 S105 270 45 286 Z"
                />
                <path
                  className="calibration-loop__predicted"
                  d="M45 258 C120 230 155 205 195 190 S300 132 350 120 S465 82 515 78 S625 60 690 56"
                  pathLength="1"
                />

                <path
                  className="calibration-loop__actual"
                  d="M45 264 C120 250 155 229 195 225 S300 190 350 182 S465 145 515 143"
                  pathLength="1"
                />
                <g className="calibration-loop__actual-points">
                  {observedPoints.map((point) => (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      key={`${point.x}-${point.y}`}
                      r="4"
                      style={{ "--point-at": point.at } as CSSProperties}
                    />
                  ))}
                </g>

                <g className="calibration-loop__variance">
                  <line x1="350" x2="350" y1="120" y2="182" />
                  <circle cx="350" cy="120" r="2.5" />
                  <circle cx="350" cy="182" r="2.5" />
                  <g className="calibration-loop__variance-label" transform="translate(410 151)">
                    <rect x="-48" y="-11" width="96" height="22" rx="2" />
                    <text textAnchor="middle" y="3">1.4 min gap</text>
                  </g>
                </g>

                <path
                  className="calibration-loop__updated-band"
                  d="M515 130 C590 114 638 87 690 79 L690 105 C638 113 590 140 515 156 Z"
                />
                <path
                  className="calibration-loop__updated"
                  d="M515 143 C590 127 638 100 690 92"
                  pathLength="1"
                />
                <path
                  className="calibration-loop__updated-signal"
                  d="M515 143 C590 127 638 100 690 92"
                  pathLength="1"
                />
                <circle className="calibration-loop__updated-point" cx="690" cy="92" r="4" />
              </svg>
              <i className="calibration-loop__scanner" />
            </div>

            <div className="calibration-loop__axis">
              <span>Pilot</span>
              <span>Week 2</span>
              <span>Wave 1</span>
              <span>Wave 2</span>
              <span>Next wave</span>
            </div>
          </section>

          <aside className="calibration-loop__insight">
            <section className="calibration-loop__evidence">
              <header>
                <span>Rollout evidence</span>
                <small>Illustrative values</small>
              </header>
              <dl>
                <div style={{ "--evidence-at": "1.65s" } as CSSProperties}>
                  <dt>Cases processed</dt>
                  <dd>12K</dd>
                </div>
                <div style={{ "--evidence-at": "2s" } as CSSProperties}>
                  <dt>Adoption reached</dt>
                  <dd>72%</dd>
                </div>
                <div style={{ "--evidence-at": "2.35s" } as CSSProperties}>
                  <dt>Time saved / case</dt>
                  <dd>8.6 min</dd>
                </div>
              </dl>
              <small>Service queues · adoption events · team feedback</small>
            </section>

            <section className="calibration-loop__gap">
              <span>Forecast vs actual</span>
              <div>
                <p><small>Predicted</small><strong>10 min</strong></p>
                <i aria-hidden="true" />
                <p><small>Actual</small><strong>8.6 min</strong></p>
              </div>
              <b>−1.4 min / case</b>
            </section>

            <section className="calibration-loop__update">
              <span><i /> Model updated</span>
              <strong>Next forecast uses measured adoption and review time.</strong>
              <small>Ready to simulate</small>
            </section>
          </aside>
        </div>
      </div>
      <figcaption className="sr-only">
        In this illustrative example, the priority-triage forecast predicted ten minutes saved per eligible case. Afterflow reconciles rollout evidence showing 8.6 minutes saved, identifies a 1.4-minute forecast gap, updates adoption and human-review assumptions, and produces a recalibrated forecast for the next simulation.
      </figcaption>
    </figure>
  );
}

function ProductStageVisual({
  index,
  title,
}: {
  index: number;
  title: string;
}) {
  if (index === 0) return <ModelContextVisual />;
  if (index === 1) return <SimulationTwinVisual />;
  return <CalibrationVisual title={title} />;
}

export function TransformationScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              Math.abs(first.boundingClientRect.top - window.innerHeight * 0.32) -
              Math.abs(second.boundingClientRect.top - window.innerHeight * 0.32),
          )[0];

        if (!visibleEntry) return;
        const nextIndex = Number((visibleEntry.target as HTMLElement).dataset.chapterIndex);
        if (Number.isInteger(nextIndex)) setActiveIndex(nextIndex);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: 0 },
    );

    const chapterElements = chapterRefs.current.filter(
      (chapter): chapter is HTMLElement => chapter !== null,
    );
    chapterElements.forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const moveToChapter = (index: number) => {
    if (reduceMotion) setActiveIndex(index);
    const target = document.getElementById(`step-${chapters[index].id}`);
    if (!target) return;

    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <div className="story-shell transformation-story">
        <nav className="transformation-story__rail" aria-label="How Afterflow works">
          <ol data-reveal="focus" data-reveal-threshold={0.08}>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={activeIndex === index ? "is-active" : ""}
                  aria-current={activeIndex === index ? "step" : undefined}
                  onClick={() => moveToChapter(index)}
                >
                  <span aria-hidden="true" />
                  {chapter.rail}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="transformation-story__chapters">
          {chapters.map((chapter, index) => (
            <article
              className="story-chapter"
              data-chapter-index={index}
              id={`step-${chapter.id}`}
              key={chapter.id}
              ref={(element) => {
                chapterRefs.current[index] = element;
              }}
            >
              <span className="story-chapter__mobile-label" data-reveal="focus">
                {chapter.rail}
              </span>
              <h3><FocusWords>{chapter.lead}</FocusWords></h3>
              <p>
                <FocusWords delay={0.08}>{chapter.continuation}</FocusWords>
              </p>
              {chapter.note ? (
                <span className="story-chapter__note">
                  <FocusWords delay={0.14}>{chapter.note}</FocusWords>
                </span>
              ) : null}
              <div
                className="story-chapter__visual"
                data-reveal="surface"
                data-reveal-delay={index < 2 ? 0 : 180}
                data-reveal-duration={index < 2 ? 680 : 1200}
                data-reveal-threshold={0.12}
              >
                <ProductStageVisual index={index} title={chapter.screen} />
              </div>
            </article>
          ))}
        </div>
      </div>

      <section
        className="shell accuracy-field"
        aria-labelledby="accuracy-benchmark-heading"
      >
        <header>
          <h3 id="accuracy-benchmark-heading">
            <FocusWords>Accuracy is earned against reality.</FocusWords>
          </h3>
          <p>
            <FocusWords delay={0.12}>
              A real incident was replayed using only evidence available beforehand.
            </FocusWords>
          </p>
        </header>
        <div
          className="accuracy-benchmark"
          data-reveal="surface"
          data-reveal-duration={1500}
          data-reveal-threshold={0.08}
        >
          <span className="accuracy-benchmark__trace" aria-hidden="true" />

          <ol className="accuracy-benchmark__steps" aria-label="How the replay was run">
            {benchmarkSteps.map((step) => (
              <li key={step.label}>
                <div className="accuracy-benchmark__step-content">
                  <strong>{step.label}</strong>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="accuracy-benchmark__results" aria-label="Accuracy comparison results">
            {benchmarkScores.map((score) => (
              <div
                className={`accuracy-score${score.accent ? " is-afterflow" : ""}`}
                key={score.label}
                style={{ "--accuracy-score": score.value / 100 } as CSSProperties}
              >
                <span>{score.label}</span>
                <span className="accuracy-score__track" aria-hidden="true">
                  <i />
                </span>
                <strong>{score.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

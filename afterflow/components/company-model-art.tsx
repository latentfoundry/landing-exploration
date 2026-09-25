import type { CSSProperties } from "react";

type Entity = { id: string; community: number; x: number; y: number; radius: number };
type Relationship = { a: number; b: number; community: number };

// An illustrative organisation, with repeatable positions and meaningful communities.
// The selected neighbourhood is retrieved from these same relationships.
const communities = [
  { id: "people", count: 22, x: 150, y: 126, rx: 94, ry: 77, phase: .2, anchor: [185, 134] },
  { id: "knowledge", count: 24, x: 346, y: 82, rx: 107, ry: 58, phase: 1.3, anchor: [325, 113] },
  { id: "systems", count: 24, x: 524, y: 222, rx: 79, ry: 105, phase: 2.4, anchor: [493, 218] },
  { id: "workflows", count: 26, x: 327, y: 231, rx: 107, ry: 92, phase: .7, anchor: [337, 232] },
  { id: "cases", count: 24, x: 135, y: 300, rx: 104, ry: 80, phase: 1.7, anchor: [139, 309] },
  { id: "decisions", count: 24, x: 399, y: 365, rx: 116, ry: 49, phase: 2.8, anchor: [426, 348] },
];
const entities: Entity[] = [];
const communityEntities: number[][] = [];
const anchors: number[] = [];
const goldenAngle = Math.PI * (3 - Math.sqrt(5));

communities.forEach((community, communityIndex) => {
  const members: number[] = [];
  anchors.push(entities.length);
  for (let index = 0; index < community.count; index++) {
    const angle = index * goldenAngle + community.phase;
    const spread = Math.sqrt(index / community.count);
    const x = index === 0 ? community.anchor[0]
      : community.x + Math.cos(angle) * community.rx * spread;
    const y = index === 0 ? community.anchor[1]
      : community.y + Math.sin(angle) * community.ry * spread;
    members.push(entities.length);
    entities.push({
      id: `${community.id}-${String(index + 1).padStart(2, "0")}`,
      community: communityIndex,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      radius: index === 0 ? 3.6 : 1.65 + (index % 4) * .38,
    });
  }
  communityEntities.push(members);
});

const relationships = new Map<string, Relationship>();
const relationshipKey = (a: number, b: number) => a < b ? `${a}-${b}` : `${b}-${a}`;
function connect(a: number, b: number, community = entities[a].community) {
  relationships.set(relationshipKey(a, b), { a, b, community });
}
const squaredDistance = (a: number, b: number) => (entities[a].x - entities[b].x) ** 2 + (entities[a].y - entities[b].y) ** 2;
const nearest = (entity: number, candidates: number[], count: number) => candidates
  .filter(index => index !== entity)
  .sort((a, b) => squaredDistance(entity, a) - squaredDistance(entity, b))
  .slice(0, count);

communityEntities.forEach((members, community) => {
  members.forEach((entity, index) => {
    nearest(entity, members, 3).forEach(neighbour => connect(entity, neighbour, community));
    if (index > 0 && index % 5 === 0) connect(anchors[community], entity, community);
  });
});

// Cross-community relationships join the broad company map rather than isolated islands.
[[0, 1], [0, 3], [0, 4], [1, 2], [1, 3], [2, 3], [2, 5], [3, 4], [3, 5], [4, 5]].forEach(([a, b]) => {
  const candidates = communityEntities[a].flatMap(source => communityEntities[b].map(target => ({ source, target })));
  candidates.sort((left, right) => squaredDistance(left.source, left.target) - squaredDistance(right.source, right.target));
  candidates.slice(0, 3).forEach(({ source, target }) => connect(source, target, a));
});

const workflow = anchors[3];
const primaryDependencies = [anchors[0], anchors[1], anchors[2], anchors[5]];
primaryDependencies.forEach(dependency => connect(workflow, dependency, 3));
const contextKeys = new Set<string>();
const focusedEntities = new Set([workflow, ...primaryDependencies]);

// Select actual one-hop neighbours of the workflow's dependencies. Repeated cases
// and documents remain individual entities in the selected company context.
[...primaryDependencies, workflow].forEach(dependency => {
  const neighbours = [...relationships.values()]
    .filter(edge => edge.a === dependency || edge.b === dependency)
    .map(edge => edge.a === dependency ? edge.b : edge.a)
    .filter(neighbour => !primaryDependencies.includes(neighbour) && neighbour !== workflow)
    .sort((a, b) => squaredDistance(dependency, a) - squaredDistance(dependency, b));
  neighbours.slice(0, 3).forEach(neighbour => {
    contextKeys.add(relationshipKey(dependency, neighbour));
    focusedEntities.add(neighbour);
  });
});
const focusedRelationships = [...relationships.entries()].filter(([key]) => contextKeys.has(key));
const pathBetween = (a: number, b: number) => `M${entities[a].x} ${entities[a].y}L${entities[b].x} ${entities[b].y}`;
const labels = [
  { text: "Team", x: 164, y: 101, delay: 2.65 },
  { text: "Knowledge", x: 325, y: 72, delay: 2.77 },
  { text: "Systems", x: 520, y: 181, delay: 2.89 },
];

function EntityMark({ entity, selected = false }: { entity: Entity; selected?: boolean }) {
  const radius = selected ? Math.max(entity.radius, 3.2) : entity.radius;
  if (entity.community === 1) return <rect x={entity.x - radius} y={entity.y - radius * 1.22} width={radius * 2} height={radius * 2.44} rx=".6" />;
  if (entity.community === 5) return <path d={`M${entity.x} ${entity.y - radius * 1.3}l${radius * 1.3} ${radius * 1.3}-${radius * 1.3} ${radius * 1.3}-${radius * 1.3}-${radius * 1.3}Z`} />;
  return <circle cx={entity.x} cy={entity.y} r={radius} />;
}

export function CompanyModelArt() {
  return <g className="company-context" aria-hidden="true" data-entities={entities.length} data-relationships={relationships.size}>
    <g className="model-context-map-edges">
      {communities.map((community, index) => <g className="model-context-edge-cluster" key={community.id} style={{ "--context-delay": `${.12 + index * .1}s` } as CSSProperties}>
        {[...relationships.entries()].filter(([, edge]) => edge.community === index).map(([key, edge]) =>
          <path key={key} d={pathBetween(edge.a, edge.b)} pathLength="1" />)}
      </g>)}
    </g>
    <g className="model-context-map-entities">
      {communities.map((community, index) => <g className="model-context-entity-cluster" key={community.id} style={{ "--context-delay": `${index * .12}s` } as CSSProperties}>
        {communityEntities[index].map(entity => <g className="model-context-entity" key={entities[entity].id} data-entity={entities[entity].id}>
          <EntityMark entity={entities[entity]} />
        </g>)}
      </g>)}
    </g>
    <g className="model-context-neighbourhood">
      {focusedRelationships.map(([key, edge], index) => <path
        key={key}
        className="model-context-local-edge"
        d={pathBetween(edge.a, edge.b)}
        pathLength="1"
        style={{ "--context-delay": `${2.65 + index * .045}s` } as CSSProperties}
      />)}
      {primaryDependencies.map((dependency, index) => <path
        key={dependency}
        className="model-context-primary-edge"
        d={pathBetween(workflow, dependency)}
        pathLength="1"
        style={{ "--context-delay": `${1.95 + index * .14}s` } as CSSProperties}
      />)}
      {[...focusedEntities].filter(entity => entity !== workflow).map((entity, index) => <g
        className={`model-context-focus-entity${primaryDependencies.includes(entity) ? " model-context-focus-entity--primary" : ""}`}
        key={entities[entity].id}
        style={{ "--context-delay": `${2.6 + index * .045}s` } as CSSProperties}
      ><EntityMark entity={entities[entity]} selected /></g>)}
    </g>
    <circle className="model-context-focus-ring" cx={entities[workflow].x} cy={entities[workflow].y} r="15" />
    <circle className="model-context-focus-pulse" cx={entities[workflow].x} cy={entities[workflow].y} r="24" />
    <circle className="model-context-focus" cx={entities[workflow].x} cy={entities[workflow].y} r="6.5" />
    <g className="model-context-labels">
      <text className="model-context-label model-context-label--workflow" x="307" y="271" textAnchor="end">
        <tspan x="307">Response </tspan><tspan x="307" dy="1.08em">workflow</tspan>
      </text>
      {labels.map(label => <text className="model-context-label" key={label.text} x={label.x} y={label.y} textAnchor="middle" style={{ "--context-delay": `${label.delay}s` } as CSSProperties}>{label.text}</text>)}
    </g>
  </g>;
}

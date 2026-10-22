// Builds <name>-light.svg and <name>-dark.svg next to every <dir>/diagrams/<name>.json.
// Usage: node scripts/diagrams.mjs [spec.json ...]   (no arguments: every spec in the repo)
//
// A spec is a card with boxes, arrows and labels placed at explicit pixel positions:
//   { "alt": "...", "width": 1200, "height": 420,
//     "nodes":    [{ "id", "x", "y", "w", "h", "title", "sub": ["..."], "extra": "...", "tone": "red|green|teal",
//                    "shape": "box|diamond", "accent": "teal|red|green" }],
//     "edges":    [{ "from", "fromSide", "to", "toSide", "tone": "neutral|red|green|teal", "via": [[x, y]],
//                    "label": ["..."], "labelAt": [x, y], "labelAnchor": "start|middle|end" }],
//     "labels":   [{ "x", "y", "lines": ["..."], "tone", "anchor" }],
//     "brackets": [{ "x1", "x2", "y", "text", "tone" }] }
// Sides are top, right, bottom, left. A box's accent draws its outline in a tone; its `extra` line is bold in `tone`.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';

const FONT =
  "ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const THEMES = {
  dark: {
    card: '#1c2028',
    cardStroke: '#2d333b',
    box: '#1c2028',
    boxStroke: '#8b93a1',
    title: '#ffffff',
    sub: '#aab2bf',
    tone: {
      neutral: '#e6e9ee',
      red: '#e8877a',
      green: '#86c79a',
      teal: '#6fc1c9',
    },
  },
  light: {
    card: '#f6f8fa',
    cardStroke: '#d0d7de',
    box: '#ffffff',
    boxStroke: '#8c959f',
    title: '#1f2328',
    sub: '#59636e',
    tone: {
      neutral: '#424a53',
      red: '#c9483a',
      green: '#238a53',
      teal: '#16808d',
    },
  },
};

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function anchor(n, side) {
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  return {
    top: [cx, n.y],
    bottom: [cx, n.y + n.h],
    left: [n.x, cy],
    right: [n.x + n.w, cy],
  }[side];
}

function text(x, y, s, size, weight, fill, anchorAttr = 'middle') {
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchorAttr}">${esc(s)}</text>`;
}

function render(spec, t) {
  const nodes = new Map(spec.nodes.map((n) => [n.id, n]));
  const out = [];
  const tones = (name) => t.tone[name ?? 'neutral'];

  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-label="${esc(spec.alt)}">`
  );
  out.push('<defs>');

  for (const name of Object.keys(t.tone)) {
    out.push(
      `<marker id="arrow-${name}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${t.tone[name]}"/></marker>`
    );
  }

  out.push('</defs>');
  out.push(
    `<rect x="0.5" y="0.5" width="${spec.width - 1}" height="${spec.height - 1}" rx="14" fill="${t.card}" stroke="${t.cardStroke}"/>`
  );

  for (const e of spec.edges ?? []) {
    const a = anchor(nodes.get(e.from), e.fromSide);
    const b = anchor(nodes.get(e.to), e.toSide);
    const pts = [a, ...(e.via ?? []), b];
    const color = tones(e.tone);

    out.push(
      `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" marker-end="url(#arrow-${e.tone ?? 'neutral'})"/>`
    );

    if (e.label) {
      const lines = Array.isArray(e.label) ? e.label : [e.label];
      const [lx, ly] = e.labelAt ?? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 10];

      lines.forEach((line, i) =>
        out.push(
          text(
            lx,
            ly + i * 20,
            line,
            14.5,
            400,
            color,
            e.labelAnchor ?? 'middle'
          )
        )
      );
    }
  }

  for (const n of spec.nodes) {
    const stroke = n.accent ? tones(n.accent) : t.boxStroke;
    const sw = n.accent ? 2.5 : 1.5;
    const cx = n.x + n.w / 2;
    const cy = n.y + n.h / 2;

    if (n.shape === 'diamond') {
      out.push(
        `<polygon points="${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}" fill="${t.box}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`
      );
    } else {
      out.push(
        `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10" fill="${t.box}" stroke="${stroke}" stroke-width="${sw}"/>`
      );
    }

    const lines = [{ s: n.title, size: 17, weight: 700, fill: t.title }];

    for (const s of n.sub ?? [])
      lines.push({ s, size: 14, weight: 400, fill: t.sub });
    if (n.extra)
      lines.push({ s: n.extra, size: 14, weight: 700, fill: tones(n.tone) });

    const step = 22;
    const first = cy - ((lines.length - 1) * step) / 2 + 5;

    lines.forEach((l, i) =>
      out.push(text(cx, first + i * step, l.s, l.size, l.weight, l.fill))
    );
  }

  for (const l of spec.labels ?? []) {
    l.lines.forEach((line, i) =>
      out.push(
        text(
          l.x,
          l.y + i * 20,
          line,
          14.5,
          400,
          tones(l.tone),
          l.anchor ?? 'middle'
        )
      )
    );
  }

  for (const b of spec.brackets ?? []) {
    const color = tones(b.tone);

    out.push(
      `<path d="M${b.x1} ${b.y - 8} V${b.y} H${b.x2} V${b.y - 8}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>`
    );
    out.push(text((b.x1 + b.x2) / 2, b.y + 24, b.text, 15, 600, color));
  }

  out.push('</svg>');

  return out.join('\n') + '\n';
}

function findSpecs(dir) {
  const found = [];

  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;

    const path = join(dir, name);

    if (statSync(path).isDirectory()) found.push(...findSpecs(path));
    else if (basename(dirname(path)) === 'diagrams' && name.endsWith('.json'))
      found.push(path);
  }

  return found;
}

const specs = process.argv.length > 2 ? process.argv.slice(2) : findSpecs('.');

for (const file of specs) {
  const spec = JSON.parse(readFileSync(file, 'utf8'));
  const base = file.replace(/\.json$/, '');

  for (const mode of ['light', 'dark'])
    writeFileSync(`${base}-${mode}.svg`, render(spec, THEMES[mode]));

  console.log(`built ${base}-{light,dark}.svg`);
}

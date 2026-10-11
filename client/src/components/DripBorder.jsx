import { useId } from "react";

const drips = [
  { x: 36, len: 46 },
  { x: 108, len: 66 },
  { x: 174, len: 36 },
  { x: 246, len: 58 },
  { x: 318, len: 42 },
];

const dripPath = ({ x, len }) =>
  `M${x - 20} 8 C${x - 8} 8 ${x - 6} 18 ${x - 6} 24 L${x - 6} ${len - 10} L${x + 6} ${len - 10} L${x + 6} 24 C${x + 6} 18 ${x + 8} 8 ${x + 20} 8 Z`;

export default function DripBorder({ className = "text-strawberry" }) {
  const id = "drip" + useId().replace(/:/g, "");

  return (
    <svg
      className={`block w-full h-[70px] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={id} width="360" height="70" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="360" height="10" fill="currentColor" />
          {drips.map((d) => (
            <g key={d.x} fill="currentColor">
              <path d={dripPath(d)} />
              <circle cx={d.x} cy={d.len - 9} r="9" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
import { cn } from "~/lib/utils";

const RadialChart = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 42 42"
        className="radial-chart"
      >
        {/* Background Circle */}
        <circle
          cx="21"
          cy="21"
          r="15.91549431"
          className="fill-none stroke-gray-300 stroke-[3]"
        />

        {/* Segment 1 */}
        <path
          d="M21 2.0845
             a 18.9155 18.9155 0 0 1 0 37.831
             a 18.9155 18.9155 0 0 1 0 -37.831"
          className="stroke-dasharray-[25_75] stroke-dashoffset-[25] fill-none stroke-black stroke-[3]"
        />

        {/* Segment 2 */}
        <path
          d="M21 2.0845
             a 18.9155 18.9155 0 0 1 0 37.831
             a 18.9155 18.9155 0 0 1 0 -37.831"
          className="stroke-dasharray-[35_65] stroke-dashoffset-[50] fill-none stroke-black stroke-[3]"
        />

        {/* Segment 3 */}
        <path
          d="M21 2.0845
             a 18.9155 18.9155 0 0 1 0 37.831
             a 18.9155 18.9155 0 0 1 0 -37.831"
          className="stroke-dasharray-[40_60] stroke-dashoffset-[85] fill-none stroke-black stroke-[3]"
        />

        {/* Inner Circle */}
        <circle cx="21" cy="21" r="10" className="fill-white" />

        {/* Label */}
        <text
          x="21"
          y="21"
          textAnchor="middle"
          dy="0.3em"
          className="fill-black text-sm"
        >
          50%
        </text>
      </svg>
    </div>
  );
};

export default RadialChart;

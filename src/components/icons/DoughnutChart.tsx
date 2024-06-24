import { cn } from "~/lib/utils";

const DoughnutChart = ({ className }: { className?: string }) => {
  // Data for the chart segments (percentages)
  const segments = [{ percentage: 25 }, { percentage: 35 }, { percentage: 40 }];

  // Calculate stroke-dasharray and stroke-dashoffset values for segments
  const calculateStrokeValues = () => {
    let totalPercentage = 0;
    return segments.map((segment) => {
      const { percentage } = segment;
      const dashArray = `${percentage} ${100 - percentage}`;
      const dashOffset = totalPercentage;
      totalPercentage += percentage;
      return { dashArray, dashOffset };
    });
  };

  const strokeValues = calculateStrokeValues();

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 42 42"
        className="doughnut-chart"
      >
        {/* Background Circle */}
        <circle
          cx="21"
          cy="21"
          r="15.91549431"
          className="fill-none stroke-gray-300 stroke-[3]"
        />

        {/* Doughnut Segments */}
        {strokeValues.map((value, index) => (
          <path
            key={index}
            d="M21 2.0845
               a 18.9155 18.9155 0 0 1 0 37.831
               a 18.9155 18.9155 0 0 1 0 -37.831"
            className="fill-none stroke-black stroke-[3]"
            strokeDasharray={`${value.dashArray}`}
            strokeDashoffset={`${value.dashOffset}`}
          />
        ))}

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

export default DoughnutChart;

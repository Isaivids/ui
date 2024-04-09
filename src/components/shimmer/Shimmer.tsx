import React from "react";
import "./Shimmer.scss";

interface ShimmerProps {
  count: number;
}

const Shimmer: React.FC<ShimmerProps> = ({ count }) => {
  return (
    <div className="flex flex-column gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div className="shimmer-loader" key={index}>
          <div className="shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;

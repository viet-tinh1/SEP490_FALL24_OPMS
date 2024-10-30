import { useState, useEffect } from "react";

export default function CustomRating({ count = 5, size = 24, activeColor = "#ffd700", value = 0, onChange }) {
    const [rating, setRating] = useState(value);

  const handleClick = (newRating) => {
    setRating(newRating);
    if (onChange) onChange(newRating);
  };
  useEffect(() => {
    setRating(value); // Update rating when value prop changes
  }, [value]);
  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {Array.from({ length: count }, (_, index) => (
        <svg
          key={index}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={index < rating ? activeColor : "#e0e0e0"}
          onClick={() => handleClick(index + 1)}
          style={{ cursor: "pointer" }}
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}
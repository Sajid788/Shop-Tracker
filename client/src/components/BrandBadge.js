function hashStringToHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) % 360;
  }
  return h;
}

export default function BrandBadge({ brand, size = 10 }) {
  const label = brand || "All";
  const hue = hashStringToHue(String(label));
  const color = `hsl(${hue} 90% 62%)`;
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 font-bold uppercase tracking-wider"
      style={{
        backgroundColor: `${color}22`,
        borderColor: `${color}44`,
        color,
        fontSize: size,
      }}
    >
      {label}
    </span>
  );
}

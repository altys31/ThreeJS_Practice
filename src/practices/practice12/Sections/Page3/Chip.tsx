export const Chip = ({ label, color }: { label: string; color: string }) => {
  return (
    <div className={"chip"} style={{ backgroundColor: color }}>
      {label}
    </div>
  );
};

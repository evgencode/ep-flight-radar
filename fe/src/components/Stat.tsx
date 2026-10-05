type StatProps = {
  label: string;
  value: { primary: string; secondary?: string };
};

export const Stat = ({ label, value }: StatProps) => {
  return (
    <div className="stat">
      <dt>{label}</dt>
      <dd>
        <span className="stat__primary">{value.primary}</span>
        {value.secondary && <span className="stat__secondary">{value.secondary}</span>}
      </dd>
    </div>
  );
};

import './SectionMeta.css';

type SectionMetaProps = {
  section: string;
  time: string;
};

export function SectionMeta({ section, time }: SectionMetaProps) {
  return (
    <div className="section-meta">
      <span className="label">
        <span className="label__dot" aria-hidden="true" />
        {section}
      </span>
      <span className="section-meta__time" aria-hidden="true">
        {time}
      </span>
    </div>
  );
}

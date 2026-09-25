interface Step {
  kind: "word" | "relation";
  value: string;
}

interface Props {
  history: Step[];
  onNavigate: (index: number) => void;
}

export default function Breadcrumb({ history, onNavigate }: Props) {
  if (history.length <= 1) {
    return null;
  }

  return (
    <div className="breadcrumb">
      {history.map((step, index) => {
        const isLast = index === history.length - 1;
        return (
          <span key={index} className="breadcrumb-segment">
            <button
              className={`breadcrumb-step ${step.kind} ${isLast ? "current" : ""}`}
              onClick={() => onNavigate(index)}
              disabled={isLast}
            >
              {step.value}
            </button>
            {!isLast && <span className="breadcrumb-sep">›</span>}
          </span>
        );
      })}
    </div>
  );
}

import { ProgressBar } from 'react-bootstrap';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';

export default function PasswordStrengthMeter({ password }) {
  if (!password) return null;
  const { requirements, label, variant, percent } = evaluatePasswordStrength(password);

  return (
    <div className="mt-2 mb-1">
      <ProgressBar now={percent} variant={variant} style={{ height: 6 }} className="mb-1" />
      <div className={`small text-${variant} fw-medium mb-1`}>{label}</div>
      <ul className="small text-muted mb-0 ps-3">
        {requirements.map((r) => (
          <li key={r.label} className={r.met ? 'text-success' : 'text-muted'}>
            {r.met ? '✓' : '○'} {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
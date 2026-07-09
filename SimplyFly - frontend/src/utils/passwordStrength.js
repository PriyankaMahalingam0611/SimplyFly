export function evaluatePasswordStrength(password) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;

  let label = 'Weak';
  let variant = 'danger';
  if (metCount >= 5) {
    label = 'Strong';
    variant = 'success';
  } else if (metCount >= 3) {
    label = 'Fair';
    variant = 'warning';
  }

  return { requirements, metCount, label, variant, percent: (metCount / requirements.length) * 100 };
}
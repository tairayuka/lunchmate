import { pillButton } from '../lib/theme';

export default function PrimaryButton({
  children,
  variant = 'primary',
  disabled = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  style,
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...pillButton({ variant, disabled }), ...style }}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}

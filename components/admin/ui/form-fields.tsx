import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * Form primitives shared by every admin create/edit form.
 *
 * Each wraps a native element and spreads the rest of its props through
 * unchanged, so it works equally well as a controlled input (value +
 * onChange) or an uncontrolled one read via FormData (name + defaultValue).
 */

const fieldClasses =
  "w-full bg-white/80 backdrop-blur-sm border border-slate/20 hover:border-slate/40 focus:bg-white focus:border-navy-deep focus:ring-[3px] focus:ring-navy-deep/10 rounded-radius-lg px-4 py-3 min-h-[48px] text-navy-deep font-body text-body-md transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed outline-none shadow-[0_2px_4px_rgba(11,30,58,0.02)]";

function FieldShell({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col group relative">
      <label htmlFor={htmlFor} className="block font-body font-medium text-navy-deep text-sm mb-2 transition-colors group-focus-within:text-navy-deep">
        {label} {required && <span className="text-red-signal">*</span>}
      </label>
      <div className="relative relative-z-10">
        {children}
      </div>
      {hint && !error && <p className="mt-2 text-slate text-xs font-medium tracking-wide animate-admin-fade-in">{hint}</p>}
      {error && <p className="mt-2 text-red-signal text-xs font-semibold tracking-wide animate-admin-fade-in">{error}</p>}
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

export function TextField({ label, required, hint, error, id, className = "", ...rest }: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} error={error}>
      <input id={id} className={`${fieldClasses} ${className}`} {...rest} />
    </FieldShell>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

export function TextAreaField({
  label,
  required,
  hint,
  error,
  id,
  className = "",
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} error={error}>
      <textarea id={id} className={`${fieldClasses} resize-y min-h-[100px] leading-relaxed ${className}`} {...rest} />
    </FieldShell>
  );
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
};

export function SelectField({
  label,
  required,
  hint,
  error,
  id,
  className = "",
  children,
  ...rest
}: SelectFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} error={error}>
      <select id={id} className={`${fieldClasses} appearance-none pr-10 cursor-pointer ${className}`} {...rest}>
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </FieldShell>
  );
}

/** iOS-style toggle switch, used for the Aktif/Nonaktif product flag. */
export function ToggleField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-4 cursor-pointer group">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div
        className={`
          relative shrink-0 w-14 h-7 rounded-full bg-slate/20 transition-colors duration-300
          peer
          peer-focus:ring-4 peer-focus:ring-navy-deep/20
          peer-checked:bg-navy-deep
          peer-checked:after:translate-x-[28px]
          after:content-[''] after:absolute after:top-[4px] after:left-[4px]
          after:bg-white after:rounded-full after:h-5 after:w-5
          after:shadow-sm after:transition-all after:duration-300
        `}
      />
      <span className="font-body font-medium text-navy-deep text-sm group-hover:text-navy-base transition-colors">
        {label}
      </span>
    </label>
  );
}

export { fieldClasses };

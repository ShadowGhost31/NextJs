"use client";

export default function ConfirmForm({
  action,
  confirmText,
  className,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  confirmText: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
    </form>
  );
}

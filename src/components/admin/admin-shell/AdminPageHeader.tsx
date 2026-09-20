type AdminPageHeaderProps = {
  title: string;
  description?: string;
};

export const AdminPageHeader = ({
  title,
  description,
}: AdminPageHeaderProps) => (
  <header className="flex flex-col gap-1">
    <h1 className="text-2xl font-bold text-ink lg:text-3xl">{title}</h1>

    {description && <p className="text-ink-muted">{description}</p>}

    <span className="mt-2 h-1 w-16 rounded-full bg-brand-yellow-500" />
  </header>
);

interface LayoutProps {
  params: { path: string };
  children: React.ReactNode;
}

export default function Layout({ params, children }: LayoutProps) {
  return (
    <>
      <div>{params.path}</div>
      {children}
    </>
  );
}

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";

interface LayoutProps {
  params: { path: string[] };
  children: React.ReactNode;
}

export default function Layout({ params, children }: LayoutProps) {
  const path = params.path.join("/");

  const render = (
    key: number,
    content: string,
    path: string,
    last: boolean,
  ) => {
    if (content === "/") {
      return <BreadcrumbSeparator key={key} />;
    } else if (last) {
      return <BreadcrumbPage key={key}>{content}</BreadcrumbPage>;
    } else {
      return (
        <BreadcrumbItem key={key}>
          <BreadcrumbLink href={`/${path}`}>{content}</BreadcrumbLink>
        </BreadcrumbItem>
      );
    }
  };

  const paths = path.split(/(\/)/g);
  // paths = ["about", "/", "me"] => cumpaths = ["about", "about/me"]
  const cumpaths = paths
    .map((_, index) => paths.slice(0, index + 1).join(""))
    .filter((path) => path !== "");

  return (
    <div className="p-4">
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((part, index) =>
            render(index, part, cumpaths[index], index === paths.length - 1),
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}

import { cn } from "~/lib/utils";
interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}
export default function LayoutContainer({
  children,
  className,
}: LayoutContainerProps) {
  return (
    <div
      className={cn(
        `m-8 space-y-5 `,
        className
      )}
    >
      {children}
    </div>
  );
}

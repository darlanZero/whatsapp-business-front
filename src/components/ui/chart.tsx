
import { ResponsiveContainer } from "recharts";

function Chart({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children as React.ReactElement}
    </ResponsiveContainer>
  );
}

export { Chart };
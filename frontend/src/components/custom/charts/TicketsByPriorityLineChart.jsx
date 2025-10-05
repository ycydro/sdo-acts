import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart with a label";
const chartData = [
  { month: "Low", tickets: 186 },
  { month: "Medium", tickets: 305 },
  { month: "High", tickets: 237 },
];

const chartConfig = {
  tickets: {
    label: "Tickets",
    color: "var(--chart-1)",
  },
};

const colorMap = {
  Low: "var(--chart-low)",
  Medium: "var(--chart-medium)",
  High: "var(--chart-high)",
};

export default function TestChart() {
  return (
    <Card className="flex-1">
      <CardHeader className="p-4">
        <CardTitle>Tickets by Priority (Weekly)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="tickets" radius={8}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colorMap[entry.month]} />
              ))}

              <LabelList
                dataKey="tickets"
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

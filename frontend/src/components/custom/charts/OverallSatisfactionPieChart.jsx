"use client";

import { Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--chart-very-satisfied)" },
  { browser: "safari", visitors: 200, fill: "var(--chart-satisfied)" },
  { browser: "firefox", visitors: 187, fill: "var(--chart-neutral)" },
  { browser: "edge", visitors: 173, fill: "var(--chart-dissatisfied)" },
  { browser: "other", visitors: 90, fill: "var(--chart-very-dissatisfied)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Very Satisfied",
    color: "var(--chart-very-satisfied)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-satisfied)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-neutral)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-dissatisfied)",
  },
  other: {
    label: "Other",
    color: "var(--chart-very-dissatisfied)",
  },
};

export default function MyChart() {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="items-center p-4 pb-0">
        <CardTitle>Customer Satisfaction</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[300px] w-full"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="visitors"
              paddingAngle={5}
              innerRadius={50}
              outerRadius={100}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

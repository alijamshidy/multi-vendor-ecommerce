"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const MOCK_MONTHLY_SALES = [
  { month: "Jan", sales: 4200 },
  { month: "Feb", sales: 3800 },
  { month: "Mar", sales: 5100 },
  { month: "Apr", sales: 4600 },
  { month: "May", sales: 6200 },
  { month: "Jun", sales: 5800 },
  { month: "Jul", sales: 7100 },
  { month: "Aug", sales: 6900 },
  { month: "Sep", sales: 5400 },
  { month: "Oct", sales: 6100 },
  { month: "Nov", sales: 7300 },
  { month: "Dec", sales: 8200 },
];

const chartConfig = {
  sales: { label: "Sales", color: "hsl(var(--primary))" },
};

export default function DashboardSalesChart() {
  const t = useTranslations("dashboardChart");

  return (
    <Card className="rounded-md">
      <CardHeader>
        <CardTitle>{t("monthlySales")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-[16/7] w-full">
          <BarChart data={MOCK_MONTHLY_SALES}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="sales"
              fill="var(--color-sales)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client"
import { TrendingUp } from "lucide-react"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const description = "A radar chart"



export function TestChart({ teamName, teamNumber, teamValue, final, auto, base }: { teamName: string, teamNumber: string, teamValue: number, final: number, auto: number, base: number }) {

const chartData = [
  { area: "Final Average", score: final },
  { area: "Auto Average", score: auto },
  { area: "Base Average", score: base },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

  return (


    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="items-center pb-4">
        <CardTitle>TEAM {teamNumber}</CardTitle>
        <CardDescription>
          {teamName} is a great team
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel={true} hideIndicator={true} />} />
            <PolarAngleAxis dataKey="area" />
            <PolarGrid />
            <Radar
              dataKey="scale"
              fill="var(--color-desktop)"
              fillOpacity={0}
            />
            <Radar
              dataKey="scoreValue"
              fill="var(--color-desktop)"
              fillOpacity={1}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-xs">
        Average Score: {teamValue} 
        </div>

      </CardFooter>
    </Card>










  )
}

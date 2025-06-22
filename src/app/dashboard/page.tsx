import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockUser, mockClasses } from "@/lib/mock-data";
import { CheckCircle, Medal, BarChart } from "lucide-react";

export default function DashboardPage() {
  const nextClass = mockClasses[0];

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {mockUser.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's your training summary. Let's get to work.
        </p>
      </div>

      <Card className="bg-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-primary" />
            <span>Next Class Check-in</span>
          </CardTitle>
          <CardDescription>
            Your next class is starting soon. Check in to mark your attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">{nextClass.name}</p>
              <p className="text-muted-foreground">
                {nextClass.time} with {nextClass.instructor}
              </p>
            </div>
            <Button size="lg" className="w-full sm:w-auto">
              Check-in Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Rank Progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {mockUser.belt} Belt, {mockUser.stripes} Stripes
                </span>
                <span className="text-muted-foreground">
                  {mockUser.nextGraduationProgress}%
                </span>
              </div>
              <Progress value={mockUser.nextGraduationProgress} />
              <p className="text-xs text-muted-foreground">
                Progress towards your next stripe/belt.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart />
              <span>Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-baseline justify-center gap-2">
                <p className="text-4xl font-bold">{mockUser.attendance.lastMonth}</p>
                <p className="text-sm text-muted-foreground">classes last month</p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
                Total attendance: {mockUser.attendance.total} classes
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle>Training Focus</CardTitle>
                <CardDescription>Based on your recent classes</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <span className="text-primary">●</span> Spider Guard Sweeps
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-primary">●</span> Triangle Choke Setups
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-primary">●</span> Mount Escapes
                    </li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockClasses } from "@/lib/mock-data";
import { Clock } from "lucide-react";

export default function SchedulePage() {
  const adultClasses = mockClasses.filter((c) => c.category === "Adults");
  const kidsClasses = mockClasses.filter((c) => c.category === "Kids");

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
        <p className="text-muted-foreground">
          Find your next class and plan your week.
        </p>
      </div>

      <Tabs defaultValue="adults" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="adults">Adults</TabsTrigger>
          <TabsTrigger value="kids">Kids</TabsTrigger>
        </TabsList>
        <TabsContent value="adults">
          <Card>
            <CardHeader>
              <CardTitle>Adults Classes</CardTitle>
              <CardDescription>
                Schedule for all adult Gi and No-Gi classes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {adultClasses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.instructor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kids">
          <Card>
            <CardHeader>
              <CardTitle>Kids Classes</CardTitle>
              <CardDescription>
                Fun and safe jiu-jitsu classes for the little ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {kidsClasses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.instructor}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

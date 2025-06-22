import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUser, mockAttendanceHistory, beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";

export default function ProfilePage() {
  const beltStyle = beltColors[mockUser.belt] || beltColors.White;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-start gap-4 md:flex-row">
        <Avatar className="h-24 w-24 border-2 border-primary">
          <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
          <AvatarFallback className="text-3xl">
            {mockUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{mockUser.name}</h1>
          <p className="text-muted-foreground">{mockUser.email}</p>
          <p className="text-sm text-muted-foreground">
            {mockUser.affiliation}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              className={cn(
                "px-4 py-1 text-sm font-semibold shadow-md",
                beltStyle.bg,
                beltStyle.text
              )}
            >
              {mockUser.belt} Belt
            </Badge>
            <div className="flex gap-1">
              {Array.from({ length: mockUser.stripes }).map((_, i) => (
                <div key={i} className="h-4 w-1 bg-white" />
              ))}
            </div>
          </div>
        </div>
        <Button>Edit Profile</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal />
              <span>Graduation Progress</span>
            </CardTitle>
            <CardDescription>
              Track your journey to the next level.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Towards Next Stripe/Belt</span>
                <span>{mockUser.nextGraduationProgress}%</span>
              </div>
              <Progress value={mockUser.nextGraduationProgress} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {mockUser.attendance.total}
                </p>
                <p className="text-sm text-muted-foreground">Total Classes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockUser.attendance.lastMonth}
                </p>
                <p className="text-sm text-muted-foreground">Classes This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Role:</span>
                <span className="capitalize">{mockUser.role}</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Member Since:</span>
                <span>Jan 2022</span>
            </div>
             <div className="flex justify-between">
                <span className="font-medium text-muted-foreground">Emergency Contact:</span>
                <span>(555) 000-1111</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            Your recent class check-ins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttendanceHistory.map((item) => (
                <TableRow key={item.date}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.class}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        item.status === "Present" ? "default" : "destructive"
                      }
                      className={cn(
                        item.status === "Present" && "bg-green-500/20 text-green-300 border-green-500/30"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

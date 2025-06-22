import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockInstructors, beltColors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function InstructorsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Our Professors</h1>
        <p className="text-muted-foreground">
          Learn from the best in the game.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockInstructors.map((instructor) => {
          const beltStyle =
            beltColors[instructor.belt] || beltColors.White;
          return (
            <Card key={instructor.id} className="flex flex-col">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage
                    src={instructor.avatar}
                    alt={instructor.name}
                  />
                  <AvatarFallback className="text-3xl">
                    {instructor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <CardTitle>{instructor.name}</CardTitle>
                  <div className="mt-2">
                    <Badge
                      className={cn(
                        "px-3 py-0.5 text-xs font-semibold",
                        beltStyle.bg,
                        beltStyle.text
                      )}
                    >
                      {instructor.belt} Belt
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription>{instructor.bio}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

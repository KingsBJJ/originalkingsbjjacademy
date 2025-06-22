import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockBranches } from "@/lib/mock-data";
import { Clock, MapPin, Phone } from "lucide-react";

export default function BranchesPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Our Academies</h1>
        <p className="text-muted-foreground">
          Find a Kings BJJ location near you.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="aspect-video w-full">
             <Image
                src={mockBranches[0].mapImage}
                alt="Map of all branches"
                width={1200}
                height={600}
                className="h-full w-full object-cover"
                data-ai-hint="world map"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {mockBranches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <CardTitle>{branch.name}</CardTitle>
              <CardDescription>{branch.address}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{branch.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{branch.hours}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

originalkingsbjj
.idea
.idx
.next
.vscode
android
docs
functions
kings-bjj-functions
node_modules
out
public
src
ai
app
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/lib/mock-data';
import { getInstructors } from '@/lib/firestoreService';

export async function InstructorsGrid({ user }: { user: User }) {
  const instructors = await getInstructors();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {instructors.map((instructor) => (
        <Card key={instructor.id}>
          <CardHeader>
            <CardTitle>{instructor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {instructor.email}</p>
            <p>Telefone: {instructor.phone}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

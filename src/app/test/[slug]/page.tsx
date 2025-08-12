// app/test/[slug]/page.tsx
            type Props = {
              params: { slug: string };
              searchParams?: { [key: string]: string | string[] | undefined };
            };

            export default function TestSlugPage({ params }: Props) {
              return (
                <div>
                  <h1>Slug Page</h1>
                  <p>Slug: {params.slug}</p>
                </div>
              );
            }
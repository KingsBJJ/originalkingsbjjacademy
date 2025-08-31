// app/test/[slug]/page.tsx
type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Generate static params for static export
export async function generateStaticParams() {
  return [
    { slug: 'example' },
    { slug: 'test' },
  ];
}

export default function TestSlugPage({ params }: Props) {
  return (
    <div>
      <h1>Slug Page</h1>
      <p>Slug: {params.slug}</p>
    </div>
  );
}
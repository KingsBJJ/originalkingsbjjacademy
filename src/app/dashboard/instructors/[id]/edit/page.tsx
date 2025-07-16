import { Metadata } from 'next';

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Instructor ${params.id}`,
  };
}

export default function Page({ params }: PageProps) {
  return <div>ID: {params.id}</div>;
}
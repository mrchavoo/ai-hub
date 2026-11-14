import type { Metadata } from 'next';
import toolsData from '@/app/data/tools.json';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug);

  if (!tool) {
    return {
      title: 'Araç Bulunamadı - AI Hub',
    };
  }

  return {
    title: `${tool.name} Nedir? Ücretsiz mi, Türkçe Desteği Var mı? - AI Hub`,
    description: `${tool.shortDescription} (${tool.pricingModel})`,
  };
}

export default function ToolLayout({ children }: Props) {
  return <>{children}</>;
}
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WysiwygEditor } from '@/components/dashboard/WysiwygEditor';
import { toast } from 'sonner';
import { Loader2, Save, Globe } from 'lucide-react';

interface ContentSection {
  id?: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  metadata: any;
}

const defaultSections = [
  { key: 'hero', label: 'Hero / Banner Principal' },
  { key: 'about', label: 'Sobre' },
  { key: 'services_previdenciario', label: 'Serviços - Previdenciário' },
  { key: 'services_aereo', label: 'Serviços - Direito Aéreo' },
  { key: 'contact', label: 'Contato' },
  { key: 'footer', label: 'Rodapé' },
];

export function AdminContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<Record<string, ContentSection>>({});
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from('website_content')
      .select('*');

    if (data) {
      const sectionsMap: Record<string, ContentSection> = {};
      data.forEach((item) => {
        sectionsMap[item.section_key] = item;
      });

      // Initialize missing sections
      defaultSections.forEach(({ key }) => {
        if (!sectionsMap[key]) {
          sectionsMap[key] = {
            section_key: key,
            title: '',
            content: '',
            image_url: '',
            metadata: {},
          };
        }
      });

      setSections(sectionsMap);
    }
    setLoading(false);
  };

  const updateSection = (key: string, field: keyof ContentSection, value: any) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const saveSection = async (key: string) => {
    setSaving(true);
    const section = sections[key];

    const data = {
      section_key: key,
      title: section.title,
      content: section.content,
      image_url: section.image_url,
      metadata: section.metadata || {},
      updated_by: user?.id,
    };

    let error;
    if (section.id) {
      ({ error } = await supabase
        .from('website_content')
        .update(data)
        .eq('id', section.id));
    } else {
      ({ error } = await supabase.from('website_content').insert(data));
    }

    if (error) {
      toast.error('Erro ao salvar conteúdo');
    } else {
      toast.success('Conteúdo salvo com sucesso!');
      fetchContent();
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Conteúdo</h1>
        <p className="text-muted-foreground mt-1">
          Edite textos e imagens do site
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Seções do Site
          </CardTitle>
          <CardDescription>
            Selecione uma seção para editar seu conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-2 mb-6">
              {defaultSections.map(({ key, label }) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {defaultSections.map(({ key, label }) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={sections[key]?.title || ''}
                      onChange={(e) => updateSection(key, 'title', e.target.value)}
                      className="mt-1"
                      placeholder={`Título para ${label}`}
                    />
                  </div>
                  <div>
                    <Label>URL da Imagem</Label>
                    <Input
                      value={sections[key]?.image_url || ''}
                      onChange={(e) => updateSection(key, 'image_url', e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Conteúdo</Label>
                  <div className="mt-1">
                    <WysiwygEditor
                      content={sections[key]?.content || ''}
                      onChange={(content) => updateSection(key, 'content', content)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection(key)} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar {label}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

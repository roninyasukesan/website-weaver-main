import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Save, Search } from 'lucide-react';

interface SEOSettings {
  id?: string;
  page_path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_image: string | null;
}

const defaultPages = [
  { path: '/', label: 'Página Inicial' },
  { path: '/blog', label: 'Blog' },
  { path: '/auth', label: 'Login' },
];

export function AdminSEO() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seoSettings, setSeoSettings] = useState<Record<string, SEOSettings>>({});
  const [activeTab, setActiveTab] = useState('/');

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    const { data } = await supabase.from('seo_settings').select('*');

    if (data) {
      const settingsMap: Record<string, SEOSettings> = {};
      data.forEach((item) => {
        settingsMap[item.page_path] = item;
      });

      // Initialize missing pages
      defaultPages.forEach(({ path }) => {
        if (!settingsMap[path]) {
          settingsMap[path] = {
            page_path: path,
            title: '',
            description: '',
            keywords: '',
            og_image: '',
          };
        }
      });

      setSeoSettings(settingsMap);
    }
    setLoading(false);
  };

  const updateSetting = (path: string, field: keyof SEOSettings, value: string) => {
    setSeoSettings((prev) => ({
      ...prev,
      [path]: {
        ...prev[path],
        [field]: value,
      },
    }));
  };

  const saveSEO = async (path: string) => {
    setSaving(true);
    const settings = seoSettings[path];

    const data = {
      page_path: path,
      title: settings.title,
      description: settings.description,
      keywords: settings.keywords,
      og_image: settings.og_image,
      updated_by: user?.id,
    };

    let error;
    if (settings.id) {
      ({ error } = await supabase
        .from('seo_settings')
        .update(data)
        .eq('id', settings.id));
    } else {
      ({ error } = await supabase.from('seo_settings').insert(data));
    }

    if (error) {
      toast.error('Erro ao salvar configurações de SEO');
    } else {
      toast.success('SEO atualizado com sucesso!');
      fetchSEOSettings();
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
        <h1 className="text-3xl font-bold">Configurações de SEO</h1>
        <p className="text-muted-foreground mt-1">
          Otimize seu site para mecanismos de busca
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Meta Tags por Página
          </CardTitle>
          <CardDescription>
            Configure título, descrição e palavras-chave para cada página
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              {defaultPages.map(({ path, label }) => (
                <TabsTrigger key={path} value={path}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {defaultPages.map(({ path, label }) => (
              <TabsContent key={path} value={path} className="space-y-4">
                <div>
                  <Label>Título da Página</Label>
                  <Input
                    value={seoSettings[path]?.title || ''}
                    onChange={(e) => updateSetting(path, 'title', e.target.value)}
                    className="mt-1"
                    placeholder="Ex: Keliane Machado - Advogada Especialista"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(seoSettings[path]?.title || '').length}/60 caracteres
                  </p>
                </div>

                <div>
                  <Label>Meta Descrição</Label>
                  <Textarea
                    value={seoSettings[path]?.description || ''}
                    onChange={(e) => updateSetting(path, 'description', e.target.value)}
                    className="mt-1"
                    placeholder="Descrição breve da página para aparecer nos resultados de busca"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(seoSettings[path]?.description || '').length}/160 caracteres
                  </p>
                </div>

                <div>
                  <Label>Palavras-chave</Label>
                  <Input
                    value={seoSettings[path]?.keywords || ''}
                    onChange={(e) => updateSetting(path, 'keywords', e.target.value)}
                    className="mt-1"
                    placeholder="advogado, previdenciário, direito aéreo, indenização"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separe as palavras-chave por vírgulas
                  </p>
                </div>

                <div>
                  <Label>Imagem Open Graph</Label>
                  <Input
                    value={seoSettings[path]?.og_image || ''}
                    onChange={(e) => updateSetting(path, 'og_image', e.target.value)}
                    className="mt-1"
                    placeholder="https://... (imagem para compartilhamento em redes sociais)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 1200x630 pixels
                  </p>
                </div>

                {/* Preview */}
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2">Prévia no Google:</p>
                  <div className="space-y-1">
                    <p className="text-blue-600 text-lg hover:underline cursor-pointer line-clamp-1">
                      {seoSettings[path]?.title || `${label} - Seu Site`}
                    </p>
                    <p className="text-green-700 text-sm">
                      seusite.com{path === '/' ? '' : path}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {seoSettings[path]?.description ||
                        'Adicione uma descrição para esta página...'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSEO(path)} disabled={saving}>
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar SEO
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

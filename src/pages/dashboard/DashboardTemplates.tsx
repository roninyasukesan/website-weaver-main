import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FileText, Loader2, Copy, Download, Sparkles } from 'lucide-react';
import { legalTemplates, LegalTemplate } from '@/data/legalTemplates';
import { resourceBankDocuments } from '@/data/resourceBankDocuments';

export default function DashboardTemplates() {
  const { isApproved } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<LegalTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTemplateSelect = (template: LegalTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedDoc('');
    setDialogOpen(true);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    const missing = selectedTemplate.fields.filter(f => f.required && !formData[f.key]);
    if (missing.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${missing.map(f => f.label).join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setGeneratedDoc('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const systemPrompt = `Você é um assistente jurídico specializing in drafting Brazilian legal documents. Generate complete, properly formatted legal documents in Portuguese Brazil. Include all standard legal clauses and use proper legal terminology.`;

      const userPrompt = selectedTemplate.generatePrompt(formData);

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) throw new Error('Erro ao gerar documento');

      const data = await response.json();
      setGeneratedDoc(data.content || '');
      toast.success('Documento gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar documento. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDoc);
    toast.success('Documento copiado!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedDoc], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyResource = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Modelo demo copiado!');
  };

  const handleDownloadResource = (id: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isApproved) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Conta pendente de aprovação</h3>
            <p className="text-muted-foreground">
              Sua conta ainda está aguardando aprovação. Entre em contato com o escritório.
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Documentos Jurídicos</h1>
          <p className="text-muted-foreground mt-1">
            Gere documentos personalizados com ajuda de IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Banco de Recursos (Demo)</CardTitle>
            <CardDescription>
              Modelos prontos para copiar e usar como base no escritório
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resourceBankDocuments.map((resource) => (
              <div key={resource.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      <span>{resource.icon}</span>
                      <span>{resource.title}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{resource.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyResource(resource.content)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadResource(resource.id, resource.content)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
                <div className="mt-3 bg-muted rounded-md p-3 text-xs whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                  {resource.content}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {legalTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleTemplateSelect(template)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate?.name}
              </DialogTitle>
            </DialogHeader>

            {selectedTemplate && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {selectedTemplate.fields.map((field) => (
                    <div key={field.key}>
                      <Label htmlFor={field.key}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {field.type === 'textarea' ? (
                        <Textarea
                          id={field.key}
                          value={formData[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          type={field.type === 'date' ? 'date' : 'text'}
                          value={formData[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Gerando documento...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Gerar com IA
                    </>
                  )}
                </Button>

                {generatedDoc && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-1" />
                        Baixar
                      </Button>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                      {generatedDoc}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

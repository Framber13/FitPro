"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { faqContent, guides } from "@/lib/default-data"
import { HelpCircle, BookOpen, MessageCircleQuestion } from "lucide-react"

export function HelpModule() {
  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground font-sans">Centro de Ayuda</h1>
        <p className="text-xs text-muted-foreground font-sans">
          Guias educativas y preguntas frecuentes
        </p>
      </div>

      <Tabs defaultValue="faq">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="faq" className="flex-1 gap-1 font-sans">
            <MessageCircleQuestion className="h-3.5 w-3.5" />
            FAQ
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex-1 gap-1 font-sans">
            <BookOpen className="h-3.5 w-3.5" />
            Guias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card className="border-border bg-card">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
                <HelpCircle className="h-4 w-4 text-primary" />
                Preguntas Frecuentes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <Accordion type="single" collapsible className="w-full">
                {faqContent.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-sans text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground font-sans leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides">
          <div className="flex flex-col gap-3">
            {guides.map((guide, i) => (
              <Card key={i} className="border-border bg-card">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {guide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    {guide.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Formulas Reference */}
      <Card className="mt-4 mb-6 border-border bg-card">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-sm font-sans text-foreground">Formulas Utilizadas</CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 text-xs font-sans">
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">IMC (Indice de Masa Corporal)</p>
              <p className="text-muted-foreground font-mono text-[10px] mt-1">
                {'IMC = peso(kg) / altura(m)^2'}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">TMB (Mifflin-St Jeor)</p>
              <p className="text-muted-foreground font-mono text-[10px] mt-1">
                {'H: 10*peso + 6.25*altura - 5*edad + 5'}
              </p>
              <p className="text-muted-foreground font-mono text-[10px]">
                {'M: 10*peso + 6.25*altura - 5*edad - 161'}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">1RM (Epley)</p>
              <p className="text-muted-foreground font-mono text-[10px] mt-1">
                {'1RM = peso * (1 + reps / 30)'}
              </p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="font-semibold text-foreground">TDEE</p>
              <p className="text-muted-foreground font-mono text-[10px] mt-1">
                {'TDEE = TMB * Factor de Actividad'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getProfile, saveProfile } from "@/lib/store"
import { supplementInfo } from "@/lib/default-data"
import type { UserProfile } from "@/lib/types"
import { Pill, Check, Info, Zap } from "lucide-react"

export function SupplementsModule() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(getProfile())
  }, [])

  if (!profile) return null

  const toggleSupplement = (id: string) => {
    const supplements = profile.supplements.includes(id)
      ? profile.supplements.filter((s) => s !== id)
      : [...profile.supplements, id]

    const usesSupplements = supplements.length > 0
    const updated = { ...profile, supplements, usesSupplements }
    saveProfile(updated)
    setProfile(updated)
  }

  // Calculate extra protein from whey
  const usesWhey = profile.supplements.includes("whey")
  const wheyInfo = supplementInfo.find((s) => s.id === "whey")
  const extraProtein = usesWhey && wheyInfo ? wheyInfo.proteinPerScoop * 2 : 0

  return (
    <div className="mx-auto max-w-lg px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground font-sans">Suplementos</h1>
        <p className="text-xs text-muted-foreground font-sans">
          Selecciona los suplementos que utilizas
        </p>
      </div>

      {/* Active supplements count */}
      {profile.supplements.length > 0 && (
        <Card className="mb-4 border-border bg-primary/5">
          <CardContent className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground font-sans">
                {profile.supplements.length} suplemento{profile.supplements.length > 1 ? "s" : ""} activo{profile.supplements.length > 1 ? "s" : ""}
              </span>
            </div>
            {usesWhey && (
              <Badge variant="secondary" className="text-[10px] font-sans">
                +{extraProtein}g proteina/dia
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Supplement Cards */}
      <div className="flex flex-col gap-3 mb-6">
        {supplementInfo.map((supp) => {
          const isActive = profile.supplements.includes(supp.id)

          return (
            <Card
              key={supp.id}
              className={`border-border transition-colors ${isActive ? "bg-card border-primary/30" : "bg-card"}`}
            >
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-sans text-foreground">
                    <Pill className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    {supp.name}
                    {isActive && <Check className="h-3 w-3 text-primary" />}
                  </CardTitle>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => toggleSupplement(supp.id)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground font-sans mb-2 leading-relaxed">
                  {supp.description}
                </p>
                <div className="flex flex-col gap-1.5 mb-2">
                  {supp.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs font-sans text-foreground">
                      <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 rounded bg-secondary px-2 py-1">
                  <Info className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground font-sans">
                    Dosis: {supp.dosage}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Whey protein adjustment notice */}
      {usesWhey && (
        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-foreground font-sans">
                  Ajuste de Proteina
                </p>
                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  Al usar Whey Protein (~2 scoops/dia), se agregan aproximadamente {extraProtein}g
                  de proteina a tu ingesta diaria. Esto se refleja automaticamente en tu
                  planificacion nutricional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

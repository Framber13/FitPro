import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Dumbbell, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Dumbbell className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-sans">FitPro</h1>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-sans text-foreground">
              Registro Exitoso
            </CardTitle>
            <CardDescription className="font-sans">
              Revisa tu email para confirmar tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground font-sans mb-4">
              Te hemos enviado un email de confirmacion. Haz clic en el enlace
              del email para activar tu cuenta y empezar a usar FitPro.
            </p>
            <Link
              href="/auth/login"
              className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 font-sans"
            >
              Volver a Iniciar Sesion
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

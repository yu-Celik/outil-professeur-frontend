import { LoginForm } from "@/components/organisms/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <LoginForm />

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Compte de test :</p>
          <p className="mt-1 font-mono text-xs">teacher@test.com / Test1234</p>
        </div>
      </div>
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <SignIn routing="path" path="/login" forceRedirectUrl="/land" />
        </div>
    );
}

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
            <SignUp routing="path" path="/signup" forceRedirectUrl="/onboarding" />
        </div>
    );
}

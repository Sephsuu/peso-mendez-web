import { Suspense } from "react";
import { VerifyEmailPage } from '@/features/auth/VerifyEmailPage'

export default function VerifyEmail() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmailPage />
        </Suspense>
    );
}

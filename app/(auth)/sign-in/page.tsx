import { AuthForm } from '@/components/AuthForm'
import { AuthSidebar } from '@/components/AuthSidebar'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex">
            <AuthSidebar />
            <AuthForm type="sign-in" />
        </div>
    )
}
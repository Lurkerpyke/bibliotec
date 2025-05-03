import { AuthForm } from '@/components/AuthForm'
import { AuthSidebar } from '@/components/AuthSidebar'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex">
            <AuthSidebar />
            <AuthForm type="sign-up" />
        </div>
    )
}
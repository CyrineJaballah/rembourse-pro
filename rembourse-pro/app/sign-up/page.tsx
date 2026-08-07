import { redirect } from 'next/navigation'

export default function SignUpPage() {
  // Public registration is disabled; only Admins can create users from the admin panel.
  redirect('/sign-in')
}

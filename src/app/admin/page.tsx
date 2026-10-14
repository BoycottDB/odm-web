import { redirect } from 'next/navigation';

// Le middleware renvoie vers /admin/login sans cookie admin valide
export default function AdminPage() {
  redirect('/admin/moderation');
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DirigeantCreateRequest } from '@/types';
import AdminNavigation from '@/components/admin/AdminNavigation';
import DirigeantForm from '@/components/admin/DirigeantForm';

export default function CreateDirigeantPage() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSave = async (data: DirigeantCreateRequest) => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/dirigeants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      const newDirigeant = await response.json();
      setMessage({ type: 'success', text: 'Dirigeant créé avec succès' });
      
      // Redirection vers la page de détail du dirigeant
      setTimeout(() => {
        router.push(`/admin/dirigeants/${newDirigeant.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Erreur création dirigeant:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Erreur lors de la création' 
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminNavigation />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => router.push('/admin/dirigeants')}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="heading-hero font-bold text-neutral-900">Nouveau dirigeant controversé</h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-success-light border border-success text-success' 
              : 'bg-error-light border border-error text-error'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg border border-neutral p-6">
          <h2 className="body-large font-semibold text-neutral-900 mb-4">
            Informations du dirigeant
          </h2>
          <p className="body-small text-neutral-600 mb-6">
            Créez un nouveau dirigeant controversé. Vous pourrez ensuite le lier à une ou plusieurs marques.
          </p>
          
          <DirigeantForm
            onSave={handleSave}
            isLoading={saving}
            isEditing={false}
          />
        </div>
      </div>
    </div>
  );
}
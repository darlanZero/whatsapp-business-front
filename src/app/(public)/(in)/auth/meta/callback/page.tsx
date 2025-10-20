'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handleMetaCallback } from '@/hooks/use-login';
import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/utils/cookies-keys';
import { toast } from 'react-toastify';
import { SimpleLoader } from '@/components/simple-loader';

export default function MetaCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Erro ao autenticar com Meta');
        router.push('/login');
        return;
      }

      if (token) {
        try {
          console.log('Token recebido, salvando...')
          Cookies.set(TOKEN_KEY, token, {expires: 7});
          toast.success('Autenticação com Meta realizada com sucesso!');
          setTimeout(() => {
            router.push('/dashboard')
          }, 500)
      } catch (e) {
          toast.error('Erro ao processar o token de autenticação.');
          console.error(e);
          router.push('/login');
        }
      } else {
        toast.error('Token de autenticação não encontrado no callback.');
        router.push('/login');
      }
    };

    processCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <SimpleLoader className="w-8 h-8 mx-auto mb-4" />
        <p className="text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
}
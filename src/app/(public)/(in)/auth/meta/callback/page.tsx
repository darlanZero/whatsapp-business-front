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
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('Erro ao autenticar com Meta');
        router.push('/login');
        return;
      }

      if (code) {
        try {
          const token = await handleMetaCallback(code);
          
          if (token) {
            Cookies.set(TOKEN_KEY, token);
            toast.success('Login efetuado com sucesso!');
            router.push('/dashboard');
          } else {
            toast.error('Erro ao processar autenticação');
            router.push('/login');
          }
        } catch (error) {
          console.error('Callback error:', error);
          toast.error('Erro ao processar autenticação');
          router.push('/login');
        }
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
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="mt-auto py-4 text-white text-center">
      <div className="text-xs mb-2">TODOS OS DIREITOS RESERVADOS</div>
      <div className="flex justify-center space-x-4 text-xs">
        <Link
          href="/privacy"
          className="text-salvazap-lighter-blue hover:text-salvazap-hover-blue"
        >
          Política de Privacidade
        </Link>
        <span>-</span>
        <Link
          href="/terms"
          className="text-salvazap-lighter-blue hover:text-salvazap-hover-blue"
        >
          Termos de uso
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
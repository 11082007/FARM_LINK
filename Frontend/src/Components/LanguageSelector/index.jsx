import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import Button from "../Button/index.jsx";
import { LanguageModal } from "../LanguageModal/index.jsx";
import { languageList } from "../../data/languages.js";

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentLang = languageList.find((lang) => lang.code === i18n.language);

  return (
    <>
      <Button
        btnClassName="flex items-center gap-2 rounded-md border border-borderbg-transparent px-3 py-1.5 text-sm text-neutral shadow-sm hover:bg-muted"
        onClick={() => setIsModalOpen(true)}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentLang?.name || i18n.language}
        </span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <LanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

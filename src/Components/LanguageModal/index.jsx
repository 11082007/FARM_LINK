import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { languageList } from "../../data/languages.js";
import Input from "../Input/index.jsx";

export function LanguageModal({ isOpen, onClose }) {
  const { i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = useMemo(() => {
    return languageList.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[70vh] w-full max-w-md flex-col rounded-lg bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">
            Select Language
          </h3>
          <button onClick={onClose} className="text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-border p-4">
          <Input
            type="text"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-neutral transition-colors hover:bg-muted"
            >
              <span className="flex-1">
                <p className="font-medium">{lang.name}</p>
                <p className="text-sm text-muted-foreground">
                  {lang.nativeName}
                </p>
              </span>
              {lang.code === i18n.language && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

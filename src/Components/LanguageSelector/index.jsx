// import React, { useState, useRef, useEffect } from "react"
// import { Globe, ChevronDown, Check } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import Button from "../Button/index.jsx";

// const languages = [
//   { code: "en", name: "English", flag: "🇬🇧" },
//   { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
//   { code: "ha", name: "Hausa", flag: "🇳🇬" },
//   { code: "yo", name: "Yorùbá", flag: "🇳🇬" },
//   { code: "ig", name: "Igbo", flag: "🇳🇬" },
//   { code: "am", name: "አማርኛ", flag: "🇪🇹" },
// ];

// export function LanguageSelector({ currentLanguage, onLanguageChange }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const currentLang = languages.find((lang) => lang.code === currentLanguage);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <Button
//         variant="outline"
//         size="sm"
//         className="gap-2 bg-transparent"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <Globe className="h-4 w-4" />
//         <span className="hidden sm:inline">{currentLang?.name}</span>
//         <span className="sm:hidden">{currentLang?.flag}</span>
//         <ChevronDown className="h-4 w-4" />
//       </Button>

//       {isOpen && (
//         <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//           {languages.map((lang) => (
//             <button
//               key={lang.code}
//               onClick={() => {
//                 onLanguageChange(lang.code);
//                 setIsOpen(false);
//               }}
//               className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors first:rounded-t-md last:rounded-b-md"
//             >
//               <span className="text-lg">{lang.flag}</span>
//               <span className="flex-1">{lang.name}</span>
//               {lang.code === currentLanguage && (
//                 <Check className="h-4 w-4 text-blue-600" />
//               )}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import Button from "../Button/index.jsx";
import { LanguageModal } from "../LanguageModal/index.jsx"; // Import the modal
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

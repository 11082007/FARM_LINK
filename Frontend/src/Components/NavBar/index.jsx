// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { CircleArrowRight, Leaf, Menu, ChevronDown, X } from "lucide-react";

// import { translations } from "../../lib/translation.js";
// import Button from "../Button/index.jsx";
// // import { LanguageSelector } from "../LanguageSelector/index.jsx";

// export default function NavBar() {
//   const [lang, setLang] = useState("en");
//   const t = translations[lang] || translations.en;

//   useEffect(() => {
//     const savedLang = localStorage.getItem("farmlink-language") || "en";
//     setLang(savedLang);

//     const handleLanguageChange = (e) => {
//       setLang(e.detail);
//     };
//     window.addEventListener("languageChange", handleLanguageChange);
//     return () =>
//       window.removeEventListener("languageChange", handleLanguageChange);
//   }, []);

//   return (
//     <div className=" bg-gradient-to-br from-emerald-50 via-white to-amber-50">
//       <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center gap-2">
//               <Leaf className="h-8 w-8 text-emerald-600" />
//               <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
//                 FarmLink
//               </span>
//             </div>
//             <Menu className="block md:hidden" />
//             <div className="hidden lg:flex items-center gap-6">
//               <Link
//                 to="/farmer"
//                 className="text-gray-700 hover:text-emerald-600 transition-colors"
//               >
//                 {t.forFarmers}
//                 <ChevronDown />
//               </Link>
//               <Link
//                 to="/buyer"
//                 className="text-gray-700 hover:text-emerald-600 transition-colors"
//               >
//                 {t.forBuyers}
//                 <ChevronDown />
//               </Link>
//               <Link
//                 to="/livestock"
//                 className="text-gray-700 hover:text-emerald-600 transition-colors"
//               >
//                 {t.livestock}
//               </Link>
//               <Link
//                 to="/market-prices"
//                 className="text-gray-700 hover:text-emerald-600 transition-colors"
//               >
//                 {t.marketPrices}
//               </Link>
//               <Link
//                 to="/animalServices"
//                 className="text-gray-700 hover:text-emerald-600 transition-colors"
//               >
//                 {t.animalServices}
//               </Link>
//             </div>

//             <div className="hidden md:flex items-center gap-3">
//               <p>LangSelector</p>
//               {/* <LanguageSelector /> */}
//               <Link to="/login">
//                 <Button
//                   variant="ghost"
//                   title={t.signIn}
//                   btnClassName="m-2 text-black hover:bg-[#ff5722] hover:py-2 hover:px-4 hover:rounded-md hover:text-[#fff] hover:h-11 cursor-pointer"
//                 />
//               </Link>

//               <Link to="/register">
//                 <Button btnClassName="bg-[#267d2f] text-white py-2 px-4 rounded-md flex justify-between items-center h-11 gap-2 cursor-pointer">
//                   {t.createAccount}
//                   <CircleArrowRight className="h-4 w-4" />
//                 </Button>
//               </Link>
//               {/* <Button
//                 variant="ghost"
//                 asChild
//                 btnClassName="text-black hover:bg-[#ff5722] hover:py-1 hover:px-2 hover:rounded-md hover:text-[#fff] hover:h-9"
//               >
//                 <Link to="/login">Login</Link>
//               </Button>
//               <Button
//                 asChild
//                 btnClassName="bg-[#267d2f] text-white py-2 px-4 rounded-md flex justify-between items-center h-11 gap-2"
//               >
//                 <Link to="/signup">Get Started</Link>
//               </Button> */}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       {/* <section className="relative overflow-hidden py-20 lg:py-32">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance">
//                 <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 bg-clip-text text-transparent">
//                   {t.heroTitle}
//                 </span>
//               </h1>
//               <p className="text-xl text-gray-600 leading-relaxed text-pretty">
//                 {t.heroSubtitle}
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <Link to="/register">
//                   <Button
//                     size="lg"
//                     className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg px-8"
//                   >
//                     {t.getStarted} <ArrowRight className="ml-2 h-5 w-5" />
//                   </Button>
//                 </Link>
//                 <Link to="#features">
//                   <Button
//                     size="lg"
//                     variant="outline"
//                     className="text-lg px-8 bg-transparent"
//                   >
//                     {t.learnMore}
//                   </Button>
//                 </Link>
//               </div>
//             </div>

//             <div className="relative h-[400px] lg:h-[500px]">
//               <img
//                 src={images.farmerField}
//                 alt="African farmer in field"
//                 className="w-full h-full object-cover rounded-2xl shadow-2xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* Problem Section */}
//       {/* <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="relative h-[400px]">
//               <img
//                 src={images.freshVegetables}
//                 alt="Fresh vegetables"
//                 className="w-full h-full object-cover rounded-2xl shadow-xl"
//               />
//             </div>

//             <div className="space-y-6">
//               <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
//                 {t.theProblem}
//               </div>
//               <h2 className="text-4xl font-bold text-gray-900 text-balance">
//                 {t.problemTitle}
//               </h2>
//               <p className="text-lg text-gray-600 leading-relaxed">
//                 {t.problemDesc}
//               </p>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* Solution Section */}
//       {/* <section className="py-20 bg-gradient-to-br from-emerald-50 to-amber-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-6 order-2 lg:order-1">
//               <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
//                 {t.ourSolution}
//               </div>
//               <h2 className="text-4xl font-bold text-gray-900 text-balance">
//                 {t.solutionTitle}
//               </h2>
//               <p className="text-lg text-gray-600 leading-relaxed">
//                 {t.solutionDesc}
//               </p>
//             </div>

//             <div className="relative h-[400px] order-1 lg:order-2">
//               <img
//                 src={images.freshTomatoes}
//                 alt="Fresh produce"
//                 className="w-full h-full object-cover rounded-2xl shadow-xl"
//               />
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* Features Section */}
//       {/* <section id="features" className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               {t.features}
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               {t.solutionDesc}
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <ShoppingCart className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">
//                 {t.directMarketplace}
//               </h3>
//               <p className="text-gray-600">{t.directMarketplaceDesc}</p>
//             </Card>

//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <TrendingUp className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">{t.realTimePrices}</h3>
//               <p className="text-gray-600">{t.realTimePricesDesc}</p>
//             </Card>

//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <Users className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">{t.groupBuying}</h3>
//               <p className="text-gray-600">{t.groupBuyingDesc}</p>
//             </Card>

//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <MessageSquare className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">
//                 {t.smsNotifications}
//               </h3>
//               <p className="text-gray-600">{t.smsNotificationsDesc}</p>
//             </Card>

//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <Globe className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">{t.multiLanguage}</h3>
//               <p className="text-gray-600">{t.multiLanguageDesc}</p>
//             </Card>

//             <Card className="p-6 hover:shadow-lg transition-shadow">
//               <Leaf className="h-12 w-12 text-emerald-600 mb-4" />
//               <h3 className="text-xl font-semibold mb-2">
//                 {t.animalServicesFeature}
//               </h3>
//               <p className="text-gray-600">{t.animalServicesDesc}</p>
//             </Card>
//           </div>
//         </div>
//       </section> */}

//       {/* CTA Section */}
//       {/* <section className="py-20 bg-gradient-to-r from-emerald-600 to-amber-600">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl font-bold text-white mb-4">
//             {t.readyToStart}
//           </h2>
//           <p className="text-xl text-emerald-50 mb-8">{t.joinFarmers}</p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <Link to="/register">
//               <Button
//                 size="lg"
//                 className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8"
//               >
//                 {t.signUpFarmer}
//               </Button>
//             </Link>
//             <Link to="/register">
//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
//               >
//                 {t.signUpBuyer}
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section> */}
//     </div>
//   );
// }
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CircleArrowRight, Leaf, Menu, X, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "../Button/index.jsx";
import { LanguageSelector } from "../LanguageSelector/index.jsx";

export default function NavBar() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/farmer", label: t("navbar.forFarmers") },
    { href: "/buyer", label: t("navbar.forBuyers") },
    { href: "/livestock", label: t("navbar.livestock") },
    { href: "/market-prices", label: t("navbar.marketPrices") },
    { href: "/animalServices", label: t("navbar.animalServices") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              FarmLink
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center gap-1 text-neutral transition-colors hover:text-primary"
              >
                {link.label}

                {(link.href === "/farmer" || link.href === "/buyer") && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSelector />
            <Link to="/login">
              <Button
                variant="ghost"
                btnClassName="text-neutral hover:bg-secondary/10 hover:text-secondary"
              >
                {t("navbar.signIn")}
              </Button>
            </Link>
            <Link to="/register">
              <Button btnClassName="group flex items-center gap-2 bg-primary text-white hover:bg-primary-dark">
                {t("navbar.createAccount")}
                <CircleArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-base font-medium text-neutral hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
                {(link.href === "/farmer" || link.href === "/buyer") && (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Link>
            ))}
            <hr className="my-2" />
            <div className="flex flex-col space-y-3">
              <LanguageSelector />
              <Link to="/login">
                <Button variant="ghost">{t("navbar.signIn")}</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" className="group">
                  {t("navbar.createAccount")}
                  <CircleArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

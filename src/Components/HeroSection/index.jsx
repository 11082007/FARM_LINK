import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Button from "../Button";
import farmerMan from "../../assets/farmerMan.jpg";
import farmerOne from "../../assets/farmerOne.jpg";
import farmerWoman from "../../assets/farmerWoman.jpg";
import farmerWomen from "../../assets/farmerWomen.jpg";
import smileyWomanWithPhone from "../../assets/smileyWomanWithPhone.png";
import { ArrowRight } from "lucide-react";
const heroImages = [smileyWomanWithPhone, farmerMan, farmerOne, farmerWoman];
export function HeroSection() {
  const { t } = useTranslation("landing");

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-amber-600 bg-clip-text text-transparent">
                {t("hero.title")}
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed text-pretty">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-2">
              <Link to="/register">
                <Button variant="primary" className="group h-11">
                  {t("buttons.startAsFarmer")}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="group h-11 text-lg px-8">
                  {t("buttons.startAsBuyer")}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            {heroImages.map((heroImage, index) => (
              <img
                key={index}
                src={heroImage}
                alt={`African farmer ${index + 1}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

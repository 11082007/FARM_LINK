import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card/index.jsx";
import {
  UserPlus,
  Package,
  MessageSquare,
  Bell,
  ArrowRight,
} from "lucide-react";

const steps = [
  { icon: UserPlus, key: "createAccount", color: "bg-primary" },
  { icon: Package, key: "listProduce", color: "bg-secondary" },
  { icon: MessageSquare, key: "connect", color: "bg-accent" },
  { icon: Bell, key: "getUpdates", color: "bg-primary" },
];

export function HowItWorks() {
  const { t } = useTranslation("landing");
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("howItWorks.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
            {t("howItWorks.subtitle")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, key, color }, index) => (
            <div key={index} className="relative">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <Card.Content className="m-3">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${color} text-white`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mb-2 text-sm font-bold text-primary">
                    {t("howItWorks.step", { count: index + 1 })}
                  </p>
                  <Card.Title className="mb-2 text-lg">
                    {t(`howItWorks.${key}.title`)}
                  </Card.Title>
                  <Card.Description>
                    {t(`howItWorks.${key}.desc`)}
                  </Card.Description>
                </Card.Content>
              </Card>
              {index < steps.length - 1 && (
                <ArrowRight className="absolute right-0 top-1/2 hidden translate-x-[140%] lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

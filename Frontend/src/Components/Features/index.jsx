import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card/index.jsx";
import {
  Search,
  MapPin,
  Bell,
  TrendingUp,
  Shield,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, key: "escrow" },
  { icon: MapPin, key: "locationMatching" },
  { icon: Bell, key: "smsAlerts" },
  { icon: Search, key: "smartSearch" },
  { icon: TrendingUp, key: "priceTransparency" },
  { icon: Shield, key: "verifiedUsers" },
];

export function Features() {
  const { t } = useTranslation("landing");

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4" />
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl text-balance">
          {t("features.title")}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
          {t("features.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, key }) => (
          <Card key={key} className="transition-shadow hover:shadow-lg">
            <Card.Content className="m-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>

              <Card.Title className="mb-2 text-lg">
                {t(`features.${key}.title`)}
              </Card.Title>

              <Card.Description className="text-slate-400 leading-relaxed">
                {t(`features.${key}.desc`)}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}

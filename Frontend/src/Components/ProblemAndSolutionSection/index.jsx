import React from "react";
import { useTranslation } from "react-i18next";
import Card from "../Card/index.jsx";
import {
  AlertCircle,
  TrendingUp,
  Users,
  Smartphone,
  CloudRain,
  ScanLine,
} from "lucide-react";

export function ProblemSolution() {
  const { t } = useTranslation("landing");

  const problems = [
    { key: "card1" },
    { key: "card2" },
    { key: "card3" },
    { key: "card4" },
    { key: "card5" },
  ];

  const solutions = [
    { key: "card1", icon: Users, color: "primary" },
    { key: "card2", icon: TrendingUp, color: "secondary" },
    { key: "card3", icon: Smartphone, color: "accent" },
    { key: "card4", icon: CloudRain, color: "primary" },
    { key: "card5", icon: ScanLine, color: "accent" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{t("problem.kicker")}</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl text-balance">
              {t("problem.title")}
            </h2>
            <div className="space-y-4">
              {problems.map((problem) => (
                <Card key={problem.key}>
                  <Card.Content className="m-4">
                    <h3 className="mb-2 font-semibold text-foreground">
                      {t(`problem.${problem.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`problem.${problem.key}.desc`)}
                    </p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>{t("solution.kicker")}</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl text-balance">
              {t("solution.title")}
            </h2>
            <div className="space-y-4">
              {solutions.map((sol) => (
                <Card
                  key={sol.key}
                  className={`border-${sol.color}/20 bg-${sol.color}/5`}
                >
                  <Card.Content className="m-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${sol.color} text-${sol.color}-foreground`}
                      >
                        <sol.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {t(`solution.${sol.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`solution.${sol.key}.desc`)}
                    </p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

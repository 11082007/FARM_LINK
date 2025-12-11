import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Card from "../../Components/Card/index.jsx";
import Button from "../../Components/Button/index.jsx";
import {
  Package,
  DollarSign,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const dashboardData = {
  userName: "John",
  stats: [
    {
      titleKey: "stats.listings",
      value: "12",
      descKey: "stats.listings.desc",
      icon: Package,
      trend: { value: "+2 this week", positive: true },
    },
    {
      titleKey: "stats.revenue",
      value: "$4,250",
      descKey: "stats.revenue.desc",
      icon: DollarSign,
      trend: { value: "+18%", positive: true },
    },
    {
      titleKey: "stats.inquiries",
      value: "28",
      descKey: "stats.inquiries.desc",
      icon: MessageSquare,
      trend: { value: "5 today", positive: true },
    },
    {
      titleKey: "stats.success",
      value: "87%",
      descKey: "stats.success.desc",
      icon: TrendingUp,
      trend: { value: "+5%", positive: true },
    },
  ],
  recentInquiries: [
    {
      id: 1,
      name: "City Grocers",
      message: "Interested in your 500kg tomatoes...",
      time: "7 minutes ago",
    },
    {
      id: 2,
      name: "Fresh Eats",
      message: "Do you have onions available?",
      time: "45 minutes ago",
    },
  ],
};

export default function FarmerDashboard() {
  const { t } = useTranslation("dashboard");
  const { userName, stats, recentInquiries } = dashboardData;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {t("welcome", { name: userName })}
        </h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ titleKey, value, descKey, icon: Icon, trend }) => (
          <Card key={titleKey}>
            <Card.Content className="p-6">
              <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {t(titleKey)}
                </h3>
                {Icon && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground">
                  {value}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{t(descKey)}</p>
                  {trend && (
                    <span
                      className={`flex items-center text-xs font-medium ${
                        trend.positive ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {trend.positive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {trend.value}
                    </span>
                  )}
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <Card.Header>
            <Card.Title>{t("sms.title")}</Card.Title>
            <Card.Description>{t("sms.desc")}</Card.Description>
          </Card.Header>
          <Card.Content>
            <Button btnClassName="w-full bg-primary text-white hover:bg-primary-dark">
              {t("sms.button")}
            </Button>
          </Card.Content>
        </Card>

        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>{t("inquiriesList.title")}</Card.Title>
            <Card.Description>{t("inquiriesList.desc")}</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {inquiry.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {inquiry.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {inquiry.time}
                  </span>
                </div>
              ))}
            </div>
          </Card.Content>
          <Card.Footer>
            <Link to="/farmer/inquiries" className="w-full">
              <Button btnClassName="w-full bg-muted text-neutral hover:bg-border">
                {t("inquiriesList.viewAll")}
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      </div>
    </main>
  );
}

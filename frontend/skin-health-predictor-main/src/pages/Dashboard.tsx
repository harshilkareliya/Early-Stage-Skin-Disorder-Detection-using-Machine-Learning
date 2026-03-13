import { useMemo } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPredictionHistory, DISORDER_CLASSES } from "@/lib/prediction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, Activity, Clock, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const history = useMemo(() => getPredictionHistory(), []);

  const classCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 0; i <= 6; i++) counts[i] = 0;
    history.forEach((h) => counts[h.predicted_class]++);
    return Object.entries(counts).map(([cls, count]) => ({
      name: DISORDER_CLASSES[Number(cls)].name.split(" ").slice(0, 2).join(" "),
      fullName: DISORDER_CLASSES[Number(cls)].name,
      count,
      color: DISORDER_CLASSES[Number(cls)].color,
    }));
  }, [history]);

  const avgConfidence = history.length
    ? Math.round((history.reduce((a, h) => a + h.probability, 0) / history.length) * 100)
    : 0;

  const stats = [
    { label: "Total Predictions", value: history.length, icon: Activity },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: TrendingUp },
    { label: "Unique Classes", value: new Set(history.map((h) => h.predicted_class)).size, icon: BarChart3 },
    { label: "Last Prediction", value: history.length ? new Date(history[history.length - 1].timestamp).toLocaleDateString() : "N/A", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Prediction history and distribution analysis</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Predictions by Class</CardTitle>
                <CardDescription>Distribution of predicted disorders</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                    No predictions yet. Run some predictions first.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={classCounts}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {classCounts.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display">Class Distribution</CardTitle>
                <CardDescription>Pie chart of prediction proportions</CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                    No predictions yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={classCounts.filter((c) => c.count > 0)}
                        dataKey="count"
                        nameKey="fullName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ fullName, percent }) => `${fullName} (${(percent * 100).toFixed(0)}%)`}
                        labelLine
                      >
                        {classCounts.filter((c) => c.count > 0).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Recent Predictions</CardTitle>
                <CardDescription>Last 10 prediction logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 pr-4">#</th>
                        <th className="pb-2 pr-4">Timestamp</th>
                        <th className="pb-2 pr-4">Predicted Class</th>
                        <th className="pb-2 pr-4">Disorder</th>
                        <th className="pb-2">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.slice(-10).reverse().map((h, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2.5 pr-4 text-muted-foreground">{history.length - i}</td>
                          <td className="py-2.5 pr-4 font-mono text-xs">{new Date(h.timestamp).toLocaleString()}</td>
                          <td className="py-2.5 pr-4">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-primary-foreground" style={{ backgroundColor: DISORDER_CLASSES[h.predicted_class].color }}>
                              {h.predicted_class}
                            </span>
                          </td>
                          <td className="py-2.5 pr-4 font-medium">{DISORDER_CLASSES[h.predicted_class].name}</td>
                          <td className="py-2.5 font-mono">{Math.round(h.probability * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

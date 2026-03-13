import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DISORDER_CLASSES } from "@/lib/prediction";
import { Brain, Database, Code, Target } from "lucide-react";

const About = () => {
  const techStack = [
    { icon: Brain, title: "ML Model", desc: "Pre-trained classifier with ~91% accuracy on structured clinical data. Supports 7 disorder classes (0–6)." },
    { icon: Code, title: "Frontend", desc: "React + TypeScript with Tailwind CSS. Responsive form-based UI for clinical parameter input." },
    { icon: Database, title: "Backend", desc: "Python FastAPI REST API with /predict endpoint. Model loaded from serialized joblib/pickle file." },
    { icon: Target, title: "Analytics", desc: "SQLite-backed prediction logging with timestamp. Dashboard shows class distribution and prediction history." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-3">
            <Badge variant="secondary" className="mb-2">Final Year Project</Badge>
            <h1 className="font-display text-3xl font-bold">About This Project</h1>
            <p className="text-muted-foreground leading-relaxed">
              Early-Stage Skin Disorder Detection is a machine learning project that classifies skin disorders
              into 6 categories based on clinical parameters. The model analyzes 10 clinical features plus patient
              age to provide rapid preliminary screening.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {techStack.map(({ icon: Icon, title, desc }) => (
              <Card key={title}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-display">{title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-display">Disorder Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5, 6].map((cls) => {
                  const { name, description, color } = DISORDER_CLASSES[cls];
                  return (
                    <div key={cls} className="flex gap-3 rounded-lg border p-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground" style={{ backgroundColor: color }}>
                        {cls}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;

import { useState } from "react";
import Header from "@/components/Header";
import PredictionForm from "@/components/PredictionForm";
import PredictionResultCard from "@/components/PredictionResult";
import { PredictionResult } from "@/lib/prediction";
import { Stethoscope } from "lucide-react";

const Index = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Stethoscope className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Early-Stage Skin Disorder Detection
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              ML-powered classification system using clinical parameters. Enter patient symptoms below
              to predict one of 6 skin disorder categories.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <PredictionForm onResult={setResult} />
            </div>
            <div className="lg:col-span-2">
              {result ?
              <PredictionResultCard result={result} /> :

              <div className="h-full min-h-[300px] rounded-xl border-2 border-dashed bg-muted/30 p-8 items-center justify-center flex flex-row px-[32px]">
                  <div className="text-center space-y-2">
                    <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium text-muted-foreground">Prediction results will appear here</p>
                    <p className="text-xs text-muted-foreground/60">Fill in clinical parameters and click Predict</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default Index;
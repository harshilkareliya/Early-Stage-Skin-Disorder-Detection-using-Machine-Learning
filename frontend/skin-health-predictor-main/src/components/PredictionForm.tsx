import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CLINICAL_FEATURES, PredictionInput, PredictionResult, savePredictionToHistory, DISORDER_CLASSES } from "@/lib/prediction";
import { predictDisorder } from "@/lib/api";
import { Send, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionFormProps {
  onResult: (result: PredictionResult) => void;
}

const defaultInput: PredictionInput = {
  erythema: 0, scaling: 0, definite_borders: 0, itching: 0,
  koebner_phenomenon: 0, polygonal_papules: 0, follicular_papules: 0,
  oral_mucosal_involvement: 0, knee_and_elbow_involvement: 0, scalp_involvement: 0,
  age: 30,
};

const PredictionForm = ({ onResult }: PredictionFormProps) => {
  const [input, setInput] = useState<PredictionInput>(defaultInput);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFeature = (key: string, value: number) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiResult = await predictDisorder(input);

      // Map to existing PredictionResult format
      const classIndex = apiResult.isHealthy
        ? 0
        : Object.entries(DISORDER_CLASSES).find(
            ([, v]) => v.name.toLowerCase() === apiResult.disease.toLowerCase()
          )?.[0] ?? 0;

      const result: PredictionResult = {
        predicted_class: Number(classIndex),
        probability: apiResult.confidence / 100,
        timestamp: new Date().toISOString(),
        inputs: input,
      };

      savePredictionToHistory(result);
      onResult(result);

      if (apiResult.message) {
        toast({ title: "Note", description: apiResult.message });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({ title: "Prediction Failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => setInput(defaultInput);

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="font-display text-xl">Clinical Input Parameters</CardTitle>
        <CardDescription>Rate each clinical feature from 0 (absent) to 4 (severe)</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {CLINICAL_FEATURES.map(({ key, label, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {input[key as keyof PredictionInput]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
                <Slider
                  id={key}
                  min={0}
                  max={4}
                  step={1}
                  value={[input[key as keyof PredictionInput] as number]}
                  onValueChange={([v]) => updateFeature(key, v)}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Absent</span>
                  <span>Severe</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium">Patient Age</Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              value={input.age}
              onChange={(e) => updateFeature("age", Math.max(1, Math.min(120, Number(e.target.value))))}
              className="max-w-[200px]"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isSubmitting ? "Analyzing..." : "Predict Disorder"}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;

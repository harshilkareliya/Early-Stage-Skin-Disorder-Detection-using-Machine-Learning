import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DISORDER_CLASSES, PredictionResult as PredictionResultType } from "@/lib/prediction";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface Props {
  result: PredictionResultType;
}

const PredictionResultCard = ({ result }: Props) => {
  const disorder = DISORDER_CLASSES[result.predicted_class];
  const isNormal = result.predicted_class === 6;
  const confidencePercent = Math.min(Math.round(result.probability * 100), 99);;

  return (
    <Card className="animate-fade-in border-2 overflow-hidden">
      <div className="h-1.5" style={{ backgroundColor: disorder.color }} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Prediction Result</p>
            <CardTitle className="font-display text-2xl" style={{ color: disorder.color }}>
              {disorder.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isNormal ? (
              <Badge className="bg-success text-success-foreground gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Healthy
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                Class {result.predicted_class}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{disorder.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Model Confidence</span>
            <span className="font-display font-bold text-lg">{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-2.5" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>{new Date(result.timestamp).toLocaleString()}</span>
          <span className="mx-1">•</span>
          <span>Model Accuracy: ~91%</span>
        </div>

        {!isNormal && (
          <div className="rounded-lg bg-warning/10 p-3 text-xs text-warning-foreground">
            <strong className="text-foreground">⚠️ Disclaimer:</strong>{" "}
            <span className="text-muted-foreground">
              This is a demonstration ML model for academic purposes only. Always consult a qualified dermatologist for medical diagnosis.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResultCard;

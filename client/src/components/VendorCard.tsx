import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface VendorCardProps {
  id: string;
  name: string;
  description: string;
  isOpen: boolean;
  prepTime: number;
  imageUrl?: string;
  onClick?: () => void;
}

export default function VendorCard({ id, name, description, isOpen, prepTime, imageUrl, onClick }: VendorCardProps) {
  return (
    <Card 
      className="hover-elevate cursor-pointer transition-all" 
      onClick={onClick}
      data-testid={`card-vendor-${id}`}
    >
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">{name[0]}</div>
          </div>
        )}
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{name}</CardTitle>
          <StatusBadge status={isOpen ? 'open' : 'closed'} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{prepTime} mins</span>
        </div>
      </CardContent>
    </Card>
  );
}

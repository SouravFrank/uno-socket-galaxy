import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ColorPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (color: "red" | "blue" | "green" | "yellow" | "black") => void;
}

export const ColorPicker = ({ open, onClose, onSelect }: ColorPickerProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Card Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button 
            variant="outline" 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => onSelect("red")}
          >
            Red
          </Button>
          <Button
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => onSelect("blue")}
          >
            Blue
          </Button>
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onSelect("green")}
          >
            Green
          </Button>
          <Button
            variant="outline"
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => onSelect("yellow")}
          >
            Yellow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
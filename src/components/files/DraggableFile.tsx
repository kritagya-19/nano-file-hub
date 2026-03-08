import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface DraggableFileProps {
  fileId: string;
  children: React.ReactNode;
}

export const DraggableFile = ({ fileId, children }: DraggableFileProps) => {
  const { attributes, listeners, setNodeRef, isDragging, setActivatorNodeRef } = useDraggable({
    id: fileId,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative",
        isDragging && "opacity-40 scale-95"
      )}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="absolute top-2 left-2 z-10 w-6 h-6 rounded-md bg-muted/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      {children}
    </div>
  );
};

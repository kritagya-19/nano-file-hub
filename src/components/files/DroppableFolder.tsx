import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface DroppableFolderProps {
  folderId: string;
  isOver?: boolean;
  children: React.ReactNode;
}

export const DroppableFolder = ({ folderId, children }: DroppableFolderProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: folderId });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "transition-all duration-200",
        isOver && "ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl scale-[1.02]"
      )}
    >
      {children}
    </div>
  );
};

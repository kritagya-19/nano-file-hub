import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Smile, Paperclip, Mic, Send, X, Image, File } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onAttachFile: (file: File) => void;
  selectedFile: File | null;
  onRemoveFile: () => void;
  disabled?: boolean;
  isUploading?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

const isImageType = (type: string) => type.startsWith("image/");

export const ChatInput = ({
  onSendMessage,
  onAttachFile,
  selectedFile,
  onRemoveFile,
  disabled = false,
  isUploading = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() || selectedFile) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* File Preview */}
      {selectedFile && (
        <div className="px-3 sm:px-4 py-2 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border max-w-sm">
            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
              {isImageType(selectedFile.type) ? (
                <Image className="w-5 h-5 text-muted-foreground" />
              ) : (
                <File className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 shrink-0" 
              onClick={onRemoveFile}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-2 sm:px-3 py-2 flex items-end gap-1 sm:gap-2">
        {/* Emoji Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground hidden sm:flex"
          disabled={disabled}
        >
          <Smile className="w-5 h-5" />
        </Button>

        {/* Attachment Button */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? "Add a caption..." : "Type a message"}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full resize-none rounded-2xl bg-muted/50 border border-border px-4 py-2.5",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "max-h-[120px]"
            )}
          />
        </div>

        {/* Send/Mic Button */}
        {message.trim() || selectedFile ? (
          <Button
            size="icon"
            className="h-10 w-10 rounded-full shrink-0"
            onClick={handleSubmit}
            disabled={disabled || isUploading}
          >
            <Send className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <Mic className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground text-center">Uploading file...</p>
        </div>
      )}
    </div>
  );
};

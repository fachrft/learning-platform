"use client";

import { useRef, useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Strikethrough,
  Braces,
  List,
  ListOrdered,
  Undo,
  Redo,
  Quote,
  ImageIcon,
  Loader2,
  UnderlineIcon,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  ChevronDown,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useImageKitUpload } from "@/hooks/use-imagekit-upload";
import toast from "react-hot-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarBtn({
  onClick,
  pressed,
  disabled,
  label,
  children,
  className,
}: {
  onClick: () => void;
  pressed?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          size="sm"
          pressed={pressed}
          disabled={disabled}
          aria-label={label}
          className={cn(
            "h-8 w-8 p-0 editor-toolbar-btn",
            pressed &&
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            className,
          )}
          onMouseDown={(e) => e.preventDefault()}
          onPressedChange={() => onClick()}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarSep() {
  return <Separator orientation="vertical" className="h-5 mx-0.5" />;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis materi di sini...",
  className,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useImageKitUpload();
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-5 py-4 focus:outline-none text-sm leading-relaxed",
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    const toastId = toast.loading("Mengupload gambar...");
    try {
      const url = await uploadFile(file);
      editor
        .chain()
        .focus()
        .setImage({ src: url as string })
        .run();
      toast.success("Gambar berhasil diupload!", { id: toastId });
    } catch {
      toast.error("Gagal mengupload gambar.", { id: toastId });
    }
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkUrl("");
    setLinkPopoverOpen(false);
  }, [editor, linkUrl]);

  const getActiveHeadingLabel = () => {
    if (editor?.isActive("heading", { level: 1 })) return "H1";
    if (editor?.isActive("heading", { level: 2 })) return "H2";
    if (editor?.isActive("heading", { level: 3 })) return "H3";
    return "H▾";
  };

  if (!editor) return null;

  return (
    <div className={cn("border rounded-xl bg-card", className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />

      {/* ── Toolbar ── */}
      <TooltipProvider delayDuration={400}>
        <div className="flex flex-wrap items-center gap-1 px-2 py-2 border-b bg-muted/30 rounded-t-xl">
          {/* Undo / Redo */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            label="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            label="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <ToolbarSep />

          {/* Heading Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-0.5 px-2 text-xs font-semibold"
                onMouseDown={(e) => e.preventDefault()}
              >
                {getActiveHeadingLabel()}
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().setParagraph().run();
                }}
                className={cn(
                  !editor.isActive("heading") &&
                    "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground",
                )}
              >
                <span className="text-sm">Paragraph</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 1 }).run();
                }}
                className={cn(
                  editor.isActive("heading", { level: 1 }) &&
                    "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground",
                )}
              >
                <span className="text-xl font-bold">Heading 1</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 2 }).run();
                }}
                className={cn(
                  editor.isActive("heading", { level: 2 }) &&
                    "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground",
                )}
              >
                <span className="text-lg font-bold">Heading 2</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onMouseDown={(e) => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: 3 }).run();
                }}
                className={cn(
                  editor.isActive("heading", { level: 3 }) &&
                    "bg-primary text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground",
                )}
              >
                <span className="text-base font-semibold">Heading 3</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Lists */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            pressed={editor.isActive("bulletList")}
            label="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            pressed={editor.isActive("orderedList")}
            label="Ordered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <ToolbarSep />

          {/* Text Formatting */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            pressed={editor.isActive("bold")}
            label="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            pressed={editor.isActive("italic")}
            label="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            pressed={editor.isActive("strike")}
            label="Strikethrough"
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            pressed={editor.isActive("underline")}
            label="Underline"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            pressed={editor.isActive("highlight")}
            label="Highlight"
          >
            <Highlighter className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            pressed={editor.isActive("codeBlock")}
            label="Code Block"
          >
            <Braces className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Link */}
          <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
            <PopoverTrigger asChild>
              <Toggle
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 editor-toolbar-btn",
                  editor.isActive("link") &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
                )}
                pressed={editor.isActive("link")}
                aria-label="Link"
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (editor.isActive("link")) {
                    editor.chain().focus().unsetLink().run();
                  } else {
                    setLinkUrl(editor.getAttributes("link").href || "");
                    setLinkPopoverOpen(true);
                  }
                }}
              >
                <Link2 className="h-3.5 w-3.5" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="start">
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setLink()}
                  className="h-8 text-sm"
                />
                <Button size="sm" className="h-8 px-2" onClick={setLink}>
                  Set
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <ToolbarSep />

          {/* Text Alignment */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            pressed={editor.isActive({ textAlign: "left" })}
            label="Align Left"
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            pressed={editor.isActive({ textAlign: "center" })}
            label="Align Center"
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            pressed={editor.isActive({ textAlign: "right" })}
            label="Align Right"
          >
            <AlignRight className="h-3.5 w-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            pressed={editor.isActive({ textAlign: "justify" })}
            label="Justify"
          >
            <AlignJustify className="h-3.5 w-3.5" />
          </ToolbarBtn>

          <ToolbarSep />

          {/* Blockquote / HR */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            pressed={editor.isActive("blockquote")}
            label="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarBtn>

          {/* Image Upload */}
          <ToolbarBtn
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            label="Upload Image"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5" />
            )}
          </ToolbarBtn>
        </div>
      </TooltipProvider>

      {/* Editor Content */}
      <div className="overflow-hidden rounded-b-xl">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

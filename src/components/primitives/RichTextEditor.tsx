import React, { forwardRef, useImperativeHandle } from "react";
import clsx from "clsx";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "./Button";
import { Bold, Heading, Italic, List, ListOrdered } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RichTextEditor = forwardRef<
  { clearContent: () => void },
  RichTextEditorProps
>(({ value, onChange, className }, ref) => {
  const richTextStyles = clsx(
    "max-w-none p-4 min-h-[100px] dark:bg-white/5 h-full min-h-[150px] p-4 fv-style-inside", // input container itself
    "[&_p]:text-zinc-600 dark:[&_p]:text-zinc-300", // paragraphs
    "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6", // lists
    "[&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg", // headings
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: richTextStyles,
      },
      transformPastedText(text) {
        return text.toUpperCase();
      },
    },
  });

  useImperativeHandle(ref, () => ({
    clearContent: () => {
      editor?.commands.setContent("");
    },
  }));

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    isActive,
    onClick,
    children,
  }: {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <Button
      square
      type="button"
      variant="ghost"
      size="sm"
      className={clsx(isActive && "relative bg-zinc-100 dark:bg-zinc-800")}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  const HeadingLevel = ({ level }: { level: number }) => (
    <span
      className={clsx(
        "absolute bottom-1 right-[5.5px] font-extrabold text-[0.625rem] opacity-80",
      )}
    >
      {level}
    </span>
  );

  return (
    <div
      className={clsx(
        "overflow-clip rounded-lg",
        "border border-zinc-950/10 data-[hover]:border-zinc-950/20 dark:border-white/10 dark:data-[hover]:border-white/20",
        className,
      )}
    >
      <div className="border-b border-zinc-950/10 dark:border-white/10 px-2 py-1 flex gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold size={14} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic size={14} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List size={14} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered size={14} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading size={14} />
          <HeadingLevel level={1} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading size={14} />
          <HeadingLevel level={2} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading size={14} />
          <HeadingLevel level={3} />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

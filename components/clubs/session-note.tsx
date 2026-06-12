import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type SessionNoteProps = {
  note: string;
};

export function SessionNote({ note }: SessionNoteProps) {
  return (
    <div className="text-sm leading-7 text-muted-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ children }) => (
            <h3 className="mt-4 w-fit border-b border-white/20 pb-1 text-sm font-semibold text-foreground first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
              {children}
            </ul>
          ),
          li: ({ children }) => <li>{children}</li>,
          hr: () => <div className="my-3 h-px w-24 bg-white/10" />,
        }}
      >
        {note.trim()}
      </ReactMarkdown>
    </div>
  );
}

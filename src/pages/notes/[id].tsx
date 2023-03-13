// next & react
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { Note, Spinner } from "phosphor-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

// custom components
import NoteOptionsModal from "../../components/Modals/NoteOptions";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";

// Markdown and code editing
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeMirror, { type BasicSetupOptions } from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView, keymap, type ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";

// codemirror themes
import { tokyoNightDayInit } from "@uiw/codemirror-theme-tokyo-night-day";
import { auraInit } from "@uiw/codemirror-theme-aura";

// syntax highlighting
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";

// nextauth
import { getServerAuthSession } from "../../server/auth";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";

// other
import useThemeStore, { type ThemeType } from "../../stores/theme";
import { api } from "../../utils/api";
import { prisma } from "../../server/db";
import { type NoteWithTags } from "../..";
import { z } from "zod";
import { formatDate } from "../../utils/dates";
import DMP from "diff-match-patch";
import Navbar from "../../components/Navbar";
import Head from "next/head";
import { Tab } from "@headlessui/react";

// editor customization
const customDarkTheme = auraInit({
  settings: { background: "#00000000" },
});
const customLightTheme = tokyoNightDayInit({
  settings: { background: "#00000000" },
});

const editorOptions: BasicSetupOptions = {
  // lineNumbers: false,
  // foldGutter: false,
  // syntaxHighlighting: true,
};

const MarkdownPreview = ({
  editorContent,
  theme,
}: {
  editorContent: string;
  theme: ThemeType;
}) => {
  return (
    <ReactMarkdown
      className="prose my-3 prose-h1:border-b-2 prose-h1:border-gray-300 prose-h1:pb-2 prose-h2:h-10 prose-h2:border-b-2 prose-h2:border-gray-300 prose-h2:pb-1.5 hover:prose-a:text-blue-400 prose-blockquote:border-gray-300 prose-pre:bg-transparent prose-pre:p-0 prose-img:mx-auto prose-img:my-6 prose-img:max-h-[600px] prose-img:rounded-md prose-hr:h-1 prose-hr:rounded-full prose-hr:bg-gray-300 dark:prose-invert  dark:prose-h1:border-gray-700 dark:prose-h2:border-gray-700 dark:prose-blockquote:border-gray-700 dark:prose-hr:bg-gray-700"
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, style, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={theme === "light" ? oneLight : oneDark}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {editorContent}
    </ReactMarkdown>
  );
};

const MemoedMarkdownPreview = memo(MarkdownPreview);

function TextEditor({
  initialContent,
  setEditorContent,
  debouncedAutoSave,
}: {
  initialContent: string;
  setEditorContent: (newContent: string) => void;
  debouncedAutoSave: () => void;
}) {
  const { theme } = useThemeStore();

  const onEditorChange = useCallback(
    (value: string, viewUpdate: ViewUpdate) => {
      setEditorContent(value);
      debouncedAutoSave();
    },
    []
  );

  return (
    <CodeMirror
      className="h-full overflow-auto"
      value={initialContent}
      theme={theme === "light" ? customLightTheme : customDarkTheme}
      onChange={onEditorChange}
      basicSetup={editorOptions}
      placeholder="Enter your text here..."
      extensions={[
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        EditorView.lineWrapping,
      ]}
    />
  );
}

const MemoedTextEditor = memo(TextEditor);

// Codemirror text editor panel
function EditorPanel({
  note,
  mutationLoading,
  initialContent,
  previewOpen,
  setEditorContent,
  setModalOpen,
  setPreviewOpen,
  saveNote,
  debouncedAutoSave,
}: {
  note: NoteWithTags;
  mutationLoading: boolean;
  initialContent: string;
  previewOpen: boolean;
  setEditorContent: (value: string) => void;
  setModalOpen: (newModalOpen: boolean) => void;
  setPreviewOpen: (newPreviewOpen: boolean) => void;
  saveNote: () => void;
  debouncedAutoSave: () => void;
}) {
  return (
    <section className="flex h-full flex-1 flex-col overflow-clip bg-gray-100 dark:bg-gray-900">
      {/* Top bar */}
      <div className="hidden h-16 flex-shrink-0 justify-between px-8 text-gray-500 dark:bg-gray-900 dark:text-gray-400 md:flex">
        {/* Top bar title */}
        <div className="flex items-center gap-2.5">
          <FontAwesomeIcon className="scale-125" icon={faMarkdown} />
          <span className="font-semibold">Editor</span>
        </div>

        {/* Top bar buttons */}
        <div className="flex items-center gap-6">
          <span className="text-sm">
            Last edited {formatDate(note.lastUpdated)}
          </span>
          <div className="flex items-center gap-0">
            <Button
              icon="floppy"
              iconOnly
              intent="secondaryAltTransparent"
              label={mutationLoading ? "Saving..." : "Save note"}
              tooltipAlignment="xCenter"
              tooltipPosition="bottom"
              size="regular"
              onClick={() => saveNote()}
              loading={mutationLoading}
            />
            <Button
              icon="note-pencil-sm"
              iconOnly
              intent="secondaryAltTransparent"
              label="Note options"
              tooltipAlignment="xCenter"
              tooltipPosition="bottom"
              size="regular"
              onClick={() => setModalOpen(true)}
            />
            {previewOpen ? (
              <Button
                icon="eye-slash"
                iconOnly
                intent="secondaryAltTransparent"
                label="Hide preview"
                tooltipAlignment="xCenter"
                tooltipPosition="bottom"
                size="regular"
                onClick={() => setPreviewOpen(false)}
              />
            ) : (
              <Button
                icon="eye"
                iconOnly
                intent="secondaryAltTransparent"
                label="Show preview"
                tooltipAlignment="left"
                tooltipPosition="bottom"
                size="regular"
                onClick={() => setPreviewOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <MemoedTextEditor
        initialContent={initialContent}
        setEditorContent={setEditorContent}
        debouncedAutoSave={debouncedAutoSave}
      />
    </section>
  );
}

const MemoedEditorPanel = memo(EditorPanel);

// React Markdown preview panel
function PreviewPanel({
  debouncedEditorContent,
}: {
  debouncedEditorContent: string;
}) {
  const { theme } = useThemeStore();

  return (
    <section className="flex h-full flex-1 flex-col overflow-auto bg-gray-200 dark:bg-gray-850">
      {/* Topbar */}
      <div className="hidden h-16 flex-shrink-0 items-center gap-2.5 px-8 text-gray-500 dark:text-gray-400 md:flex">
        <Note size={24} weight="bold" />
        <span className="font-semibold">Preview</span>
      </div>
      {/* Markdown Preview */}
      <div className="overflow-auto px-8">
        <MemoedMarkdownPreview
          theme={theme}
          editorContent={debouncedEditorContent}
        />
      </div>
    </section>
  );
}

const NotePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  // nextAuth
  const session = useSession().data as Session;

  // trpc
  const noteQuery = api.notes.getSingle.useQuery({ id: props.noteId });
  const noteContentMutation = api.notes.updateContent.useMutation();
  const tagsQuery = api.tags.getAll.useQuery();
  const note = noteQuery.data;
  const tags = tagsQuery.data;
  const utils = api.useContext();

  // diff-match-patch
  const dmp = useMemo(() => {
    return new DMP.diff_match_patch();
  }, []);

  // editor state
  const [prevEditorContent, setPrevEditorContent] = useState(props.content);
  const [editorContent, setEditorContent] = useState(props.content);
  const [debouncedEditorContent] = useDebounce(editorContent, 500);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // auto-saving with input debouncing
  const debouncedAutoSave = useDebouncedCallback(() => {
    saveNote();
  }, 2000);

  // note saving function
  const saveNote = useCallback(() => {
    if (!note || !tags) return;
    const patches = dmp.patch_make(prevEditorContent, editorContent);
    noteContentMutation.mutate(
      { id: props.noteId, patches },
      {
        onSuccess: (updatedNote, variables, context) => {
          void utils.notes.getSingle.invalidate({ id: variables.id });
          setPrevEditorContent(editorContent);
        },
      }
    );
  }, [
    dmp,
    editorContent,
    note,
    noteContentMutation,
    prevEditorContent,
    props.noteId,
    tags,
    utils.notes.getSingle,
  ]);

  // shortcut handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        if (noteContentMutation.isLoading) return;
        saveNote();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [noteContentMutation.isLoading, saveNote]);

  return (
    <div className="flex h-screen flex-col">
      <Head>
        <title>
          {note
            ? `LuccaNotes •  ${note.title}`
            : `LuccaNotes •  Loading note...`}
        </title>
      </Head>

      <Navbar noteTitle={note ? note.title : undefined} session={session} />

      {/* Desktop */}
      <div className="hidden h-full overflow-clip md:flex">
        {!note || !tags ? (
          // Loading state
          <>
            {/* Editor */}
            <div className="flex h-full flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
              <Spinner
                className="animate-spin text-gray-400 dark:text-gray-500"
                size={40}
              />
            </div>
            {/* Markdown preview */}
            <div className="flex h-full flex-1 items-center justify-center bg-gray-200 dark:bg-gray-850">
              <Spinner
                className="animate-spin text-gray-400 dark:text-gray-500"
                size={40}
              />
            </div>
          </>
        ) : (
          // Loaded
          <>
            {/* Editor Panel */}
            <MemoedEditorPanel
              mutationLoading={noteContentMutation.isLoading}
              note={note}
              initialContent={props.content}
              setEditorContent={setEditorContent}
              previewOpen={previewOpen}
              setModalOpen={setModalOpen}
              setPreviewOpen={setPreviewOpen}
              saveNote={saveNote}
              debouncedAutoSave={debouncedAutoSave}
            />

            {/* Preview Panel */}
            {previewOpen && (
              <PreviewPanel debouncedEditorContent={debouncedEditorContent} />
            )}
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="block grow md:hidden">
        <Tab.Group as="div" className="flex h-full flex-col">
          <div className="flex justify-between bg-white dark:bg-gray-950">
            {/* Tabs */}
            <Tab.List className="flex gap-0 border-none bg-transparent text-gray-500">
              <Tab className="flex h-12 items-center gap-2.5 rounded-t-lg bg-white px-6 outline-none ui-selected:bg-gray-200 dark:bg-gray-950 dark:ui-selected:bg-gray-850">
                <span className="font-semibold">Editor</span>
              </Tab>

              <Tab className="flex h-12 items-center gap-2.5 rounded-t-lg bg-white px-6 outline-none ui-selected:bg-gray-200 dark:bg-gray-950 dark:ui-selected:bg-gray-850">
                <span className="font-semibold">Preview</span>
              </Tab>
            </Tab.List>

            {/* Buttons */}
            {note && tags && (
              <div className="mr-3 flex items-center gap-1 bg-transparent">
                <Button
                  icon="floppy"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label={
                    noteContentMutation.isLoading ? "Saving..." : "Save note"
                  }
                  tooltipAlignment="xCenter"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => saveNote()}
                  loading={noteContentMutation.isLoading}
                />
                <Button
                  icon="note-pencil-sm"
                  iconOnly
                  intent="secondaryAltTransparent"
                  label="Note options"
                  tooltipAlignment="left"
                  tooltipPosition="bottom"
                  size="regular"
                  onClick={() => setModalOpen(true)}
                />
              </div>
            )}
          </div>
          <Tab.Panels className="flex grow">
            {!note || !tags ? (
              // Loading state
              <>
                {/* Editor */}
                <Tab.Panel className="flex h-full w-full flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900">
                  <Spinner
                    className="animate-spin text-gray-400 dark:text-gray-500"
                    size={40}
                  />
                </Tab.Panel>

                {/* Markdown preview */}
                <Tab.Panel className="flex h-full flex-1 items-center justify-center bg-gray-200 dark:bg-gray-850">
                  <Spinner
                    className="animate-spin text-gray-400 dark:text-gray-500"
                    size={40}
                  />
                </Tab.Panel>
              </>
            ) : (
              <>
                <Tab.Panel>
                  <MemoedEditorPanel
                    mutationLoading={noteContentMutation.isLoading}
                    note={note}
                    initialContent={props.content}
                    setEditorContent={setEditorContent}
                    previewOpen={previewOpen}
                    setModalOpen={setModalOpen}
                    setPreviewOpen={setPreviewOpen}
                    saveNote={saveNote}
                    debouncedAutoSave={debouncedAutoSave}
                  />
                </Tab.Panel>

                <Tab.Panel className="bg-gray-200 pt-4 dark:bg-gray-850">
                  <PreviewPanel
                    debouncedEditorContent={debouncedEditorContent}
                  />
                </Tab.Panel>
              </>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal */}
      {modalOpen && note && tags && (
        <NoteOptionsModal
          open={modalOpen}
          onClose={setModalOpen}
          note={note}
          tags={tags}
        />
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // check if user is logged in
  const session = await getServerAuthSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // parse note ID
  const noteIdParser = z.string().safeParse(context.query.id);
  if (!noteIdParser.success) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // check if this note actually exists
  const note = await prisma.note.findUnique({
    where: { id: noteIdParser.data },
    select: { id: true, userId: true, content: true },
  });

  if (!note) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // check that user owns this note
  if (note.userId !== session.user.id) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  // Pass data to the page via props
  return { props: { session, noteId: note.id, content: note.content } };
};

export default NotePage;

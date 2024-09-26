import './Tiptap.css'

import { FaBold, FaItalic, FaUnderline } from "react-icons/fa6";
import { RxStrikethrough } from "react-icons/rx";
import { ImParagraphLeft } from "react-icons/im";
import { MdFormatListBulleted } from "react-icons/md";
import { GoListOrdered } from "react-icons/go";
import { PiCodeBlockBold } from "react-icons/pi";
import { FaCode } from "react-icons/fa";
import { IoMdUndo, IoMdRedo } from "react-icons/io";


import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'


// define your extension array
const extensions = [StarterKit, Underline, Highlight.configure({ multicolor: true }),  Placeholder.configure({ placeholder: 'Write Your Post Content...',})]

// const content = `<p>Hello</p>`
const content = ``

const Tiptap = ({ setEditorContent }) => {

    const editor = useEditor({
        extensions,
        content,
        onUpdate: ({ editor }) => {
            setEditorContent(editor.getHTML()); // Update context with the editor content
        },
    })

    if (!editor) {
        return null;
    }


    return (
        <div>
            <div className='my-1 _button-group'>
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'is-active' : ''}
                ><FaBold />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={editor.isActive('italic') ? 'is-active' : ''}
                >
                    <FaItalic />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    <RxStrikethrough size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={editor.isActive('underline') ? 'is-active' : ''}
                >
                    <FaUnderline />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                >
                    H3
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
                >
                    H4
                </button>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive('paragraph') ? 'is-active' : ''}
                >
                    <ImParagraphLeft />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'is-active' : ''}
                >
                    <MdFormatListBulleted />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'is-active' : ''}
                >
                    <GoListOrdered />
                </button>

                <button onClick={() => editor.chain().focus().setHardBreak().run()}>
                    Br
                </button>

                <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                    Hr
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    className={editor.isActive('code') ? 'is-active' : ''}
                >
                    <FaCode size={20}/>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'is-active' : ''}
                >
                    <PiCodeBlockBold size={20} />
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: '#b197fc' }).run()}
                    className={editor.isActive('highlight', { color: '#b197fc' }) ? 'is-active' : ''}
                >
                    Purple
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run()}
                    className={editor.isActive('highlight', { color: '#74c0fc' }) ? 'is-active' : ''}
                >
                    Blue
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: '#8ce99a' }).run()}
                    className={editor.isActive('highlight', { color: '#8ce99a' }) ? 'is-active' : ''}
                >
                    Green
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHighlight({ color: 'red' }).run()}
                    className={editor.isActive('highlight', { color: 'red' }) ? 'is-active' : ''}
                >
                    Red
                </button>

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .undo()
                            .run()
                    }
                >
                    <IoMdUndo />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .redo()
                            .run()
                    }
                >
                    <IoMdRedo />
                </button>

            </div>

            <div className=''>
                <EditorContent editor={editor} content={content} />
            </div>


        </div>
    )
}

export default Tiptap

import React, { useState, useEffect, useRef } from 'react';
import styles from './Notes.module.css';
import { format } from 'date-fns';
import { PenLine } from 'lucide-react';
import { motion } from 'framer-motion';

interface NotesProps {
  selectedRange: { start: Date | null; end: Date | null };
}

const Notes: React.FC<NotesProps> = ({ selectedRange }) => {
  const [noteContent, setNoteContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getStorageKey = () => {
    if (selectedRange.start && selectedRange.end) {
      return `calendar_notes_${format(selectedRange.start, 'yyyy-MM-dd')}_${format(selectedRange.end, 'yyyy-MM-dd')}`;
    } else if (selectedRange.start) {
      return `calendar_notes_${format(selectedRange.start, 'yyyy-MM-dd')}`;
    }
    return `calendar_notes_general`;
  };

  const currentKey = getStorageKey();

  useEffect(() => {
    // Load notes from local storage when date selection changes
    const savedNotes = localStorage.getItem(currentKey);
    if (savedNotes) {
      setNoteContent(savedNotes);
    } else {
      setNoteContent('');
    }
  }, [currentKey]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setNoteContent(newVal);

    // Debounce saving
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(currentKey, newVal);
    }, 500);
  };

  let title = "General Notes";
  if (selectedRange.start && selectedRange.end) {
    title = `${format(selectedRange.start, 'MMM d')} - ${format(selectedRange.end, 'MMM d')}`;
  } else if (selectedRange.start) {
    title = format(selectedRange.start, 'MMMM d, yyyy');
  }

  return (
    <div className={styles.notesContainer}>
      <motion.div
        className={styles.notesHeader}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={title}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className={styles.iconWrapper}>
          <PenLine size={16} strokeWidth={2.5} />
        </div>
        <h3 className={styles.title}>{title}</h3>
      </motion.div>
      <div className={`${styles.textareaWrapper} ${isFocused ? styles.focused : ''}`}>
        <div className={styles.textareaBox}>
          <textarea
            className={styles.textarea}
            placeholder="Write down a memo, event, or reminder..."
            value={noteContent}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label={`Notes for ${title}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;

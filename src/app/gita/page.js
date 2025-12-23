// src/app/gita/page.js

import GitaReader from '@/components/GitaReader';

export const metadata = {
  title: 'Bhagavad Gita Reader - AnandaYog',
  description: 'Read the Bhagavad Gita in English, Hindi, and Bengali using an interactive PDF reader. Your reading progress and bookmarks are saved in real-time.',
};

export default function GitaPage() {
    return (
        <GitaReader />
    );
}
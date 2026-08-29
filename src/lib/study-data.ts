export type Flashcard = { id: number; front: string; back: string };

export const flashcards: Flashcard[] = [
  { id: 1, front: "What is photosynthesis?", back: "The process plants use to convert light energy into chemical energy stored as glucose." },
  { id: 2, front: "Mitochondria function?", back: "Powerhouse of the cell — produces ATP through cellular respiration." },
  { id: 3, front: "Define osmosis", back: "Movement of water across a semi-permeable membrane from low to high solute concentration." },
  { id: 4, front: "What is DNA?", back: "Deoxyribonucleic acid — the molecule carrying genetic instructions in living organisms." },
  { id: 5, front: "Newton's Second Law", back: "Force equals mass times acceleration (F = ma)." },
  { id: 6, front: "What is an enzyme?", back: "A protein catalyst that speeds up biochemical reactions without being consumed." },
  { id: 7, front: "Define entropy", back: "A measure of disorder or randomness in a system." },
  { id: 8, front: "What is a covalent bond?", back: "A chemical bond formed by the sharing of electron pairs between atoms." },
  { id: 9, front: "Purpose of the ribosome", back: "Site of protein synthesis, translating mRNA into polypeptide chains." },
  { id: 10, front: "What is diffusion?", back: "Net movement of particles from a region of high to low concentration." },
];

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
};

export const quizQuestions: QuizQuestion[] = [
  { id: 1, question: "Where does photosynthesis mainly occur?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Ribosome"], answer: 1 },
  { id: 2, question: "Which molecule stores genetic information?", options: ["ATP", "Lipid", "DNA", "Glucose"], answer: 2 },
  { id: 3, question: "F = ma describes which law?", options: ["Newton's First", "Newton's Second", "Newton's Third", "Law of Gravity"], answer: 1 },
  { id: 4, question: "Enzymes are made of what?", options: ["Protein", "Carbohydrate", "Nucleic acid", "Lipid"], answer: 0 },
  { id: 5, question: "Osmosis moves which substance?", options: ["Oxygen", "Salt", "Water", "Protein"], answer: 2 },
  { id: 6, question: "Entropy is a measure of…", options: ["Energy", "Disorder", "Mass", "Pressure"], answer: 1 },
];

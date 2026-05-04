// Shared types for the Chat module

export interface ChatConversation {
  id: string;
  name: string;
  avatar: string | null;    // initials fallback if null
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  isGroup: boolean;
  isTyping?: boolean;
  muted?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;          // "me" or participant id
  senderName: string;
  text: string;
  time: string;
  type: "text" | "media" | "typing";
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
}

// ─── Dummy Data ────────────────────────────────────────────────────────────────

export const DUMMY_CONVERSATIONS: ChatConversation[] = [
  {
    id: "1",
    name: "Vedran Mušura",
    avatar: null,
    lastMessage: "Hej Jaki si tam, pogledaj pliz asanu",
    time: "5:48 PM",
    unread: 0,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "2",
    name: "Marko Beljan",
    avatar: null,
    lastMessage: "Okay, čujemo se sutra!",
    time: "4:12 PM",
    unread: 0,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "3",
    name: "Fran Mubrin",
    avatar: null,
    lastMessage: "Fran is typing...",
    time: "3:13 PM",
    unread: 0,
    isOnline: true,
    isGroup: false,
    isTyping: true,
  },
  {
    id: "4",
    name: "Tea Biljak",
    avatar: null,
    lastMessage: "You: poslao sam ti zadnju verziju",
    time: "3:02 PM",
    unread: 0,
    isOnline: false,
    isGroup: false,
  },
  {
    id: "5",
    name: "Josipa Vale",
    avatar: null,
    lastMessage: "Aj navrati na minutu",
    time: "Tuesday",
    unread: 6,
    isOnline: true,
    isGroup: false,
  },
  {
    id: "6",
    name: "Ivor Delić",
    avatar: null,
    lastMessage: "Evo download https://we.tl/2jykpTr0n",
    time: "Monday",
    unread: 0,
    isOnline: false,
    isGroup: false,
    muted: true,
  },
  {
    id: "7",
    name: "Neven Zulijani",
    avatar: null,
    lastMessage: "You: da, meni sve dobro izgleda :3",
    time: "12/11/2016",
    unread: 0,
    isOnline: false,
    isGroup: false,
  },
  {
    id: "8",
    name: "Design Team",
    avatar: null,
    lastMessage: "Ana: the mockups look great!",
    time: "2:40 PM",
    unread: 3,
    isOnline: false,
    isGroup: true,
  },
];

export const DUMMY_MESSAGES: Record<string, ChatMessage[]> = {
  "3": [
    { id: "m1", senderId: "3", senderName: "Fran Mubrin", text: "Ajde još samo to pa smo gotovi", time: "11:44", type: "text" },
    { id: "m2", senderId: "me", senderName: "Me", text: "Samo plis ispucaj što prije da možemo dići gore jer ja moram gibat kroz pol sata ali čujemo se ;)", time: "11:45", type: "text" },
    { id: "m3", senderId: "me", senderName: "Me", text: "Nema problema. Evo jedna za sretan put 🎶\n\nBach - Cello Suite No.1 in G Minor\nJohann Sebastian Bach...\nyoutube.com", time: "11:45", type: "text" },
    { id: "m4", senderId: "me", senderName: "Me", text: "Čujemo se!", time: "11:46", type: "text" },
    { id: "m5", senderId: "3", senderName: "Fran Mubrin", text: "Hvala ti :) Sutra dobivamo feedback i to je to", time: "11:47", type: "text" },
    { id: "m6", senderId: "me", senderName: "Me", text: "Super, dođem malo ranije?", time: "11:47", type: "text" },
    { id: "m7", senderId: "3", senderName: "Fran Mubrin", text: "", time: "", type: "typing" },
  ],
  "1": [
    { id: "m1", senderId: "1", senderName: "Vedran Mušura", text: "Hej Jaki si tam, pogledaj pliz asanu", time: "5:48 PM", type: "text" },
    { id: "m2", senderId: "me", senderName: "Me", text: "Da, odmah gledam!", time: "5:50 PM", type: "text" },
  ],
};

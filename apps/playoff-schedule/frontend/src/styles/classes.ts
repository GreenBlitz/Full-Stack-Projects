// בס"ד

export const classes = {
  container: "mx-auto max-w-4xl px-5",
  mainContent: "mx-auto mt-6 max-w-4xl px-5",

  card: "rounded-xl bg-white shadow-sm",
  cardHover: "transition-shadow hover:shadow-md",
  cardPadding: "p-5",

  badge: "rounded-full px-3 py-1 text-xs font-bold",
  badgeBlue: "bg-blue-50 text-blue-500",
  badgeOrange: "bg-orange-50 text-orange-700",
  badgeRed: "bg-red-50 text-red-800",

  title: "text-3xl font-normal",
  sectionTitle: "mb-5 border-b-2 border-gray-200 pb-2 text-2xl text-gray-800",
  subtitle: "text-sm font-bold uppercase tracking-wider",

  textGray: "text-gray-900",
  textGrayLight: "text-gray-500",
  textGrayLighter: "text-gray-400",

  borderLeft: "border-l-[6px]",
  borderBlue: "border-blue-500",
  borderAmber: "border-amber-500",

  searchInput:
    "flex-1 rounded-md border-2 border-slate-400 bg-slate-600 p-3 text-base text-white outline-none transition-colors placeholder:text-slate-300 focus:border-blue-400",

  button:
    "rounded-md px-6 py-3 text-base font-bold transition disabled:opacity-70",
  buttonPrimary: "bg-slate-500 text-white hover:bg-slate-400",
} as const;

const searchTypes = {
  keyword: "keyword",
  title: "title",
} as const;

type SearchType = keyof typeof searchTypes;

type SearchTypeUppercased = Uppercase<SearchType>; // "KEYWORD" | "TITLE"
type SearchTypeLowercased = Lowercase<SearchTypeUppercased>; //"keyword" | "title"
type SearchTypeCapitalized = Capitalize<SearchType>; // "Keyword" | "Title"
type SearchTypeUnCapitalized = Capitalize<SearchTypeCapitalized>; // "Keyword" | "Title"

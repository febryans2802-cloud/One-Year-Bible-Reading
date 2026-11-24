// Books of the Protestant canon with chapter counts (1,189 chapters total).
// `track` is used by the Balanced plan: ot = Old Testament narrative/prophets,
// wis = Psalms & Proverbs, nt = New Testament.
const BIBLE_BOOKS = [
  ["Genesis",50,"ot"],["Exodus",40,"ot"],["Leviticus",27,"ot"],["Numbers",36,"ot"],
  ["Deuteronomy",34,"ot"],["Joshua",24,"ot"],["Judges",21,"ot"],["Ruth",4,"ot"],
  ["1 Samuel",31,"ot"],["2 Samuel",24,"ot"],["1 Kings",22,"ot"],["2 Kings",25,"ot"],
  ["1 Chronicles",29,"ot"],["2 Chronicles",36,"ot"],["Ezra",10,"ot"],["Nehemiah",13,"ot"],
  ["Esther",10,"ot"],["Job",42,"ot"],["Psalms",150,"wis"],["Proverbs",31,"wis"],
  ["Ecclesiastes",12,"ot"],["Song of Songs",8,"ot"],["Isaiah",66,"ot"],["Jeremiah",52,"ot"],
  ["Lamentations",5,"ot"],["Ezekiel",48,"ot"],["Daniel",12,"ot"],["Hosea",14,"ot"],
  ["Joel",3,"ot"],["Amos",9,"ot"],["Obadiah",1,"ot"],["Jonah",4,"ot"],["Micah",7,"ot"],
  ["Nahum",3,"ot"],["Habakkuk",3,"ot"],["Zephaniah",3,"ot"],["Haggai",2,"ot"],
  ["Zechariah",14,"ot"],["Malachi",4,"ot"],
  ["Matthew",28,"nt"],["Mark",16,"nt"],["Luke",24,"nt"],["John",21,"nt"],["Acts",28,"nt"],
  ["Romans",16,"nt"],["1 Corinthians",16,"nt"],["2 Corinthians",13,"nt"],["Galatians",6,"nt"],
  ["Ephesians",6,"nt"],["Philippians",4,"nt"],["Colossians",4,"nt"],["1 Thessalonians",5,"nt"],
  ["2 Thessalonians",3,"nt"],["1 Timothy",6,"nt"],["2 Timothy",4,"nt"],["Titus",3,"nt"],
  ["Philemon",1,"nt"],["Hebrews",13,"nt"],["James",5,"nt"],["1 Peter",5,"nt"],
  ["2 Peter",3,"nt"],["1 John",5,"nt"],["2 John",1,"nt"],["3 John",1,"nt"],
  ["Jude",1,"nt"],["Revelation",22,"nt"],
].map(([name, chapters, track]) => ({ name, chapters, track }));

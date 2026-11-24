// Per-book data for study links. Every URL pattern below was checked against
// the live sites for the first and last chapter of each book (see README).
// [zh full name, zh abbreviation (FHL), BibleHub slug, Enduring Word slug,
//  BibleProject overview video slugs, 查經資料大全 book index path]
// English book codes used by FHL (bible.fhl.net) commentary pages.
const FHL_ENG = ["Gen","Ex","Lev","Num","Deut","Josh","Judg","Ruth","1 Sam","2 Sam","1 Kin","2 Kin","1 Chr","2 Chr","Ezra","Neh","Esth","Job","Ps","Prov","Eccl","Song","Is","Jer","Lam","Ezek","Dan","Hos","Joel","Amos","Obad","Jon","Mic","Nah","Hab","Zeph","Hag","Zech","Mal","Matt","Mark","Luke","John","Acts","Rom","1 Cor","2 Cor","Gal","Eph","Phil","Col","1 Thess","2 Thess","1 Tim","2 Tim","Titus","Philem","Heb","James","1 Pet","2 Pet","1 John","2 John","3 John","Jude","Rev"];

const STUDY_BOOKS = [
  ["創世記","創","genesis","genesis",["genesis-1-11","genesis-12-50"],"Old%20Testament/01Gen/01index-T.htm"],
  ["出埃及記","出","exodus","exodus",["exodus-1-18","exodus-19-40"],"Old%20Testament/02Exo/02index-T.htm"],
  ["利未記","利","leviticus","leviticus",["leviticus"],"Old%20Testament/03Lev/03index-T.htm"],
  ["民數記","民","numbers","numbers",["numbers"],"Old%20Testament/04Num/04index-T.htm"],
  ["申命記","申","deuteronomy","deuteronomy",["deuteronomy"],"Old%20Testament/05Deut/05index-T.htm"],
  ["約書亞記","書","joshua","joshua",["joshua"],"Old%20Testament/06Josh/06index-T.htm"],
  ["士師記","士","judges","judges",["judges"],"Old%20Testament/07Judg/07index-T.htm"],
  ["路得記","得","ruth","ruth",["ruth"],"Old%20Testament/08Ruth/08index-T.htm"],
  ["撒母耳記上","撒上","1_samuel","1-samuel",["1-samuel"],"Old%20Testament/09%201Sam/09index-T.htm"],
  ["撒母耳記下","撒下","2_samuel","2-samuel",["2-samuel"],"Old%20Testament/10%202Sam/10index-T.htm"],
  ["列王紀上","王上","1_kings","1-kings",["kings"],"Old%20Testament/11%201King/11index-T.htm"],
  ["列王紀下","王下","2_kings","2-kings",["kings"],"Old%20Testament/12%202King/12index-T.htm"],
  ["歷代志上","代上","1_chronicles","1-chronicles",["chronicles"],"Old%20Testament/13%201Chro/13index-T.htm"],
  ["歷代志下","代下","2_chronicles","2-chronicles",["chronicles"],"Old%20Testament/14%202Chro/14index-T.htm"],
  ["以斯拉記","拉","ezra","ezra",["ezra-nehemiah"],"Old%20Testament/15Ezra/15index-T.htm"],
  ["尼希米記","尼","nehemiah","nehemiah",["ezra-nehemiah"],"Old%20Testament/16Neh/16index-T.htm"],
  ["以斯帖記","斯","esther","esther",["esther"],"Old%20Testament/17Esth/17index-T.htm"],
  ["約伯記","伯","job","job",["job"],"Old%20Testament/18Job/18index-T.htm"],
  ["詩篇","詩","psalms","psalm",["psalms"],"Old%20Testament/19Psa/19index-T.htm"],
  ["箴言","箴","proverbs","proverbs",["proverbs"],"Old%20Testament/20Prov/20index-T.htm"],
  ["傳道書","傳","ecclesiastes","ecclesiastes",["ecclesiastes"],"Old%20Testament/21Eccl/21index-T.htm"],
  ["雅歌","歌","songs","song-of-solomon",["song-songs"],"Old%20Testament/22Song/22index-T.htm"],
  ["以賽亞書","賽","isaiah","isaiah",["isaiah-1-39","isaiah-40-66"],"Old%20Testament/23Isa/23index-T.htm"],
  ["耶利米書","耶","jeremiah","jeremiah",["jeremiah"],"Old%20Testament/24Jer/24index-T.htm"],
  ["耶利米哀歌","哀","lamentations","lamentations",["lamentations"],"Old%20Testament/25Lam/25index-T.htm"],
  ["以西結書","結","ezekiel","ezekiel",["ezekiel-1-33","ezekiel-34-48"],"Old%20Testament/26Ezek/26index-T.htm"],
  ["但以理書","但","daniel","daniel",["daniel"],"Old%20Testament/27Dan/27index-T.htm"],
  ["何西阿書","何","hosea","hosea",["hosea"],"Old%20Testament/28Hosea/28index-T.htm"],
  ["約珥書","珥","joel","joel",["joel"],"Old%20Testament/29Joel/29index-T.htm"],
  ["阿摩司書","摩","amos","amos",["amos"],"Old%20Testament/30Amos/30index-T.htm"],
  ["俄巴底亞書","俄","obadiah","obadiah",["obadiah"],"Old%20Testament/31Obad/31index-T.htm"],
  ["約拿書","拿","jonah","jonah",["jonah"],"Old%20Testament/32Jonah/32index-T.htm"],
  ["彌迦書","彌","micah","micah",["micah"],"Old%20Testament/33Micah/33index-T.htm"],
  ["那鴻書","鴻","nahum","nahum",["nahum"],"Old%20Testament/34Nah/34index-T.htm"],
  ["哈巴谷書","哈","habakkuk","habakkuk",["habakkuk"],"Old%20Testament/35Habak/35index-T.htm"],
  ["西番雅書","番","zephaniah","zephaniah",["zephaniah"],"Old%20Testament/36Zeph/36index-T.htm"],
  ["哈該書","該","haggai","haggai",["haggai"],"Old%20Testament/37Hagg/37index-T.htm"],
  ["撒迦利亞書","亞","zechariah","zechariah",["zechariah"],"Old%20Testament/38Zech/38index-T.htm"],
  ["瑪拉基書","瑪","malachi","malachi",["malachi"],"Old%20Testament/39Mal/39index-T.htm"],
  ["馬太福音","太","matthew","matthew",["matthew-1-13","matthew-14-28"],"New%20Testament/40Matt/40index-T.html"],
  ["馬可福音","可","mark","mark",["mark"],"New%20Testament/41Mark/41index-T.html"],
  ["路加福音","路","luke","luke",["luke-1-9","luke-10-24"],"New%20Testament/42Luke/42index-T.html"],
  ["約翰福音","約","john","john",["john-1-12","john-13-21"],"New%20Testament/43John/43index-T.html"],
  ["使徒行傳","徒","acts","acts",["acts-1-12","acts-13-28"],"New%20Testament/44Acts/44index-T.html"],
  ["羅馬書","羅","romans","romans",["romans-1-4","romans-5-16"],"New%20Testament/45Rom/45index-T.html"],
  ["哥林多前書","林前","1_corinthians","1-corinthians",["1-corinthians"],"New%20Testament/46%201Cor/46index-T.html"],
  ["哥林多後書","林後","2_corinthians","2-corinthians",["2-corinthians"],"New%20Testament/47%202Cor/47index-T.html"],
  ["加拉太書","加","galatians","galatians",["galatians"],"New%20Testament/48Gal/48index-T.html"],
  ["以弗所書","弗","ephesians","ephesians",["ephesians"],"New%20Testament/49Eph/49index-T.html"],
  ["腓立比書","腓","philippians","philippians",["philippians"],"New%20Testament/50Phil/50index-T.html"],
  ["歌羅西書","西","colossians","colossians",["colossians"],"New%20Testament/51Col/51index-T.html"],
  ["帖撒羅尼迦前書","帖前","1_thessalonians","1-thessalonians",["1-thessalonians"],"New%20Testament/52%201Thes/52index-T.html"],
  ["帖撒羅尼迦後書","帖後","2_thessalonians","2-thessalonians",["2-thessalonians"],"New%20Testament/53%202Thes/53index-T.html"],
  ["提摩太前書","提前","1_timothy","1-timothy",["1-timothy"],"New%20Testament/54%201Tim/54index-T.html"],
  ["提摩太後書","提後","2_timothy","2-timothy",["2-timothy"],"New%20Testament/55%202Tim/55index-T.html"],
  ["提多書","多","titus","titus",["titus"],"New%20Testament/56Titus/56index-T.html"],
  ["腓利門書","門","philemon","philemon",["philemon"],"New%20Testament/57Philem/57index-T.html"],
  ["希伯來書","來","hebrews","hebrews",["hebrews"],"New%20Testament/58Heb/58index-T.html"],
  ["雅各書","雅","james","james",["james"],"New%20Testament/59James/59index-T.html"],
  ["彼得前書","彼前","1_peter","1-peter",["1-peter"],"New%20Testament/60%201Pet/60index-T.html"],
  ["彼得後書","彼後","2_peter","2-peter",["2-peter"],"New%20Testament/61%202Pet/61index-T.html"],
  ["約翰一書","約一","1_john","1-john",["1-3-john"],"New%20Testament/62%201John/62index-T.html"],
  ["約翰二書","約二","2_john","2-john",["1-3-john"],"New%20Testament/63%202John/63index-T.html"],
  ["約翰三書","約三","3_john","3-john",["1-3-john"],"New%20Testament/64%203John/64index-T.html"],
  ["猶大書","猶","jude","jude",["jude"],"New%20Testament/65Jude/65index-T.html"],
  ["啟示錄","啟","revelation","revelation",["revelation-1-11","revelation-12-22"],"New%20Testament/66Rev/66index-T.html"],
].map(([zh, zhAbbr, hub, ew, bp, cc], i) => ({ zh, zhAbbr, hub, ew, bp, cc, fhlEng: FHL_ENG[i] }));

// Builds the list of links for one chapter / one book.
const STUDY = {
  chapterLinks(bi, c) {
    const b = BIBLE_BOOKS[bi], s = STUDY_BOOKS[bi];
    const ref = `${b.name} ${c}`;
    return {
      en: [
        { name: "NET Bible notes", note: "Translators' notes beside the text", url: `https://netbible.org/bible/${encodeURIComponent(b.name).replace(/%20/g, "+")}+${c}` },
        { name: "Enduring Word", note: "Modern verse-by-verse commentary (David Guzik)", url: `https://enduringword.com/bible-commentary/${s.ew}-${c}/` },
        { name: "Matthew Henry", note: "Classic devotional commentary (1706)", url: `https://biblehub.com/commentaries/mhc/${s.hub}/${c}.htm` },
        { name: "All commentaries", note: `About 20 classic commentaries on ${ref}:1, via Bible Hub`, url: `https://biblehub.com/commentaries/${s.hub}/${c}-1.htm` },
      ],
      zh: [
        { name: "信望愛 註釋", note: "CBOL 註釋資料", url: `https://bible.fhl.net/new/com.php?book=3&engs=${encodeURIComponent(s.fhlEng)}&chap=${c}&sec=1` },
        { name: "信望愛 和合本", note: "中文經文、原文、串珠", url: `https://bible.fhl.net/new/read.php?chineses=${encodeURIComponent(s.zhAbbr)}&chap=${c}` },
      ],
    };
  },
  bookLinks(bi) {
    const s = STUDY_BOOKS[bi];
    const parts = s.bp.length > 1;
    return {
      videos: s.bp.map((slug, i) => ({ name: parts ? `BibleProject overview, part ${i + 1}` : "BibleProject overview video", url: `https://bibleproject.com/videos/${slug}/` })),
      zh: [{ name: `查經資料大全：${s.zh}`, note: "多本中文註釋、講章與查經資料", url: `https://www.ccbiblestudy.org/${s.cc}` }],
    };
  },
};

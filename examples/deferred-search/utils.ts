type HighlightItem = {
  text: string;
  highlight: boolean;
};

const highlight = {
  match: (text: string, query: string, formatted: string): Array<Array<number>> => {
    const idxs: Array<number> = [];
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    let idxCorr = 0;
    let queryLengthCorr = 0;

    if (idx !== -1 && text !== formatted && query.length > 0) {
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== formatted[i + idxs.length]) {
          while (text[i] !== formatted[i + idxs.length]) {
            idxs.push(i + idxs.length);
          }
        }
      }
      for (let i = 0; i < idxs.length; i++) {
        if (idxs[i] <= idx + idxCorr) {
          idxCorr += 1;
        }
        if (idxs[i] < idx + query.length + queryLengthCorr) {
          queryLengthCorr += 1;
        }
      }
    }

    return idx !== -1 ? [[idx + idxCorr, idx + query.length + queryLengthCorr]] : [];
  },
  parse: (text: string, matches: Array<Array<number>>) => {
    const result: Array<HighlightItem> = [];

    matches.forEach(match => {
      result.push(
        { text: text.substring(0, match[0]), highlight: false },
        { text: text.substring(match[0], match[1]), highlight: true },
        { text: text.substring(match[1], text.length), highlight: false },
      );
    });

    if (matches.length === 0) {
      result.push({ text, highlight: false });
    }

    return result.filter(x => Boolean(x.text));
  },
};

export { highlight };

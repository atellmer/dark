const SEED = 5381;
const SIZE = 6;
const map = { 0: 'a', 1: 'b', 2: 'c', 3: 'd', 4: 'e', 5: 'f', 6: 'g', 7: 'h', 8: 'i', 9: 'j' };

function phash(h: number, x: string) {
  let i = x.length;

  while (i) {
    h = (h * 33) ^ x.charCodeAt(--i);
  }

  return h;
}

function hash(x: string) {
  const source = phash(SEED, x);
  const hash = String(source)
    .slice(0, SIZE)
    .split('')
    .map(x => map[x])
    .join('');

  return hash;
}

export { hash };

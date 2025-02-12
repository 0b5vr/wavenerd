interface BracePair {
  from: number;
  to: number;
  depth: number;
  content: string;
  firstLine: string;
}

/**
 * Finds all brace pairs in the code.
 */
export function findAllBracePairs(code: string): BracePair[] {
  const openStack: number[] = [];
  const childrenStack: BracePair[][] = [[]];

  for (const match of code.matchAll(/[{}]/g)) {
    const brace = match[0];
    const from = match.index;
    const to = from + match[0].length;

    if (brace === '{') {
      openStack.push(from);
      childrenStack.push([]);
    } else {
      const from = openStack.pop();

      if (from != null) {
        const children = childrenStack.pop();

        const depth = openStack.length;
        const content = code.slice(from, to);

        const firstLineFrom = code.slice(0, from).lastIndexOf('\n') + 1;
        const firstLineTo = firstLineFrom + code.slice(firstLineFrom).indexOf('\n');
        const firstLine = code.slice(firstLineFrom, firstLineTo);

        childrenStack[childrenStack.length - 1].push(
          { from, to, depth, content, firstLine },
          ...children!,
        );
      }
    }
  }

  return childrenStack[0];
}

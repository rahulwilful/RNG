export const calculate2Series = group => {
  let count = 0;

  for (let i = 0; i < group.length; i++) {
    if (group[i]?.winningNumber && group[i + 1]?.winningNumber) {
      count++;
    }

    if (!group[i].winningNumber && !group[i + 1].winningNumber) {
      count++;
    }
  }

  return count;
};

export const calculate3Series = group => {
  let count = 0;

  for (let i = 0; i < group.length; i++) {
    if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber) {
      count++;
    }

    if (!group[i].winningNumber && !group[i + 1].winningNumber && !group[i + 2].winningNumber) {
      count++;
    }
  }

  return count;
};

export const calculate4Series = group => {
  let count = 0;

  for (let i = 0; i < group.length; i++) {
    if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber && group[i + 3]?.winningNumber) {
      count++;
    }

    if (!group[i].winningNumber && !group[i + 1].winningNumber && !group[i + 2].winningNumber && !group[i + 3].winningNumber) {
      count++;
    }
  }

  return count;
};

export const calculate5Series = group => {
  let count = 0;

  for (let i = 0; i < group.length; i++) {
    if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber && group[i + 3]?.winningNumber && group[i + 4]?.winningNumber) {
      count++;
    }

    if (!group[i].winningNumber && !group[i + 1].winningNumber && !group[i + 2].winningNumber && !group[i + 3].winningNumber && !group[i + 4].winningNumber) {
      count++;
    }
  }

  return count;
};

export const calculate6Series = group => {
  let count = 0;

  for (let i = 0; i < group.length; i++) {
    if (group[i]?.winningNumber && group[i + 1]?.winningNumber && group[i + 2]?.winningNumber && group[i + 3]?.winningNumber && group[i + 4]?.winningNumber && group[i + 5]?.winningNumber) {
      count++;
    }

    if (!group[i].winningNumber && !group[i + 1].winningNumber && !group[i + 2].winningNumber && !group[i + 3].winningNumber && !group[i + 4].winningNumber && !group[i + 5].winningNumber) {
      count++;
    }
  }

  return count;
};

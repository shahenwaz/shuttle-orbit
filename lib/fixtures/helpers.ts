export function distributeTeamsAcrossGroups(
  teamCount: number,
  groupSizes: number[],
) {
  const totalCapacity = groupSizes.reduce((sum, size) => sum + size, 0);

  if (totalCapacity !== teamCount) {
    throw new Error(
      `Group size total (${totalCapacity}) does not match team count (${teamCount}).`,
    );
  }

  return groupSizes;
}

export function validateQualifierCounts(
  groupSizes: number[],
  qualifiersPerGroup: number[],
) {
  if (groupSizes.length !== qualifiersPerGroup.length) {
    throw new Error(
      "Group sizes and qualifier counts must have the same length.",
    );
  }

  qualifiersPerGroup.forEach((qualifierCount, index) => {
    if (qualifierCount < 0 || qualifierCount > groupSizes[index]) {
      throw new Error(`Invalid qualifier count for group ${index + 1}.`);
    }
  });

  return true;
}

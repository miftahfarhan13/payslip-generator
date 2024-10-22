export function truncate(str: string, n: number) {
  return str?.length > n ? `${str?.substring(0, n - 1)}...` : str;
}

export function generateAliasName(fullName: string) {
  const nameParts = fullName?.trim().split(/\s+/);
  if (nameParts?.length === 1) {
    return nameParts[0][0]?.toUpperCase();
  }

  const firstInitial = nameParts ? nameParts[0][0]?.toUpperCase() : "";
  const lastInitial = nameParts
    ? nameParts[nameParts?.length - 1][0]?.toUpperCase()
    : "";

  return firstInitial + lastInitial;
}

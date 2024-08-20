interface WithId {
  id: string;
}

export default function getUID<T extends WithId>(arr: T[]): string {
  for (let i = 1; i <= arr.length; i++) {
    if (!arr.find((item) => item.id === i.toString())) {
      return i.toString();
    }
  }

  return (arr.length + 1).toString();
}

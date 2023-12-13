export const areAllSearchParamsEmpty = (searchParams) => {
    return Object.values(searchParams).every((value) => value === '');
  };
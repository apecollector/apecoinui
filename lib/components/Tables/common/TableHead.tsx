export const TableHead = () => {
  return (
    <thead className="border-b border-zinc-200 dark:border-zinc-700">
      <tr className="flex">
        <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
          Token ID
        </th>
        <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
          Deposit ApeCoin
        </th>
        <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
          Staked ApeCoin
        </th>
        <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
          Unclaimed ApeCoin
        </th>
      </tr>
    </thead>
  );
};

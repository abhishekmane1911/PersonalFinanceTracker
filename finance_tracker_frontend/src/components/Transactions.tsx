import { useQuery } from "@tanstack/react-query";
import { fetchTransactions } from "../api";

// Define TypeScript interface for transactions
interface Transaction {
  id: number;
  description: string;
  amount: number;
}

const Transactions = () => {
  const { data, error, isLoading } = useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  if (isLoading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error.message || "Failed to load transactions"}</p>;

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {data?.length ? (
          data.map((transaction) => (
            <li key={transaction.id}>
              {transaction.description} -{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(transaction.amount)}
            </li>
          ))
        ) : (
          <p>No transactions available.</p>
        )}
      </ul>
    </div>
  );
};

export default Transactions;
export type actionFunction = (
  prevState: { message: string },
  formData: FormData,
) => Promise<{ message: string; success?: boolean }>;

export type CartItemWithProduct = {
  id: string;
  amount: number;
  product: {
    id: string;
    image: string;
    name: string;
    company: string;
    price: number;
  };
};

"use client";

import { removeCartItemAction, updateCartItemAction } from "@/utils/actions";
import { useState } from "react";
import { toast } from "sonner";
import SubmitButton from "../form/Buttons";
import FormContainer from "../form/FormContainer";
import SelectProductAmount, {
  Mode,
} from "../single-product/SelectProductAmount";

export default function ThirdColumn({
  quantity,
  id,
}: {
  quantity: number;
  id: string;
}) {
  const [amount, setAmount] = useState(quantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleAmountChange = async (value: number) => {
    setIsLoading(true);
    toast("Calculating...");
    const result = await updateCartItemAction({
      amount: value,
      cartItemId: id,
    });
    setAmount(value);
    toast(result.message);
    setIsLoading(false);
  };

  return (
    <div className="md:ml-8">
      <SelectProductAmount
        amount={amount}
        setAmount={handleAmountChange}
        mode={Mode.CartItem}
        isLoading={false}
      />
      <FormContainer action={removeCartItemAction}>
        <input
          type="hidden"
          name="id"
          value={id}
        />
        <SubmitButton
          size={"sm"}
          className="mt-4"
          text="remove"
        />
      </FormContainer>
    </div>
  );
}
